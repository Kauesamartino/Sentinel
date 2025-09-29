// Tipos para a API de evidências
export type EvidenciaURL = {
  bucket: string;
  key: string;
  url: string;
};

export type EvidenciaResponse = {
  occurrence_id: string;
  count: number;
  urls: EvidenciaURL[];
  model: string;
};

// Função para buscar evidências existentes de uma ocorrência
export async function getEvidencias(occurrenceId: string): Promise<EvidenciaResponse | null> {
  try {
    const response = await fetch(`/api/evidencias/${occurrenceId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null; // Não há evidências para esta ocorrência
      }
      throw new Error('Erro ao buscar evidências');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar evidências:', error);
    return null;
  }
}

// Função para gerar a evidência baseada no id da ocorrência
// Retorna a URL gerada pela API externa
export async function generateEvidenciaURL(occurrenceId: string, expireSeconds: number = 1800): Promise<string> {
  const response = await fetch('https://4iczzu5229.execute-api.us-east-1.amazonaws.com/default/generateURL', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      occurrence_id: occurrenceId,
      expire_seconds: expireSeconds,
    }),
  });

  if (!response.ok) {
    throw new Error('Erro ao gerar URL de evidência');
  }

  const data = await response.json();
  // Espera-se que a resposta tenha a URL em data.url ou similar
  return data.url || '';
}
