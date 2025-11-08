export interface LLMJobSubmitResponse {
  occurrenceId: string;
  submittedCount: number;
  skippedCount: number;
  submitted: {
    jobId: string;
    inputS3Uri: string;
    outputS3Uri: string;
    fileName: string;
    dryRun: boolean;
  }[];
  skipped: Record<string, unknown>[];
  dryRun: boolean;
}

export interface LLMJobStatus {
  jobId: string;
  status: string;
  serviceRawHint?: string;
  ddb?: {
    occurrenceId: string;
    outputS3Uri: string;
    createdAt: string;
    lastKnownStatus: string;
  };
  outputs?: {
    key: string;
    size: number;
    json: boolean;
    content?: Record<string, unknown>;
  }[];
  inferredStatus?: string;
  // Novos campos que vêm diretamente da API
  occurrenceId?: string;
  description?: string;
  dangerous_items_detected?: boolean;
  seller_detected?: boolean;
  summary?: string;
}

export interface LLMAnalysisResult {
  seller: boolean;
  description: string;
  dangerousItems: boolean;
  summary?: string;
}

class LLMService {
  private readonly submitUrl = '/api/llm/submit';
  private readonly v1StatusUrl = '/api/llm/v1';

  /**
   * Submete uma ocorrência para análise com LLM
   */
  async submitForAnalysis(occurrenceId: number): Promise<LLMJobSubmitResponse> {
    try {
      const response = await fetch(this.submitUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          occurrenceId: occurrenceId
        })
      });

      if (!response.ok) {
        throw new Error(`Erro ao submeter para análise: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao submeter para análise LLM:', error);
      throw error;
    }
  }

  /**
   * Verifica o status de um job do LLM
   */
  async checkJobStatus(jobId: string): Promise<LLMJobStatus> {
    console.log('LLMService - Verificando status do job:', jobId);
    
    // Usar apenas a rota correta v1 com GET
    const url = `${this.v1StatusUrl}/${encodeURIComponent(jobId)}`;
    
    try {
      console.log(`LLMService - Fazendo requisição GET: ${url}`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      console.log(`LLMService - Resposta:`, response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`LLMService - Erro da API:`, response.status, errorText);
        throw new Error(`Erro ao verificar status: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('LLMService - Dados recebidos:', data);
      return data;

    } catch (error) {
      console.error('LLMService - Erro ao verificar status do job:', error);
      throw error;
    }
  }

  /**
   * Monitora um job até a conclusão com polling
   */
  async monitorJob(
    jobId: string, 
    onStatusUpdate: (status: LLMJobStatus) => void,
    intervalMs: number = 5000,
    maxAttempts: number = 60
  ): Promise<LLMJobStatus> {
    let attempts = 0;
    
    return new Promise((resolve, reject) => {
      const checkStatus = async () => {
        try {
          const status = await this.checkJobStatus(jobId);
          onStatusUpdate(status);

          // Job concluído com sucesso - verificar se já tem dados de análise
          if (status.inferredStatus === 'SUCCEEDED' || 
              status.status === 'PROCESSED' || 
              status.status === 'COMPLETED' ||
              (status.description && status.dangerous_items_detected !== undefined)) {
            console.log('LLMService - Job concluído, parando monitoramento');
            resolve(status);
            return;
          }

          // Job falhou
          if (status.inferredStatus === 'FAILED' || status.status === 'FAILED') {
            reject(new Error(`Job falhou: ${status.status}`));
            return;
          }

          // Se status é Unknown mas tem dados de análise, considerar concluído
          if (status.status === 'Unknown' && status.description) {
            console.log('LLMService - Status Unknown mas com dados, considerando concluído');
            resolve(status);
            return;
          }

          // Continuar monitorando
          attempts++;
          if (attempts >= maxAttempts) {
            reject(new Error('Timeout: Job não concluído no tempo esperado'));
            return;
          }

          setTimeout(checkStatus, intervalMs);
        } catch (error) {
          reject(error);
        }
      };

      checkStatus();
    });
  }

  /**
   * Extrai resultado da análise LLM dos dados do job
   */
  extractAnalysisResult(jobStatus: LLMJobStatus): LLMAnalysisResult | null {
    try {
      // Se os dados já vêm diretamente na resposta (novo formato)
      if (jobStatus.description || jobStatus.dangerous_items_detected !== undefined) {
        console.log('LLMService - Extraindo dados do formato novo (direto)');
        return {
          seller: Boolean(jobStatus.seller_detected) || false,
          description: String(jobStatus.description || ''),
          dangerousItems: Boolean(jobStatus.dangerous_items_detected) || false,
          summary: String(jobStatus.summary || '')
        };
      }

      // Fallback para formato antigo com outputs (se existir)
      if (jobStatus.outputs && jobStatus.outputs.length > 0) {
        console.log('LLMService - Tentando extrair do formato antigo (outputs)');
        const customOutput = jobStatus.outputs.find(output => 
          output.json && 
          output.key.includes('custom_output') && 
          output.content?.inference_result
        );

        if (customOutput?.content?.inference_result) {
          const result = customOutput.content.inference_result as Record<string, unknown>;
          
          // Procurar também pelo summary no standard output
          const standardOutput = jobStatus.outputs.find(output => 
            output.json && 
            output.key.includes('standard_output') && 
            (output.content as Record<string, unknown>)?.video
          );

          const videoContent = standardOutput?.content as { video?: { summary?: string } };

          return {
            seller: Boolean(result.Seller) || false,
            description: String(result.Description || ''),
            dangerousItems: Boolean(result.Dangerous_Items) || false,
            summary: videoContent?.video?.summary || ''
          };
        }
      }

      console.log('LLMService - Nenhum formato de dados encontrado');
      return null;
    } catch (error) {
      console.error('Erro ao extrair resultado da análise:', error);
      return null;
    }
  }
}

export const llmService = new LLMService();