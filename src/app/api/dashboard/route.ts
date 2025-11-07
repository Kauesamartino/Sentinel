import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('Dashboard API proxy chamada recebida');
    const { searchParams } = new URL(request.url);
    const timeFilter = searchParams.get('timeFilter') || '30d';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    console.log('Parâmetros recebidos:', { timeFilter, startDate, endDate });

    // Verificar se a variável de ambiente existe
    console.log('API_URL env:', process.env.API_URL);
    
    if (!process.env.API_URL) {
      console.error('Variável API_URL não está configurada!');
      throw new Error('API_URL não configurada');
    }

    // Construir URL baseada no tipo de filtro
    let externalUrl: string;
    
    if (timeFilter === 'custom' && startDate && endDate) {
      // Usar o novo endpoint para filtro personalizado
      // Garantir que as datas estão no formato correto (ISO string)
      const formattedStartDate = encodeURIComponent(startDate);
      const formattedEndDate = encodeURIComponent(endDate);
      externalUrl = `${process.env.API_URL}/ocorrencias/dashboard/data?startDate=${formattedStartDate}&endDate=${formattedEndDate}`;
      console.log('URL externa (filtro personalizado):', externalUrl);
    } else {
      // Usar o endpoint original para outros filtros
      externalUrl = `${process.env.API_URL}/ocorrencias/dashboard?timeFilter=${timeFilter}`;
      console.log('URL externa (filtro padrão):', externalUrl);
    }

    console.log('Tentando fazer fetch para URL externa:', externalUrl);
    
    let externalResponse;
    
    try {
      console.log('Iniciando fetch para API externa...');
      externalResponse = await fetch(externalUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      });
      console.log('Fetch completado. Status:', externalResponse.status);
    } catch (fetchError) {
      console.error('Erro no fetch para API externa:', fetchError);
      throw fetchError;
    }

    console.log('Response status da API externa:', externalResponse.status);
    console.log('Response headers da API externa:', Object.fromEntries(externalResponse.headers.entries()));

    if (!externalResponse.ok) {
      const errorText = await externalResponse.text();
      console.error('Erro da API externa:', externalResponse.status, externalResponse.statusText);
      console.error('Erro details:', errorText);
      
      // Se a API externa falhar, usar dados mock como fallback
      console.log('Usando dados mock como fallback...');
      const mockData = {
        ocorrencias: [
          // Dados de hoje (07/11/2024)
          {
            titulo: "Possível caso de assédio reportado",
            tipoOcorrencia: "ASSEDIO",
            status: "ABERTO",
            data: new Date('2024-11-07T10:30:00').toISOString()
          },
          {
            titulo: "Furto de equipamento detectado",
            tipoOcorrencia: "FURTO",
            status: "EM_ANDAMENTO",
            data: new Date('2024-11-07T14:15:00').toISOString()
          },
          // Dados de 06/11/2024
          {
            titulo: "Agressão no vagão",
            tipoOcorrencia: "AGRESSAO",
            status: "RESOLVIDO",
            data: new Date('2024-11-06T09:20:00').toISOString()
          },
          {
            titulo: "Vendedor ambulante na plataforma",
            tipoOcorrencia: "VENDEDOR_AMBULANTE",
            status: "ABERTO",
            data: new Date('2024-11-06T16:45:00').toISOString()
          },
          {
            titulo: "Perturbação do sossego",
            tipoOcorrencia: "PERTURBACAO",
            status: "EM_ANDAMENTO",
            data: new Date('2024-11-06T11:30:00').toISOString()
          },
          // Dados de 08/11/2024 (futuro)
          {
            titulo: "Assédio no local de trabalho",
            tipoOcorrencia: "ASSEDIO",
            status: "RESOLVIDO",
            data: new Date('2024-11-08T08:00:00').toISOString()
          },
          {
            titulo: "Furto de material de escritório",
            tipoOcorrencia: "FURTO",
            status: "ABERTO",
            data: new Date('2024-11-08T13:20:00').toISOString()
          },
          // Dados fora do período (05/11 e 09/11)
          {
            titulo: "Objetos suspeitos encontrados",
            tipoOcorrencia: "OBJETOS_SUSPEITOS",
            status: "EM_ANDAMENTO",
            data: new Date('2024-11-05T15:30:00').toISOString()
          },
          {
            titulo: "Incidente de segurança",
            tipoOcorrencia: "INCIDENTE",
            status: "ABERTO",
            data: new Date('2024-11-09T12:00:00').toISOString()
          },
          // Mais dados antigos
          {
            titulo: "Caso antigo",
            tipoOcorrencia: "FURTO",
            status: "FECHADO",
            data: new Date('2024-10-01T10:00:00').toISOString()
          }
        ]
      };

      // Filtrar dados mock baseado nos parâmetros
      console.log('API - Chamando filterDataByTime com:', { timeFilter, startDate, endDate, totalMockItems: mockData.ocorrencias.length });
      const filteredOcorrencias = filterDataByTime(mockData.ocorrencias, timeFilter, startDate, endDate);
      
      console.log('API - Mock data filtrado:', filteredOcorrencias.length, 'de', mockData.ocorrencias.length);
      
      return NextResponse.json({
        ocorrencias: filteredOcorrencias,
        fallback: true,
        message: 'Dados de exemplo (API externa indisponível)'
      });
    }

    const data = await externalResponse.json();
    console.log('Dados recebidos da API externa:', data);

    const allOcorrencias = Array.isArray(data?.ocorrencias) ? data.ocorrencias : 
                          Array.isArray(data) ? data : [];
    
    console.log('API - Dados da API externa recebidos:', allOcorrencias.length);
    
    // Se for filtro personalizado, o novo endpoint já retorna dados filtrados
    if (timeFilter === 'custom' && startDate && endDate) {
      console.log('API - Usando dados já filtrados do endpoint personalizado');
      return NextResponse.json({
        ocorrencias: allOcorrencias
      });
    }
    
    // Para outros filtros, aplicar filtro local
    const filteredOcorrencias = filterDataByTime(allOcorrencias, timeFilter, startDate, endDate);
    console.log('API - Dados filtrados localmente:', filteredOcorrencias.length, 'de', allOcorrencias.length);

    return NextResponse.json({
      ocorrencias: filteredOcorrencias
    });
  } catch (error) {
    console.error('Erro no proxy dashboard:', error);
    
    // Em caso de erro, retornar dados mock
    const mockData = {
      ocorrencias: [
        {
          titulo: "Erro - usando dados mock",
          tipoOcorrencia: "ASSEDIO",
          status: "ABERTO",
          data: new Date().toISOString()
        }
      ]
    };

    return NextResponse.json(mockData);
  }
}

// Função auxiliar para filtrar dados por tempo
function filterDataByTime(data: Array<{ data: string; [key: string]: unknown }>, timeFilter: string, startDate?: string | null, endDate?: string | null) {
  if (timeFilter === 'all') {
    return data; // Retorna todos os dados
  }

  if (timeFilter === 'custom' && startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    console.log('API - Filtro personalizado:', {
      timeFilter,
      startDate,
      endDate,
      startParsed: start,
      endParsed: end,
      totalItems: data.length
    });
    
    const filtered = data.filter(item => {
      const itemDate = new Date(item.data);
      const isInRange = itemDate >= start && itemDate <= end;
      
      console.log('API - Comparando item:', {
        titulo: item.titulo,
        itemDate: itemDate,
        itemDateISO: item.data,
        isInRange,
        startCheck: itemDate >= start,
        endCheck: itemDate <= end
      });
      
      return isInRange;
    });
    
    console.log('API - Resultado filtrado:', filtered.length, 'de', data.length, 'itens');
    return filtered;
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

  return data.filter(item => new Date(item.data) >= cutoffTime);
}

// Adicionar suporte para OPTIONS (preflight)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}