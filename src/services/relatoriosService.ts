export type Pageable = { page?: number; size?: number; sort?: string };

export type RelatorioCreate = {
  titulo: string;
  descricao: string;
  tipoOcorrencia?: 'ACIDENTE' | 'FALHA_TECNICA' | 'INCIDENTE' | 'OUTROS';
  dataInicio: string; // ISO
  dataFim: string;    // ISO
};

export const listRelatorios = async ({ page = 0, size = 10, sort = 'id' }: Pageable) => {
  const params = new URLSearchParams({ page: String(page), size: String(size), sort });
  const res = await fetch(`/api/relatorios?${params.toString()}`, { cache: 'no-store' });
  const text = await res.text();
  const body = text ? (() => { try { return JSON.parse(text) } catch { return { raw: text } } })() : {};
  if (!res.ok) throw new Error((body as any)?.error || (body as any)?.message || 'Erro ao listar relatórios');
  return body;
};

export const createRelatorio = async (payload: RelatorioCreate) => {
  const res = await fetch('/api/relatorios', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const text = await res.text();
  const body = text ? (() => { try { return JSON.parse(text) } catch { return { raw: text } } })() : {};
  if (!res.ok) throw new Error((body as any)?.error || (body as any)?.message || text || 'Erro ao criar relatório');
  return body;
};

export const listOcorrenciasByRelatorio = async (relatorioId: number, { page = 0, size = 10, sort = 'id' }: Pageable) => {
  const params = new URLSearchParams({ page: String(page), size: String(size), sort });
  const res = await fetch(`/api/ocorrencias/relatorio/${relatorioId}?${params.toString()}`, { cache: 'no-store' });
  const text = await res.text();
  const body = text ? (() => { try { return JSON.parse(text) } catch { return { raw: text } } })() : {};
  if (!res.ok) throw new Error((body as any)?.error || (body as any)?.message || 'Erro ao listar ocorrências do relatório');
  return body;
}; 