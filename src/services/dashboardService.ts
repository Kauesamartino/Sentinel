// Usar a mesma URL base das outras APIs
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || (
  typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'
);

export interface DashboardOcorrencia {
  titulo: string;
  tipoOcorrencia: string;
  status: string;
  data: string;
}

export interface DashboardData {
  ocorrencias: DashboardOcorrencia[];
}

export type TimeFilter = '1h' | '1d' | '7d' | '30d' | '90d' | 'all' | 'custom';

export async function getDashboardData(timeFilter: TimeFilter = '30d', customStartDate?: Date, customEndDate?: Date): Promise<DashboardData> {
  try {
    let url: string;
    
    // Para filtro personalizado, usar rota diferente
    if (timeFilter === 'custom' && customStartDate && customEndDate) {
      url = `${API_BASE_URL}/api/dashboard/custom?startDate=${customStartDate.toISOString()}&endDate=${customEndDate.toISOString()}`;
      console.log('Service - Filtro personalizado:', {
        timeFilter,
        customStartDate: customStartDate.toISOString(),
        customEndDate: customEndDate.toISOString(),
        url
      });
    } else {
      // Para filtros padrão, usar rota original
      url = `${API_BASE_URL}/api/dashboard?timeFilter=${timeFilter}`;
    }
    
    console.log('Fazendo requisição para:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Response error text:', errorText);
      throw new Error(`Erro ao buscar dados do dashboard: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Dados recebidos:', data);
    return data;
  } catch (error) {
    console.error('Erro no dashboardService:', error);
    throw error;
  }
}

// Funções utilitárias para processar os dados
export function processOcorrenciasPorTempo(ocorrencias: DashboardOcorrencia[] = [], timeFilter: TimeFilter, customStartDate?: Date, customEndDate?: Date) {
  if (!Array.isArray(ocorrencias)) {
    console.warn('processOcorrenciasPorTempo: ocorrencias não é um array:', ocorrencias);
    return [];
  }
  
  const now = new Date();
  const filteredData: { [key: string]: { value: number; date: Date } } = {};

  // Criar intervalos de tempo baseados no filtro
  const generateTimeIntervals = () => {
    const intervals: { label: string; date: Date }[] = [];
    
    switch (timeFilter) {
      case 'all':
        // Para "todas", mostrar por meses dos últimos 12 meses
        for (let i = 11; i >= 0; i--) {
          const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
          intervals.push({
            label: date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
            date: date
          });
        }
        break;
      case 'custom':
        // Para personalizado, criar intervalos baseados no período selecionado
        if (customStartDate && customEndDate) {
          const diffTime = Math.abs(customEndDate.getTime() - customStartDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          if (diffDays <= 7) {
            // Até 7 dias: intervalos diários
            for (let i = 0; i < diffDays; i++) {
              const date = new Date(customStartDate.getTime() + (i * 24 * 60 * 60 * 1000));
              intervals.push({
                label: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
                date: date
              });
            }
          } else if (diffDays <= 30) {
            // Até 30 dias: intervalos de 5 dias
            const intervalDays = Math.ceil(diffDays / 6);
            for (let i = 0; i < 6; i++) {
              const date = new Date(customStartDate.getTime() + (i * intervalDays * 24 * 60 * 60 * 1000));
              intervals.push({
                label: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
                date: date
              });
            }
          } else {
            // Mais de 30 dias: intervalos mensais
            const totalMonths = Math.ceil(diffDays / 30);
            for (let i = 0; i < totalMonths; i++) {
              const date = new Date(customStartDate.getFullYear(), customStartDate.getMonth() + i, 1);
              intervals.push({
                label: date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
                date: date
              });
            }
          }
        }
        break;
      case '1h':
        // Últimos 60 minutos, intervalos de 10 minutos
        for (let i = 6; i >= 0; i--) {
          const time = new Date(now.getTime() - (i * 10 * 60 * 1000));
          intervals.push({
            label: `${time.getHours()}:${time.getMinutes().toString().padStart(2, '0')}`,
            date: time
          });
        }
        break;
      case '1d':
        // Últimas 24 horas, intervalos de 4 horas
        for (let i = 6; i >= 0; i--) {
          const time = new Date(now.getTime() - (i * 4 * 60 * 60 * 1000));
          intervals.push({
            label: `${time.getHours()}:00`,
            date: time
          });
        }
        break;
      case '7d':
        // Últimos 7 dias
        for (let i = 6; i >= 0; i--) {
          const date = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
          intervals.push({
            label: date.toLocaleDateString('pt-BR', { weekday: 'short' }),
            date: date
          });
        }
        break;
      case '30d':
        // Últimos 30 dias, intervalos de 5 dias
        for (let i = 6; i >= 0; i--) {
          const date = new Date(now.getTime() - (i * 5 * 24 * 60 * 60 * 1000));
          intervals.push({
            label: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
            date: date
          });
        }
        break;
      case '90d':
        // Últimos 90 dias, intervalos de ~13 dias
        for (let i = 6; i >= 0; i--) {
          const date = new Date(now.getTime() - (i * 13 * 24 * 60 * 60 * 1000));
          intervals.push({
            label: date.toLocaleDateString('pt-BR', { month: 'short', day: '2-digit' }),
            date: date
          });
        }
        break;
      default:
        return [];
    }
    
    return intervals;
  };

  const intervals = generateTimeIntervals();
  
  // Inicializar todos os intervalos com 0
  intervals.forEach(interval => {
    filteredData[interval.label] = { value: 0, date: interval.date };
  });

  // Contar ocorrências em cada intervalo
  ocorrencias.forEach(ocorrencia => {
    const ocorrenciaDate = new Date(ocorrencia.data);
    
    // Encontrar o intervalo mais próximo
    let closestInterval = intervals[0];
    let closestDiff = Math.abs(ocorrenciaDate.getTime() - intervals[0].date.getTime());
    
    intervals.forEach(interval => {
      const diff = Math.abs(ocorrenciaDate.getTime() - interval.date.getTime());
      if (diff < closestDiff) {
        closestDiff = diff;
        closestInterval = interval;
      }
    });
    
    if (filteredData[closestInterval.label]) {
      filteredData[closestInterval.label].value++;
    }
  });

  // Retornar dados ordenados cronologicamente
  return intervals.map(interval => ({
    label: interval.label,
    value: filteredData[interval.label].value
  }));
}

export function processOcorrenciasPorTipo(ocorrencias: DashboardOcorrencia[] = []) {
  if (!Array.isArray(ocorrencias)) {
    console.warn('processOcorrenciasPorTipo: ocorrencias não é um array:', ocorrencias);
    return [];
  }
  
  const data: { [key: string]: number } = {};

  ocorrencias.forEach(ocorrencia => {
    const tipo = ocorrencia.tipoOcorrencia;
    data[tipo] = (data[tipo] || 0) + 1;
  });

  return Object.entries(data).map(([label, value]) => ({ label, value }));
}

export function processOcorrenciasPorStatus(ocorrencias: DashboardOcorrencia[] = []) {
  if (!Array.isArray(ocorrencias)) {
    console.warn('processOcorrenciasPorStatus: ocorrencias não é um array:', ocorrencias);
    return [];
  }
  
  // Inicializar todos os status possíveis com 0
  const data: { [key: string]: number } = {
    'ABERTO': 0,
    'EM_ANDAMENTO': 0,
    'RESOLVIDO': 0,
    'FECHADO': 0
  };

  // Mapeamento de status da API para status do dashboard
  const statusMap: { [key: string]: string } = {
    'ABERTO': 'ABERTO',
    'EM_ANDAMENTO': 'EM_ANDAMENTO',
    'RESOLVIDO': 'RESOLVIDO',
    'CONCLUIDO': 'RESOLVIDO', // CONCLUIDO mapeia para RESOLVIDO
    'FECHADO': 'FECHADO'
  };

  ocorrencias.forEach(ocorrencia => {
    const statusOriginal = ocorrencia.status;
    const statusMapeado = statusMap[statusOriginal] || statusOriginal;
    
    if (data.hasOwnProperty(statusMapeado)) {
      data[statusMapeado] = (data[statusMapeado] || 0) + 1;
    }
  });

  return Object.entries(data).map(([label, value]) => ({ label, value }));
}

// Como não temos campo de severidade, vou criar uma função que infere baseada no tipo
export function processOcorrenciasPorSeveridade(ocorrencias: DashboardOcorrencia[] = []) {
  if (!Array.isArray(ocorrencias)) {
    console.warn('processOcorrenciasPorSeveridade: ocorrencias não é um array:', ocorrencias);
    return [];
  }
  
  const severidadeMap: { [key: string]: string } = {
    'ASSEDIO': 'ALTA',
    'VIOLENCIA': 'CRITICA',
    'FURTO': 'MEDIA',
    'VANDALISMO': 'BAIXA',
    'SUSPEITA': 'MEDIA',
    // Adicionar mais mapeamentos conforme necessário
  };

  // Inicializar todas as severidades possíveis com 0
  const data: { [key: string]: number } = {
    'BAIXA': 0,
    'MEDIA': 0,
    'ALTA': 0,
    'CRITICA': 0
  };

  ocorrencias.forEach(ocorrencia => {
    const severidade = severidadeMap[ocorrencia.tipoOcorrencia] || 'BAIXA';
    if (data.hasOwnProperty(severidade)) {
      data[severidade] = (data[severidade] || 0) + 1;
    }
  });

  return Object.entries(data).map(([label, value]) => ({ label, value }));
}

// Função para filtrar ocorrências por período de tempo
export function filterOcorrenciasByTime(ocorrencias: DashboardOcorrencia[] = [], timeFilter: TimeFilter, customStartDate?: Date, customEndDate?: Date): DashboardOcorrencia[] {
  if (!Array.isArray(ocorrencias)) {
    console.warn('filterOcorrenciasByTime: ocorrencias não é um array:', ocorrencias);
    return [];
  }

  if (timeFilter === 'all') {
    return ocorrencias; // Retorna todas as ocorrências
  }

  if (timeFilter === 'custom' && customStartDate && customEndDate) {
    return ocorrencias.filter(ocorrencia => {
      const ocorrenciaDate = new Date(ocorrencia.data);
      return ocorrenciaDate >= customStartDate && ocorrenciaDate <= customEndDate;
    });
  }

  const now = new Date();
  let cutoffTime: Date;

  switch (timeFilter) {
    case '1h':
      cutoffTime = new Date(now.getTime() - 1 * 60 * 60 * 1000);
      break;
    case '1d':
      cutoffTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      break;
    case '7d':
      cutoffTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case '30d':
      cutoffTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case '90d':
      cutoffTime = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    default:
      cutoffTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }

  return ocorrencias.filter(ocorrencia => new Date(ocorrencia.data) >= cutoffTime);
}