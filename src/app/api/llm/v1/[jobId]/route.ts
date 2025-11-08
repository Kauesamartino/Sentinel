import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    console.log('=== LLM V1 API ===');
    const { jobId } = await params;
    console.log('JobId recebido:', jobId);
    
    if (!jobId) {
      return NextResponse.json(
        { error: 'jobId é obrigatório' },
        { status: 400 }
      );
    }

    // Fazer requisição direta para a API externa da AWS
    const awsUrl = `https://edjnqrh12m.execute-api.us-east-1.amazonaws.com/v1/jobs/${jobId}`;
    console.log('Fazendo requisição para AWS:', awsUrl);
    
    const response = await fetch(awsUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    console.log('Resposta da AWS:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro da API externa:', response.status, response.statusText, errorText);
      return NextResponse.json(
        { 
          error: `Erro da API externa: ${response.status}`,
          details: errorText,
          awsUrl,
          jobId
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Dados recebidos da AWS:', data);
    return NextResponse.json(data);

  } catch (error) {
    console.error('Erro no proxy LLM v1:', error);
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}