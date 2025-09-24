import { NextRequest, NextResponse } from "next/server"
const API_URL = process.env.API_URL?.startsWith('https://') ? process.env.API_URL : `https://${process.env.API_URL}`;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params
		const externalUrl = `${API_URL}/ocorrencias/${id}`
		const externalResponse = await fetch(externalUrl, { cache: 'no-store' })

		if (!externalResponse.ok) {
			const errorBody = await externalResponse.json().catch(() => ({}))
			return NextResponse.json(errorBody || { error: 'Erro ao buscar ocorrência' }, { status: externalResponse.status })
		}

		const data = await externalResponse.json()
		return NextResponse.json(data)
	} catch (error) {
		console.error('Erro na API interna GET /api/ocorrencias/[id]:', error)
		return NextResponse.json({ error: 'Erro interno ao buscar ocorrência' }, { status: 500 })
	}
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params
		const body = await request.json()
		const externalUrl = `${process.env.API_URL}/ocorrencias/${id}`
		const externalResponse = await fetch(externalUrl, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body),
		})

		const responseBody = await externalResponse.json().catch(() => ({}))

		if (!externalResponse.ok) {
			return NextResponse.json(responseBody || { error: 'Erro ao atualizar ocorrência' }, { status: externalResponse.status })
		}

		return NextResponse.json(responseBody)
	} catch (error) {
		console.error('Erro na API interna PUT /api/ocorrencias/[id]:', error)
		return NextResponse.json({ error: 'Erro interno ao atualizar ocorrência' }, { status: 500 })
	}
} 