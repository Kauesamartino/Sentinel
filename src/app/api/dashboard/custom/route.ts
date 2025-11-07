import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('Dashboard Custom API proxy chamada recebida');
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    console.log('Parâmetros recebidos:', { startDate, endDate });

    // Verificar se a variável de ambiente existe
    console.log('API_URL env:', process.env.API_URL);
    
    if (!process.env.API_URL) {
      console.error('Variável API_URL não está configurada!');
      throw new Error('API_URL não configurada');
    }

    if (!startDate || !endDate) {
      console.error('Parâmetros startDate e endDate são obrigatórios');
      throw new Error('Parâmetros de data não fornecidos');
    }

    // Usar o novo endpoint específico para filtro personalizado
    const formattedStartDate = encodeURIComponent(startDate);
    const formattedEndDate = encodeURIComponent(endDate);
    const externalUrl = `${process.env.API_URL}/ocorrencias/dashboard/data?startDate=${formattedStartDate}&endDate=${formattedEndDate}`;
    
    console.log('URL externa (filtro personalizado):', externalUrl);
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

    if (!externalResponse.ok) {
      const errorText = await externalResponse.text();
      console.error('Erro da API externa:', externalResponse.status, externalResponse.statusText);
      console.error('Erro details:', errorText);
      
      // Se a API externa falhar, usar dados mock filtrados como fallback
      console.log('Usando dados mock filtrados como fallback...');
      const mockData = {
        ocorrencias: [
          // Dados específicos para o período solicitado
          {
            titulo: "Ocorrência no período selecionado - 06/11",
            tipoOcorrencia: "ASSEDIO",
            status: "ABERTO",
            data: new Date(startDate).toISOString()
          },
          {
            titulo: "Furto detectado - 07/11",
            tipoOcorrencia: "FURTO",
            status: "EM_ANDAMENTO",
            data: new Date(startDate).getTime() + (24 * 60 * 60 * 1000) // +1 dia
          },
          {
            titulo: "Incidente resolvido - 08/11",
            tipoOcorrencia: "VANDALISMO",
            status: "RESOLVIDO",
            data: new Date(endDate).toISOString()
          }
        ]
      };
      
      console.log('API Custom - Mock data gerado:', mockData.ocorrencias.length, 'itens');
      
      return NextResponse.json({
        ocorrencias: mockData.ocorrencias,
        fallback: true,
        message: 'Dados de exemplo para período personalizado (API externa indisponível)'
      });
    }

    const data = await externalResponse.json();
    console.log('Dados recebidos da API externa:', data);

    const allOcorrencias = Array.isArray(data?.ocorrencias) ? data.ocorrencias : 
                          Array.isArray(data) ? data : [];
    
    console.log('API Custom - Dados da API externa recebidos:', allOcorrencias.length);
    
    // O novo endpoint /dashboard/data já retorna dados filtrados
    return NextResponse.json({
      ocorrencias: allOcorrencias
    });
    
  } catch (error) {
    console.error('Erro no proxy dashboard custom:', error);
    
    // Em caso de erro, retornar dados mock básicos
    const mockData = {
      ocorrencias: [
        {
          titulo: "Erro - dados mock para filtro personalizado",
          tipoOcorrencia: "ASSEDIO",
          status: "ABERTO",
          data: new Date().toISOString()
        }
      ]
    };

    return NextResponse.json({
      ocorrencias: mockData.ocorrencias,
      fallback: true,
      message: 'Erro no servidor - usando dados de exemplo'
    });
  }
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