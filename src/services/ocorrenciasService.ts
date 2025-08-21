export const getOcorrencias = async (page: number = 0, size: number = 10, sort: string = 'id') => {
  try {
    const params = new URLSearchParams({ page: String(page), size: String(size), sort })
    const response = await fetch(`/api/ocorrencias?${params.toString()}`, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error('Erro ao buscar ocorrências');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro na chamada da API:', error);
    return [];
  }
};
