import { useState } from 'react';
import { listOcorrenciasByRelatorio } from '@/services/relatoriosService';

export function useRelatorioOcorrencias() {
  const [viewData, setViewData] = useState<{ content: any[]; totalElements: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(20);

  const loadOcorrencias = async (relatorioId: number, pageToFetch = 0) => {
    setLoading(true);
    setError(null);
    setPage(pageToFetch);
    
    try {
      const res = await listOcorrenciasByRelatorio(relatorioId, { 
        page: pageToFetch, 
        size: pageSize, 
        sort: 'id' 
      });
      
      setViewData(res);
      
      // Atualizar dados de paginação
      if (res && typeof res === 'object' && 'totalPages' in res) {
        setTotalPages(res.totalPages || 1);
        setTotalElements(res.totalElements || 0);
      } else {
        setTotalPages(1);
        setTotalElements(res?.content?.length || 0);
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Falha ao carregar ocorrências do relatório';
      setViewData({ content: [], totalElements: 0 });
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const resetData = () => {
    setViewData(null);
    setPage(0);
    setTotalPages(1);
    setTotalElements(0);
    setError(null);
  };

  // Lógica de navegação prev/next
  const currentPage = page + 1;
  const prev = page > 0 ? page - 1 : null;
  const next = page < totalPages - 1 ? page + 1 : null;
  
  const goToPrevious = (relatorioId: number) => {
    if (prev !== null) {
      loadOcorrencias(relatorioId, prev);
    }
  };
  
  const goToNext = (relatorioId: number) => {
    if (next !== null) {
      loadOcorrencias(relatorioId, next);
    }
  };

  return {
    viewData,
    loading,
    error,
    page,
    totalPages,
    totalElements,
    pageSize,
    currentPage,
    prev,
    next,
    loadOcorrencias,
    goToPrevious,
    goToNext,
    resetData,
  };
}