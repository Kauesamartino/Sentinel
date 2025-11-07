import { useState, useCallback, useRef } from 'react';
import { llmService, LLMJobStatus, LLMAnalysisResult } from '@/services/llmService';

export interface LLMAnalysisState {
  isAnalyzing: boolean;
  jobId: string | null;
  status: string | null;
  result: LLMAnalysisResult | null;
  error: string | null;
  progress: {
    stage: 'submitting' | 'processing' | 'completed' | 'error';
    message: string;
  };
}

export const useLLMAnalysis = () => {
  const [analysisStates, setAnalysisStates] = useState<Record<number, LLMAnalysisState>>({});
  const monitoringJobs = useRef<Set<string>>(new Set());

  const initializeAnalysis = useCallback((occurrenceId: number) => {
    setAnalysisStates(prev => ({
      ...prev,
      [occurrenceId]: {
        isAnalyzing: false,
        jobId: null,
        status: null,
        result: null,
        error: null,
        progress: {
          stage: 'submitting',
          message: 'Preparando análise...'
        }
      }
    }));
  }, []);

  const updateAnalysisState = useCallback((occurrenceId: number, updates: Partial<LLMAnalysisState>) => {
    setAnalysisStates(prev => ({
      ...prev,
      [occurrenceId]: {
        ...prev[occurrenceId],
        ...updates
      }
    }));
  }, []);

  const startAnalysis = useCallback(async (occurrenceId: number) => {
    try {
      // Inicializar estado
      initializeAnalysis(occurrenceId);
      updateAnalysisState(occurrenceId, {
        isAnalyzing: true,
        progress: {
          stage: 'submitting',
          message: 'Enviando para análise...'
        }
      });

      // Submeter para análise
      const submitResponse = await llmService.submitForAnalysis(occurrenceId);
      
      if (submitResponse.submitted.length === 0) {
        throw new Error('Nenhum job foi submetido para análise');
      }

      const jobId = submitResponse.submitted[0].jobId;
      
      updateAnalysisState(occurrenceId, {
        jobId,
        progress: {
          stage: 'processing',
          message: 'Processando com IA...'
        }
      });

      // Evitar monitoramento duplicado
      if (monitoringJobs.current.has(jobId)) {
        return;
      }
      monitoringJobs.current.add(jobId);

      // Monitorar job
      const finalStatus = await llmService.monitorJob(
        jobId,
        (status: LLMJobStatus) => {
          updateAnalysisState(occurrenceId, {
            status: status.inferredStatus,
            progress: {
              stage: 'processing',
              message: `Status: ${status.inferredStatus}`
            }
          });
        },
        3000, // Verificar a cada 3 segundos
        100   // Máximo 5 minutos (100 * 3s)
      );

      // Extrair resultado
      const result = llmService.extractAnalysisResult(finalStatus);
      
      updateAnalysisState(occurrenceId, {
        isAnalyzing: false,
        result,
        progress: {
          stage: 'completed',
          message: 'Análise concluída!'
        }
      });

      monitoringJobs.current.delete(jobId);
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      
      updateAnalysisState(occurrenceId, {
        isAnalyzing: false,
        error: errorMessage,
        progress: {
          stage: 'error',
          message: `Erro: ${errorMessage}`
        }
      });

      // Limpar job do monitoramento em caso de erro
      const state = analysisStates[occurrenceId];
      if (state?.jobId) {
        monitoringJobs.current.delete(state.jobId);
      }

      throw error;
    }
  }, [analysisStates, initializeAnalysis, updateAnalysisState]);

  const getAnalysisState = useCallback((occurrenceId: number): LLMAnalysisState | null => {
    return analysisStates[occurrenceId] || null;
  }, [analysisStates]);

  const clearAnalysis = useCallback((occurrenceId: number) => {
    setAnalysisStates(prev => {
      const newState = { ...prev };
      delete newState[occurrenceId];
      return newState;
    });
  }, []);

  const isAnalyzing = useCallback((occurrenceId: number): boolean => {
    return analysisStates[occurrenceId]?.isAnalyzing || false;
  }, [analysisStates]);

  return {
    analysisStates,
    startAnalysis,
    getAnalysisState,
    clearAnalysis,
    isAnalyzing
  };
};