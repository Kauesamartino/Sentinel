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

export interface TimeFilters {
  tempo: TimeFilter;
  tipo: TimeFilter;
  status: TimeFilter;
  severidade: TimeFilter;
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
  const [timeFilters, setTimeFilters] = useState<TimeFilters>({
    tempo: '30d',
    tipo: '30d',
    status: '30d',
    severidade: '30d',
  });

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Iniciando fetch do dashboard - buscando todos os dados');
      const dashboardData: DashboardData = await getDashboardData('90d'); // Buscar maior período possível
      console.log('Dashboard data recebido:', dashboardData);
      
      const allOcorrencias = dashboardData?.ocorrencias || [];
      console.log('Dados recebidos com sucesso:', allOcorrencias.length, 'ocorrências');

      // Processar dados usando os filtros individuais
      const updateData = () => {
        const tempoFiltered = filterOcorrenciasByTime(allOcorrencias, timeFilters.tempo);
        const tipoFiltered = filterOcorrenciasByTime(allOcorrencias, timeFilters.tipo);
        const statusFiltered = filterOcorrenciasByTime(allOcorrencias, timeFilters.status);
        const severidadeFiltered = filterOcorrenciasByTime(allOcorrencias, timeFilters.severidade);

        setData({
          ocorrenciasPorTempo: processOcorrenciasPorTempo(tempoFiltered, timeFilters.tempo),
          ocorrenciasPorTipo: processOcorrenciasPorTipo(tipoFiltered),
          ocorrenciasPorStatus: processOcorrenciasPorStatus(statusFiltered),
          ocorrenciasPorSeveridade: processOcorrenciasPorSeveridade(severidadeFiltered),
          totalOcorrencias: allOcorrencias.length,
          rawOcorrencias: allOcorrencias,
        });
      };

      updateData();
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
          
          setData({
            ocorrenciasPorTempo: processOcorrenciasPorTempo(mockOcorrencias, timeFilters.tempo),
            ocorrenciasPorTipo: processOcorrenciasPorTipo(mockOcorrencias),
            ocorrenciasPorStatus: processOcorrenciasPorStatus(mockOcorrencias),
            ocorrenciasPorSeveridade: processOcorrenciasPorSeveridade(mockOcorrencias),
            totalOcorrencias: mockOcorrencias.length,
            rawOcorrencias: mockOcorrencias,
          });
          
          setError('Usando dados de exemplo (API indisponível)');
        } catch (mockError) {
          console.error('Erro ao processar dados mock:', mockError);
        }
      }
    } finally {
      setLoading(false);
    }
  }, [timeFilters]);

  // Recalcular dados quando os filtros mudam
  useEffect(() => {
    if (data.rawOcorrencias.length > 0) {
      const tempoFiltered = filterOcorrenciasByTime(data.rawOcorrencias, timeFilters.tempo);
      const tipoFiltered = filterOcorrenciasByTime(data.rawOcorrencias, timeFilters.tipo);
      const statusFiltered = filterOcorrenciasByTime(data.rawOcorrencias, timeFilters.status);
      const severidadeFiltered = filterOcorrenciasByTime(data.rawOcorrencias, timeFilters.severidade);

      setData(prev => ({
        ...prev,
        ocorrenciasPorTempo: processOcorrenciasPorTempo(tempoFiltered, timeFilters.tempo),
        ocorrenciasPorTipo: processOcorrenciasPorTipo(tipoFiltered),
        ocorrenciasPorStatus: processOcorrenciasPorStatus(statusFiltered),
        ocorrenciasPorSeveridade: processOcorrenciasPorSeveridade(severidadeFiltered),
      }));
    }
  }, [timeFilters, data.rawOcorrencias]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleTimeFilterChange = (chartType: keyof TimeFilters, newFilter: TimeFilter) => {
    setTimeFilters(prev => ({
      ...prev,
      [chartType]: newFilter,
    }));
  };

  const refreshData = () => {
    fetchDashboardData();
  };

  return {
    data,
    loading,
    error,
    timeFilters,
    handleTimeFilterChange,
    refreshData,
  };
}