export type Estacao = {
  id: number;
  nome: string;
  linha: string;
  endereco: {
    logradouro: string;
    bairro: string;
    cep: string;
    numero: string;
    complemento: string;
    cidade: string;
    uf: string;
  };
};

export type EstacoesResponse = {
  totalElements: number;
  totalPages: number;
  size: number;
  content: Estacao[];
  number: number;
  numberOfElements: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  pageable: {
    offset: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    paged: boolean;
    pageSize: number;
    pageNumber: number;
    unpaged: boolean;
  };
  first: boolean;
  last: boolean;
  empty: boolean;
};

export const getEstacoes = async (): Promise<EstacoesResponse> => {
  try {
    const response = await fetch('/api/estacoes', { 
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw new Error(errorBody?.error || 'Erro ao buscar estações');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar estações:', error);
    throw error;
  }
};