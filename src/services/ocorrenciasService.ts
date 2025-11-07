export async function getOcorrencias(page: number = 0, pageSize: number = 50) {
  const params = new URLSearchParams({
    pageNumber: page.toString(),
    pageSize: pageSize.toString(),
    direction: 'DESC'
  });
  
  const res = await fetch(`/api/ocorrencias?${params}`);
  if (!res.ok) throw new Error('Erro ao buscar ocorrências');
  return res.json();
}

export const getOcorrenciaById = async (id: number) => {
  try {
    const response = await fetch(`/api/ocorrencias/${id}`, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error('Erro ao buscar ocorrência');
    }
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar ocorrência por id:', error);
    throw error;
  }
};

export async function createOcorrencia(payload: Record<string, unknown>) {
  // Garantir que sempre enviamos ativo: true para novas ocorrências
  const payloadWithAtivo = {
    ...payload,
    ativo: true
  };

  const res = await fetch('/api/ocorrencias', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payloadWithAtivo),
  });
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody?.error || 'Erro ao criar ocorrência');
  }
  return res.json();
}

export const updateOcorrencia = async (id: number, payload: Record<string, unknown>) => {
  try {
    // Garantir que não removemos o campo ativo em atualizações
    // Se não estiver presente, assumimos true (para manter compatibilidade)
    const payloadWithAtivo = {
      ...payload,
      ativo: payload.ativo !== undefined ? payload.ativo : true
    };

    const response = await fetch(`/api/ocorrencias/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payloadWithAtivo),
    });
    const text = await response.text();
    const body = text ? (() => { try { return JSON.parse(text) } catch { return { raw: text } } })() : {};
    if (!response.ok) {
  const message = (body?.error as string) || (body?.message as string) || text || 'Erro ao atualizar ocorrência';
      throw new Error(message);
    }
    return body;
  } catch (error) {
    console.error('Erro ao atualizar ocorrência:', error);
    throw error;
  }
};
