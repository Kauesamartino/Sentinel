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

export async function GET() {
  const externalUrl = `${process.env.API_URL}/ocorrencias/curadoria`;
  const response = await fetch(externalUrl, { cache: 'no-store' });
  const data = await response.json();
  // Map content fields, but keep pagination info
  type CuradoriaItem = {
    id: number;
    titulo: string;
    tipoOcorrencia: string;
    data: string;
    severidade: string;
    status: string;
  };
  const mappedContent = Array.isArray(data?.content) ? (data.content as CuradoriaItem[]).map((item) => ({
    id: item.id,
    titulo: item.titulo,
    tipoOcorrencia: item.tipoOcorrencia,
    data: item.data,
    severidade: item.severidade,
    status: item.status,
  })) : [];
  return NextResponse.json({
    ...data,
    content: mappedContent,
  });
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;
    
    if (!id) {
      return NextResponse.json({ error: "ID não informado" }, { status: 400 });
    }
    
    console.log('PATCH /api/curadoria - Aprovando ocorrência:', id);
    
    // Verificar se API_URL está definida
    if (!process.env.API_URL) {
      console.error('PATCH /api/curadoria - Variável API_URL não definida');
      return NextResponse.json({ 
        error: 'Configuração da API não encontrada',
        details: 'Variável de ambiente API_URL não está definida'
      }, { status: 500 });
    }
    
    // Baseado no backend Spring, usar PATCH sem payload para ativar
    const externalUrl = `${process.env.API_URL}/ocorrencias/${id}`;
    
    console.log('PATCH /api/curadoria - URL externa:', externalUrl);
    
    const response = await fetch(externalUrl, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      // Não enviar payload, apenas ativar a ocorrência
    });
    
    console.log('PATCH /api/curadoria - Status da resposta:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('PATCH /api/curadoria - Erro da API externa:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      return NextResponse.json({ 
        error: "Erro ao aprovar ocorrência",
        details: `API externa retornou ${response.status}: ${response.statusText}`,
        externalUrl
      }, { status: response.status });
    }
    
    // Se a resposta é 204 (No Content), não há JSON para parsear
    let result = null;
    if (response.status !== 204) {
      try {
        result = await response.json();
      } catch (e) {
        console.log('PATCH /api/curadoria - Resposta sem JSON válido');
      }
    }
    
    console.log('PATCH /api/curadoria - Ocorrência aprovada com sucesso');
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Erro na API PATCH /api/curadoria:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro interno do servidor';
    return NextResponse.json({ 
      error: 'Erro interno do servidor',
      details: errorMessage 
    }, { status: 500 });
  }
}