import { NextResponse } from "next/server"

export async function PATCH(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID não informado' }, { status: 400 });
    }
    const externalUrl = `${process.env.API_URL}/ocorrencias/${id}`;
    const externalResponse = await fetch(externalUrl, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    const responseBody = await externalResponse.json().catch(() => ({}));
    if (!externalResponse.ok) {
      return NextResponse.json(responseBody || { error: 'Erro ao aprovar ocorrência' }, { status: externalResponse.status });
    }
    return NextResponse.json(responseBody, { status: 200 });
  } catch (error) {
    console.error('Erro na API PATCH /api/ocorrencias:', error);
    return NextResponse.json({ error: 'Erro interno ao aprovar ocorrência' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Adicionar campos obrigatórios que a API externa espera
    const payload = {
      ...body,
      idEstacao: body.idEstacao || 0,
      ativo: body.ativo !== undefined ? body.ativo : true
    };
    
    const externalUrl = `${process.env.API_URL}/ocorrencias`;
    
    console.log('POST /api/ocorrencias - Dados recebidos:', body);
    console.log('POST /api/ocorrencias - Payload enviado:', payload);
    console.log('POST /api/ocorrencias - URL externa:', externalUrl);
    
    const externalResponse = await fetch(externalUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    console.log('POST /api/ocorrencias - Status da resposta externa:', externalResponse.status);
    console.log('POST /api/ocorrencias - Headers da resposta:', Object.fromEntries(externalResponse.headers.entries()));
    
    // Capturar tanto JSON quanto texto da resposta
    const responseText = await externalResponse.text();
    console.log('POST /api/ocorrencias - Resposta bruta da API externa:', responseText);
    
    let responseBody;
    try {
      responseBody = JSON.parse(responseText);
    } catch {
      responseBody = { message: responseText };
    }

    if (!externalResponse.ok) {
      console.error('POST /api/ocorrencias - Erro da API externa:', {
        status: externalResponse.status,
        statusText: externalResponse.statusText,
        body: responseBody,
        url: externalUrl
      });
      return NextResponse.json(
        responseBody || { error: `Erro ao criar ocorrência: ${externalResponse.status} ${externalResponse.statusText}` }, 
        { status: externalResponse.status }
      );
    }

    console.log('POST /api/ocorrencias - Sucesso:', responseBody);
    return NextResponse.json(responseBody, { status: 201 });
  } catch (error) {
    console.error('Erro na API POST /api/ocorrencias:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    return NextResponse.json({ error: 'Erro interno ao criar ocorrência', details: errorMessage }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
  const url = new URL(request.url)
  const pageNumber = url.searchParams.get('pageNumber') ?? '0'
  const pageSize = url.searchParams.get('pageSize') ?? '20'
  const direction = url.searchParams.get('direction') ?? 'DESC'

  const externalUrl = new URL(`${process.env.API_URL}/ocorrencias`)
  externalUrl.searchParams.set('pageSize', pageSize)
  externalUrl.searchParams.set('pageNumber', pageNumber)
  externalUrl.searchParams.set('direction', direction)

    const externalResponse = await fetch(externalUrl.toString(), { cache: 'no-store' })

    if (!externalResponse.ok) {
      return NextResponse.json({ error: 'Erro ao consultar serviço externo' }, { status: externalResponse.status })
    }

    const pageableData = await externalResponse.json()
    const content = Array.isArray(pageableData?.content) ? pageableData.content : []

    // Map external fields to the UI shape expected by the table
    const mapped = content.map((item: Record<string, unknown>) => ({
      id: item.id as number,
      title: (item.titulo as string) ?? '',
      category: (item.tipoOcorrencia as string) ?? '',
      date: (item.data as string) ?? '',
      status: (item.status as string) ?? '',
      grau: (item.severidade as string) ?? '',
      evidence: '',
    }));

        return NextResponse.json(mapped);
      } catch (error) {
        console.error('Erro na API GET /api/ocorrencias:', error);
        return NextResponse.json({ error: 'Erro interno ao consultar ocorrências' }, { status: 500 });
      }
    }