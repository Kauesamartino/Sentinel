import { NextResponse } from "next/server"

const ocorrencias = [{
  id: 1,
  description: 'Ocorrência de teste',
  category: 'Categoria A',
  date: '2023-10-01',
  status: 'Pendente',
  grau: 'Alto',
  evidence: 'Evidência',
}, {
  id: 2,
  description: 'Outra ocorrência de teste',
  category: 'Categoria B',
  date: '2023-10-02',
  status: 'Concluída',
  grau: 'Médio',
  evidence: 'Evidência',
}, {
  id: 3,
  description: 'Mais uma ocorrência de teste',
  category: 'Categoria C',
  date: '2023-10-03',
  status: 'Em andamento',
  grau: 'Baixo',
  evidence: 'Evidência',
}]

export async function GET() {
 return NextResponse.json(ocorrencias);
}