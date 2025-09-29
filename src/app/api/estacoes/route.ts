import { NextResponse } from "next/server"

export async function GET() {
  try {
    const externalUrl = `${process.env.API_URL}/estacoes?pageSize=60`;
    
    console.log('GET /api/estacoes - URL externa:', externalUrl);
    
    const externalResponse = await fetch(externalUrl, { 
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' }
    });

    console.log('GET /api/estacoes - Status da resposta externa:', externalResponse.status);

    if (!externalResponse.ok) {
      console.error('GET /api/estacoes - Erro da API externa:', externalResponse.status);
      return NextResponse.json(
        { error: 'Erro ao consultar estações' }, 
        { status: externalResponse.status }
      );
    }

    const data = await externalResponse.json();
    console.log('GET /api/estacoes - Dados recebidos:', data);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro na API GET /api/estacoes:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    return NextResponse.json(
      { error: 'Erro interno ao consultar estações', details: errorMessage }, 
      { status: 500 }
    );
  }
}