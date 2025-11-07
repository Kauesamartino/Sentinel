import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId } = await params;
    
    if (!jobId) {
      return NextResponse.json(
        { error: 'jobId é obrigatório' },
        { status: 400 }
      );
    }

    // Fazer requisição para a API externa da AWS
    const response = await fetch(
      `https://edjnqrh12m.execute-api.us-east-1.amazonaws.com/v1/jobs/${jobId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    if (!response.ok) {
      console.error('Erro da API externa:', response.status, response.statusText);
      return NextResponse.json(
        { error: `Erro da API externa: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Erro no proxy LLM status:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}