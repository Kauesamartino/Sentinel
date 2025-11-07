import { useState, useEffect } from 'react';
import { listRelatorios } from '@/services/relatoriosService';

export function useRelatorios() {
  const [relatorios, setRelatorios] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(50);

  const refreshList = async (pageToFetch = page) => {
    setLoading(true);
    setError(null);
    try {
      const res = await listRelatorios({ 
        page: pageToFetch, 
        size: pageSize, 
        sort: 'id' 
      });
      
      const content = Array.isArray(res?.content) ? res.content : [];
      setRelatorios(content);
      
      // Atualizar dados de paginação
      if (res && typeof res === 'object' && 'totalPages' in res) {
        setTotalPages(res.totalPages || 1);
        setTotalElements(res.totalElements || 0);
      } else {
        setTotalPages(1);
        setTotalElements(content.length);
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Erro ao listar relatórios';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshList(page);
  }, [page]);

  // Lógica de navegação prev/next
  const currentPage = page + 1; // Converter de base 0 para base 1 para exibição
  const prev = page > 0 ? page - 1 : null;
  const next = page < totalPages - 1 ? page + 1 : null;
  
  const goToPrevious = () => {
    if (prev !== null) {
      setPage(prev);
    }
  };
  
  const goToNext = () => {
    if (next !== null) {
      setPage(next);
    }
  };

  return {
    relatorios,
    loading,
    error,
    page,
    setPage,
    totalPages,
    totalElements,
    pageSize,
    currentPage,
    prev,
    next,
    goToPrevious,
    goToNext,
    refreshList,
  };
}