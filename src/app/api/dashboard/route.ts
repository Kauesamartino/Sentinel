import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('Dashboard API proxy chamada recebida');
    const { searchParams } = new URL(request.url);
    const timeFilter = searchParams.get('timeFilter') || '30d';
    console.log('Time filter:', timeFilter);

    // Usar a mesma variável de ambiente das outras APIs
    const externalUrl = `${process.env.API_URL}/ocorrencias/dashboard?timeFilter=${timeFilter}`;
    console.log('URL externa:', externalUrl);

    const externalResponse = await fetch(externalUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });

    console.log('Response status da API externa:', externalResponse.status);

    if (!externalResponse.ok) {
      console.error('Erro da API externa:', externalResponse.status, externalResponse.statusText);
      
      // Se a API externa falhar, usar dados mock como fallback
      console.log('Usando dados mock como fallback...');
      const mockData = {
        ocorrencias: [
          {
            titulo: "Possível caso de assédio reportado",
            tipoOcorrencia: "ASSEDIO",
            status: "ABERTO",
            data: new Date(Date.now() - 1000 * 60 * 30).toISOString() // 30 min atrás
          },
          {
            titulo: "Furto de equipamento detectado",
            tipoOcorrencia: "FURTO",
            status: "EM_ANDAMENTO",
            data: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() // 2 horas atrás
          },
          {
            titulo: "Agressão no vagão",
            tipoOcorrencia: "AGRESSAO",
            status: "RESOLVIDO",
            data: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() // 1 dia atrás
          },
          {
            titulo: "Vendedor ambulante na plataforma",
            tipoOcorrencia: "VENDEDOR_AMBULANTE",
            status: "ABERTO",
            data: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString() // 3 dias atrás
          },
          {
            titulo: "Perturbação do sossego",
            tipoOcorrencia: "PERTURBACAO",
            status: "EM_ANDAMENTO",
            data: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString() // 7 dias atrás
          },
          {
            titulo: "Assédio no local de trabalho",
            tipoOcorrencia: "ASSEDIO",
            status: "RESOLVIDO",
            data: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString() // 15 dias atrás
          },
          {
            titulo: "Furto de material de escritório",
            tipoOcorrencia: "FURTO",
            status: "ABERTO",
            data: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString() // 20 dias atrás
          },
          {
            titulo: "Objetos suspeitos encontrados",
            tipoOcorrencia: "OBJETOS_SUSPEITOS",
            status: "EM_ANDAMENTO",
            data: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).toISOString() // 45 dias atrás
          }
        ]
      };

      // Filtrar dados mock baseado no timeFilter
      const filteredOcorrencias = filterDataByTime(mockData.ocorrencias, timeFilter);
      
      return NextResponse.json({
        ocorrencias: filteredOcorrencias,
        fallback: true,
        message: 'Dados de exemplo (API externa indisponível)'
      });
    }

    const data = await externalResponse.json();
    console.log('Dados recebidos da API externa:', data);

    // Garantir que sempre retorna a estrutura esperada
    const response = {
      ocorrencias: Array.isArray(data?.ocorrencias) ? data.ocorrencias : 
                   Array.isArray(data) ? data : []
    };

    return NextResponse.json(response);
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

// Função auxiliar para filtrar dados por tempo (mesma do arquivo anterior)
function filterDataByTime(data: Array<{ data: string; [key: string]: unknown }>, timeFilter: string) {
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