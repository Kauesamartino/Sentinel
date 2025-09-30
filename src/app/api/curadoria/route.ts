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