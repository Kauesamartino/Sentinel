import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('LLM Submit API - Recebendo requisição');
    const body = await request.json();
    console.log('LLM Submit API - Body:', body);
    
    // Validar se occurrenceId foi fornecido
    if (!body.occurrenceId) {
      console.log('LLM Submit API - occurrenceId não fornecido');
      return NextResponse.json(
        { error: 'occurrenceId é obrigatório' },
        { status: 400 }
      );
    }

    // Fazer requisição para a API externa da AWS
    console.log('LLM Submit API - Fazendo requisição para AWS');
    const response = await fetch(
      'https://beu6hnden6.execute-api.us-east-1.amazonaws.com/default/submitdba-sentinel',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      }
    );

    console.log('LLM Submit API - Resposta AWS:', response.status, response.statusText);

    if (!response.ok) {
      console.error('Erro da API externa:', response.status, response.statusText);
      return NextResponse.json(
        { error: `Erro da API externa: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('LLM Submit API - Dados retornados:', data);
    return NextResponse.json(data);

  } catch (error) {
    console.error('Erro no proxy LLM submit:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}