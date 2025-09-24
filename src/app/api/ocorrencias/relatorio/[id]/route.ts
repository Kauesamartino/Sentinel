import { NextRequest, NextResponse } from "next/server"
const API_URL = process.env.API_URL?.startsWith('https://') ? process.env.API_URL : `https://${process.env.API_URL}`;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const url = new URL(request.url)
    const page = url.searchParams.get('page') ?? '0'
    const size = url.searchParams.get('size') ?? '10'
    const sort = url.searchParams.get('sort') ?? 'id'

  const externalUrl = new URL(`${process.env.API_URL}/ocorrencias/relatorio/${id}`)
    externalUrl.searchParams.set('page', page)
    externalUrl.searchParams.set('size', size)
    externalUrl.searchParams.set('sort', sort)

    const externalResponse = await fetch(externalUrl.toString(), { cache: 'no-store' })
    const body = await externalResponse.json().catch(() => ({}))
    if (!externalResponse.ok) {
      return NextResponse.json(body || { error: 'Erro ao listar ocorrências do relatório' }, { status: externalResponse.status })
    }

    return NextResponse.json(body)
  } catch (error) {
    console.error('Erro GET /api/ocorrencias/relatorio/[id]:', error)
    return NextResponse.json({ error: 'Erro interno ao listar ocorrências do relatório' }, { status: 500 })
  }
} 