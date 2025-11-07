import { useState, useEffect, useCallback } from 'react';
import { 
  getDashboardData, 
  processOcorrenciasPorTempo, 
  processOcorrenciasPorTipo, 
  processOcorrenciasPorStatus, 
  processOcorrenciasPorSeveridade,
  filterOcorrenciasByTime,
  type TimeFilter,
  type DashboardData,
  type DashboardOcorrencia 
} from '@/services/dashboardService';

export interface ChartData {
  label: string;
  value: number;
}

export interface DashboardState {
  ocorrenciasPorTempo: ChartData[];
  ocorrenciasPorTipo: ChartData[];
  ocorrenciasPorStatus: ChartData[];
  ocorrenciasPorSeveridade: ChartData[];
  totalOcorrencias: number;
  rawOcorrencias: DashboardOcorrencia[];
}

export function useDashboard() {
  const [data, setData] = useState<DashboardState>({
    ocorrenciasPorTempo: [],
    ocorrenciasPorTipo: [],
    ocorrenciasPorStatus: [],
    ocorrenciasPorSeveridade: [],
    totalOcorrencias: 0,
    rawOcorrencias: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [globalTimeFilter, setGlobalTimeFilter] = useState<TimeFilter>('30d');

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Iniciando fetch do dashboard - buscando todos os dados');
      const dashboardData: DashboardData = await getDashboardData('90d'); // Buscar maior período possível
      console.log('Dashboard data recebido:', dashboardData);
      
      const allOcorrencias = dashboardData?.ocorrencias || [];
      console.log('Dados recebidos com sucesso:', allOcorrencias.length, 'ocorrências');

      // Armazenar apenas os dados brutos - o processamento será feito no useEffect
      setData(prev => ({
        ...prev,
        totalOcorrencias: allOcorrencias.length,
        rawOcorrencias: allOcorrencias,
      }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar dados do dashboard';
      console.error('Erro completo no hook:', err);
      setError(errorMessage);
      
      // Se for um erro de fetch, tentar usar dados mock como fallback
      if (errorMessage.includes('Failed to fetch') || errorMessage.includes('fetch')) {
        console.log('Tentando usar dados mock como fallback...');
        try {
          // Dados mock locais como fallback
          const mockOcorrencias = [
            {
              titulo: "Assédio reportado",
              tipoOcorrencia: "ASSEDIO",
              status: "ABERTO",
              data: new Date().toISOString()
            },
            {
              titulo: "Furto detectado",
              tipoOcorrencia: "FURTO", 
              status: "EM_ANDAMENTO",
              data: new Date(Date.now() - 86400000).toISOString()
            }
          ];
          
          setData(prev => ({
            ...prev,
            totalOcorrencias: mockOcorrencias.length,
            rawOcorrencias: mockOcorrencias,
          }));
          
          setError('Usando dados de exemplo (API indisponível)');
        } catch (mockError) {
          console.error('Erro ao processar dados mock:', mockError);
        }
      }
    } finally {
      setLoading(false);
    }
  }, []); // Remover dependência timeFilters

  // Recalcular dados quando o filtro global muda
  useEffect(() => {
    if (data.rawOcorrencias.length > 0) {
      const filtered = filterOcorrenciasByTime(data.rawOcorrencias, globalTimeFilter);

      setData(prev => ({
        ...prev,
        ocorrenciasPorTempo: processOcorrenciasPorTempo(filtered, globalTimeFilter),
        ocorrenciasPorTipo: processOcorrenciasPorTipo(filtered),
        ocorrenciasPorStatus: processOcorrenciasPorStatus(filtered),
        ocorrenciasPorSeveridade: processOcorrenciasPorSeveridade(filtered),
      }));
    }
  }, [globalTimeFilter, data.rawOcorrencias]);

  // Executar fetchDashboardData apenas uma vez na montagem do componente
  useEffect(() => {
    fetchDashboardData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Sem dependências - queremos executar apenas uma vez

  const handleGlobalTimeFilterChange = useCallback((newFilter: TimeFilter) => {
    setGlobalTimeFilter(newFilter);
  }, []);

  const refreshData = useCallback(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    data,
    loading,
    error,
    globalTimeFilter,
    handleGlobalTimeFilterChange,
    refreshData,
  };
}