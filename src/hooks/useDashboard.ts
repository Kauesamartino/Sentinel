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

export interface DashboardStatistics {
  totalOcorrencias: number;
  totalResolvidas: number;
  totalEmAndamento: number;
  totalAbertas: number;
}

export interface DashboardState {
  ocorrenciasPorTempo: ChartData[];
  ocorrenciasPorTipo: ChartData[];
  ocorrenciasPorStatus: ChartData[];
  ocorrenciasPorSeveridade: ChartData[];
  totalOcorrencias: number;
  statistics: DashboardStatistics;
  rawOcorrencias: DashboardOcorrencia[];
}

export function useDashboard() {
  const [data, setData] = useState<DashboardState>({
    ocorrenciasPorTempo: [],
    ocorrenciasPorTipo: [],
    ocorrenciasPorStatus: [],
    ocorrenciasPorSeveridade: [],
    totalOcorrencias: 0,
    statistics: {
      totalOcorrencias: 0,
      totalResolvidas: 0,
      totalEmAndamento: 0,
      totalAbertas: 0,
    },
    rawOcorrencias: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [globalTimeFilter, setGlobalTimeFilter] = useState<TimeFilter>('30d');
  const [customStartDate, setCustomStartDate] = useState<Date | undefined>();
  const [customEndDate, setCustomEndDate] = useState<Date | undefined>();

  // Função para calcular estatísticas baseadas nas ocorrências
  const calculateStatistics = useCallback((ocorrencias: DashboardOcorrencia[]): DashboardStatistics => {
    const totalOcorrencias = ocorrencias.length;
    
    // Contar por status
    const statusCounts = {
      resolvidas: 0,
      emAndamento: 0,
      abertas: 0,
    };

    ocorrencias.forEach(ocorrencia => {
      const status = ocorrencia.status?.toUpperCase().replace(/\s+/g, '_');
      switch (status) {
        case 'RESOLVIDO':
        case 'CONCLUIDO':
        case 'FECHADO':
        case 'RESOLVED':
        case 'CLOSED':
          statusCounts.resolvidas++;
          break;
        case 'EM_ANDAMENTO':
        case 'IN_PROGRESS':
        case 'PROGRESS':
          statusCounts.emAndamento++;
          break;
        case 'ABERTO':
        case 'OPEN':
        case 'PENDENTE':
        case 'PENDING':
        default:
          statusCounts.abertas++;
          break;
      }
    });

    return {
      totalOcorrencias,
      totalResolvidas: statusCounts.resolvidas,
      totalEmAndamento: statusCounts.emAndamento,
      totalAbertas: statusCounts.abertas,
    };
  }, []);

  const fetchDashboardData = useCallback(async (timeFilter: TimeFilter = 'all', startDate?: Date, endDate?: Date) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Iniciando fetch do dashboard - buscando dados:', { timeFilter, startDate, endDate });
      const dashboardData: DashboardData = await getDashboardData(timeFilter, startDate, endDate);
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
      const filtered = filterOcorrenciasByTime(data.rawOcorrencias, globalTimeFilter, customStartDate, customEndDate);
      const statistics = calculateStatistics(filtered);

      setData(prev => ({
        ...prev,
        ocorrenciasPorTempo: processOcorrenciasPorTempo(filtered, globalTimeFilter, customStartDate, customEndDate),
        ocorrenciasPorTipo: processOcorrenciasPorTipo(filtered),
        ocorrenciasPorStatus: processOcorrenciasPorStatus(filtered),
        ocorrenciasPorSeveridade: processOcorrenciasPorSeveridade(filtered),
        statistics: statistics,
      }));
    }
  }, [globalTimeFilter, customStartDate, customEndDate, data.rawOcorrencias, calculateStatistics]);

  // Executar fetchDashboardData apenas uma vez na montagem do componente
  useEffect(() => {
    fetchDashboardData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Sem dependências - queremos executar apenas uma vez

  const handleGlobalTimeFilterChange = useCallback((newFilter: TimeFilter, startDate?: Date, endDate?: Date) => {
    setGlobalTimeFilter(newFilter);
    
    if (newFilter === 'custom' && startDate && endDate) {
      setCustomStartDate(startDate);
      setCustomEndDate(endDate);
      // Para filtro personalizado, refazer a busca com os parâmetros específicos
      fetchDashboardData(newFilter, startDate, endDate);
    } else if (newFilter === 'all') {
      setCustomStartDate(undefined);
      setCustomEndDate(undefined);
      // Para "todas", refazer a busca sem filtros
      fetchDashboardData(newFilter);
    } else {
      setCustomStartDate(undefined);
      setCustomEndDate(undefined);
    }
  }, [fetchDashboardData]);

  const refreshData = useCallback(() => {
    fetchDashboardData(globalTimeFilter, customStartDate, customEndDate);
  }, [fetchDashboardData, globalTimeFilter, customStartDate, customEndDate]);

  return {
    data,
    loading,
    error,
    globalTimeFilter,
    customStartDate,
    customEndDate,
    handleGlobalTimeFilterChange,
    refreshData,
  };
}