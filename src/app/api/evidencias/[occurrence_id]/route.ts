import { NextRequest, NextResponse } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ occurrence_id: string }> }
) {
  try {
    const { occurrence_id } = await params;
    
    // Construir a URL da API da AWS
    const awsApiUrl = `https://kapmqjfn6f.execute-api.us-east-1.amazonaws.com/default/evidences/${occurrence_id}`;
    
    console.log('GET /api/evidencias/[occurrence_id] - Buscando evidências para:', occurrence_id);
    console.log('GET /api/evidencias/[occurrence_id] - URL da AWS:', awsApiUrl);
    
    const externalResponse = await fetch(awsApiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });

    console.log('GET /api/evidencias/[occurrence_id] - Status da resposta:', externalResponse.status);

    if (!externalResponse.ok) {
      if (externalResponse.status === 404) {
        console.log('GET /api/evidencias/[occurrence_id] - Nenhuma evidência encontrada');
        return NextResponse.json(
          { message: 'Nenhuma evidência encontrada para esta ocorrência' }, 
          { status: 404 }
        );
      }
      
      console.error('GET /api/evidencias/[occurrence_id] - Erro da API AWS:', externalResponse.status);
      return NextResponse.json(
        { error: 'Erro ao buscar evidências' }, 
        { status: externalResponse.status }
      );
    }

    const data = await externalResponse.json();
    console.log('GET /api/evidencias/[occurrence_id] - Evidências encontradas:', data);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro na API GET /api/evidencias/[occurrence_id]:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    return NextResponse.json(
      { error: 'Erro interno ao buscar evidências', details: errorMessage }, 
      { status: 500 }
    );
  }
}