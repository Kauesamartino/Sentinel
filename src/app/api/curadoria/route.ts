export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "ID não informado" }, { status: 400 });
  }
  // Proxy DELETE to ocorrencias endpoint
  const externalUrl = `${process.env.API_URL}/ocorrencias/${id}`;
  const response = await fetch(externalUrl, { method: "DELETE" });
  if (!response.ok) {
    return NextResponse.json({ error: "Erro ao desaprovar ocorrência" }, { status: response.status });
  }
  return NextResponse.json({ success: true });
}
import { NextResponse } from "next/server";

export async function GET() {
  const externalUrl = `${process.env.API_URL}/ocorrencias/curadoria`;
  const response = await fetch(externalUrl, { cache: 'no-store' });
  const data = await response.json();
  // Map content fields, but keep pagination info
  type CuradoriaItem = {
    id: number;
    titulo: string;
    tipoOcorrencia: string;
    data: string;
    severidade: string;
    status: string;
  };
  const mappedContent = Array.isArray(data?.content) ? (data.content as CuradoriaItem[]).map((item) => ({
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