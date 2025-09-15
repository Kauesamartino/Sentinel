import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const page = url.searchParams.get('page') ?? '0'
    const size = url.searchParams.get('size') ?? '10'
    const sort = url.searchParams.get('sort') ?? 'id'

    const externalUrl = new URL('http://localhost:8080/relatorios')
    externalUrl.searchParams.set('page', page)
    externalUrl.searchParams.set('size', size)
    externalUrl.searchParams.set('sort', sort)

    const externalResponse = await fetch(externalUrl.toString(), { cache: 'no-store' })
    const body = await externalResponse.json().catch(() => ({}))
    if (!externalResponse.ok) {
      return NextResponse.json(body || { error: 'Erro ao consultar relatórios' }, { status: externalResponse.status })
    }
    return NextResponse.json(body)
  } catch (error) {
    console.error('Erro GET /api/relatorios:', error)
    return NextResponse.json({ error: 'Erro interno ao listar relatórios' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json()
    const externalResponse = await fetch(`http://${process.env.API_URL}/relatorios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const body = await externalResponse.json().catch(() => ({}))
    if (!externalResponse.ok) {
      return NextResponse.json(body || { error: 'Erro ao criar relatório' }, { status: externalResponse.status })
    }
    return NextResponse.json(body, { status: 201 })
  } catch (error) {
    console.error('Erro POST /api/relatorios:', error)
    return NextResponse.json({ error: 'Erro interno ao criar relatório' }, { status: 500 })
  }
} 