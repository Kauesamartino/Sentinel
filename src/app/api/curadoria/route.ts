export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ error: "ID não informado" }, { status: 400 });
    }
    
    console.log('DELETE /api/curadoria - Desaprovando ocorrência:', id);
    
    // Proxy DELETE to ocorrencias endpoint
    const externalUrl = `${process.env.API_URL}/ocorrencias/${id}`;
    console.log('DELETE /api/curadoria - URL externa:', externalUrl);
    
    const response = await fetch(externalUrl, { method: "DELETE" });
    
    if (!response.ok) {
      console.error('DELETE /api/curadoria - Erro da API externa:', response.status);
      return NextResponse.json({ error: "Erro ao desaprovar ocorrência" }, { status: response.status });
    }
    
    console.log('DELETE /api/curadoria - Ocorrência desaprovada com sucesso');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro na API DELETE /api/curadoria:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    // Verificar se API_URL está definida
    if (!process.env.API_URL) {
      console.error('GET /api/curadoria - Variável API_URL não definida');
      return NextResponse.json({ 
        error: 'Configuração da API não encontrada',
        details: 'Variável de ambiente API_URL não está definida'
      }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const pageNumber = searchParams.get('pageNumber') || '0';
    const pageSize = searchParams.get('pageSize') || '10';
    const direction = searchParams.get('direction') || 'desc';
    
    const params = new URLSearchParams({
      pageNumber,
      pageSize,
      direction
    });
    
    // Usar o endpoint padrão de ocorrências - a curadoria são ocorrências pendentes
    const externalUrl = `${process.env.API_URL}/ocorrencias?${params.toString()}`;
    console.log('GET /api/curadoria - URL externa:', externalUrl);
    
    const response = await fetch(externalUrl, { 
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('GET /api/curadoria - Erro da API externa:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      return NextResponse.json({ 
        error: 'Erro ao buscar curadorias',
        details: `API externa retornou ${response.status}: ${response.statusText}`,
        externalUrl
      }, { status: response.status });
    }
    
    const data = await response.json();
    console.log('GET /api/curadoria - Dados recebidos:', data);
    
    // Map content fields, but keep pagination info
    type CuradoriaItem = {
      id: number;
      titulo: string;
      tipoOcorrencia: string;
      data: string;
      severidade: string;
      status: string;
    };
    
    let mappedContent: CuradoriaItem[] = [];
    
    if (Array.isArray(data?.content)) {
      // Filtrar apenas ocorrências que precisam de curadoria
      mappedContent = (data.content as CuradoriaItem[])
        .filter((item) => {
          // Incluir ocorrências que estão em status que precisa de curadoria
          const statusQuePreecisaCuradoria = ['EM_ANDAMENTO', 'ABERTO', 'PENDENTE'];
          return statusQuePreecisaCuradoria.includes(item.status);
        })
        .map((item) => ({
          id: item.id,
          titulo: item.titulo,
          tipoOcorrencia: item.tipoOcorrencia,
          data: item.data,
          severidade: item.severidade,
          status: item.status,
        }));
    } else if (Array.isArray(data)) {
      // Fallback se a API retornar array direto
      mappedContent = (data as CuradoriaItem[])
        .filter((item) => {
          const statusQuePreecisaCuradoria = ['EM_ANDAMENTO', 'ABERTO', 'PENDENTE'];
          return statusQuePreecisaCuradoria.includes(item.status);
        })
        .map((item) => ({
          id: item.id,
          titulo: item.titulo,
          tipoOcorrencia: item.tipoOcorrencia,
          data: item.data,
          severidade: item.severidade,
          status: item.status,
        }));
    }
    
    // Retornar estrutura de paginação adequada
    const result = Array.isArray(data) ? {
      content: mappedContent,
      totalElements: mappedContent.length,
      totalPages: Math.ceil(mappedContent.length / parseInt(pageSize)) || 1,
      size: parseInt(pageSize),
      number: parseInt(pageNumber)
    } : {
      ...data,
      content: mappedContent,
      totalElements: data?.totalElements || mappedContent.length,
    };
    
    console.log('GET /api/curadoria - Resultado final:', result);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Erro na API GET /api/curadoria:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;
    
    if (!id) {
      return NextResponse.json({ error: "ID não informado" }, { status: 400 });
    }
    
    console.log('PATCH /api/curadoria - Aprovando ocorrência:', id);
    
    // Proxy PATCH to ocorrencias endpoint to approve
    const externalUrl = `${process.env.API_URL}/ocorrencias/${id}`;
    const updatePayload = {
      status: 'APROVADO' // ou o status apropriado para aprovação
    };
    
    console.log('PATCH /api/curadoria - URL externa:', externalUrl);
    console.log('PATCH /api/curadoria - Payload:', updatePayload);
    
    const response = await fetch(externalUrl, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatePayload)
    });
    
    if (!response.ok) {
      console.error('PATCH /api/curadoria - Erro da API externa:', response.status);
      return NextResponse.json({ error: "Erro ao aprovar ocorrência" }, { status: response.status });
    }
    
    const result = await response.json();
    console.log('PATCH /api/curadoria - Resultado:', result);
    
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Erro na API PATCH /api/curadoria:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}