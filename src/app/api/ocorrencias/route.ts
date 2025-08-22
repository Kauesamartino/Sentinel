import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const page = url.searchParams.get('page') ?? '0'
    const size = url.searchParams.get('size') ?? '50'
    const sort = url.searchParams.get('sort') ?? 'id'

    const externalUrl = new URL('https://sentinel-api-306n.onrender.com/ocorrencias')
    externalUrl.searchParams.set('page', page)
    externalUrl.searchParams.set('size', size)
    externalUrl.searchParams.set('sort', sort)

    const externalResponse = await fetch(externalUrl.toString(), { cache: 'no-store' })

    if (!externalResponse.ok) {
      return NextResponse.json({ error: 'Erro ao consultar serviço externo' }, { status: externalResponse.status })
    }

    const pageableData = await externalResponse.json()
    const content = Array.isArray(pageableData?.content) ? pageableData.content : []

    // Map external fields to the UI shape expected by the table
    const mapped = content.map((item: Record<string, unknown>) => ({
      id: item.id as number,
      description: (item.titulo as string) ?? '',
      category: (item.tipoOcorrencia as string) ?? '',
      date: (item.data as string) ?? '',
      status: (item.status as string) ?? '',
      grau: (item.severidade as string) ?? '',
      evidence: '',
    }))

    return NextResponse.json(mapped)
  } catch (error) {
    console.error('Erro na API interna /api/ocorrencias:', error)
    return NextResponse.json({ error: 'Erro interno ao buscar ocorrências' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const externalUrl = 'https://sentinel-api-306n.onrender.com/ocorrencias'
    const externalResponse = await fetch(externalUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    const responseBody = await externalResponse.json().catch(() => ({}))

    if (!externalResponse.ok) {
      return NextResponse.json(responseBody || { error: 'Erro ao criar ocorrência' }, { status: externalResponse.status })
    }

    return NextResponse.json(responseBody, { status: 201 })
  } catch (error) {
    console.error('Erro na API interna POST /api/ocorrencias:', error)
    return NextResponse.json({ error: 'Erro interno ao criar ocorrência' }, { status: 500 })
  }
}