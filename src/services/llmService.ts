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
  serviceRawHint: string;
  ddb: {
    occurrenceId: string;
    outputS3Uri: string;
    createdAt: string;
    lastKnownStatus: string;
  };
  outputs: {
    key: string;
    size: number;
    json: boolean;
    content?: Record<string, unknown>;
  }[];
  inferredStatus: string;
}

export interface LLMAnalysisResult {
  seller: boolean;
  description: string;
  dangerousItems: boolean;
  summary?: string;
}

class LLMService {
  private readonly submitUrl = '/api/llm/submit';
  private readonly statusBaseUrl = '/api/llm/status';

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
    try {
      const response = await fetch(`${this.statusBaseUrl}/${jobId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Erro ao verificar status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao verificar status do job:', error);
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

          // Job concluído com sucesso
          if (status.inferredStatus === 'SUCCEEDED' || status.status === 'PROCESSED') {
            resolve(status);
            return;
          }

          // Job falhou
          if (status.inferredStatus === 'FAILED' || status.status === 'FAILED') {
            reject(new Error(`Job falhou: ${status.status}`));
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
      // Procurar pelo resultado customizado nos outputs
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

      return null;
    } catch (error) {
      console.error('Erro ao extrair resultado da análise:', error);
      return null;
    }
  }
}

export const llmService = new LLMService();