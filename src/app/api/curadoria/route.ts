import { NextResponse } from "next/server";

export async function GET() {
  const externalUrl = "https://sentinel-api-306n.onrender.com/ocorrencias/curadoria";
  const response = await fetch(externalUrl, { cache: 'no-store' });
  const data = await response.json();
  // Map content fields, but keep pagination info
  const mappedContent = Array.isArray(data?.content) ? data.content.map((item: any) => ({
    id: item.id,
    titulo: item.titulo,
    tipoOcorrencia: item.tipoOcorrencia,
    data: item.data,
    severidade: item.severidade,
    status: item.status,
  })) : [];
  return NextResponse.json({
    ...data,
    content: mappedContent,
  });
}