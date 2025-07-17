export const getOcorrencias = async () => {
  try {
    const response = await fetch('/api/ocorrencias');
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
