export const getOcorrencias = async (page: number = 0, size: number = 10, sort: string = 'id') => {
  try {
    const response = await fetch(`/api/ocorrencias?${new URLSearchParams({ page: String(page), size: String(size), sort }).toString()}`, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error('Erro ao buscar ocorrências');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro na chamada da API:', error);
    return [];
  }
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

export const createOcorrencia = async (payload: Record<string, unknown>) => {
  try {
    const response = await fetch(`/api/ocorrencias`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const text = await response.text();
    const body = text ? (() => { try { return JSON.parse(text) } catch { return { raw: text } } })() : {};
    if (!response.ok) {
  const message = (body?.error as string) || (body?.message as string) || text || 'Erro ao criar ocorrência';
      throw new Error(message);
    }
    return body;
  } catch (error) {
    console.error('Erro ao criar ocorrência:', error);
    throw error;
  }
};

export const updateOcorrencia = async (id: number, payload: Record<string, unknown>) => {
  try {
    const response = await fetch(`/api/ocorrencias/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
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
