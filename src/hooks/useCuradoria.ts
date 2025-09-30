import { useState, useEffect, useCallback } from "react";

// Update the import path to the correct location of ocorrencia.ts or ocorrencia.js
import { getOcorrenciaById } from "@/services/ocorrenciasService";
import { getEvidencias } from "@/services/evidenciaService";

export function useCuradoria() {
  type Curadoria = {
    id: number;
    titulo: string;
    tipoOcorrencia: string;
    data: string;
    severidade?: string;
    status: string;
    evidence?: string;
  };
  const [curadorias, setCuradorias] = useState<Curadoria[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(10);

  // Modal de visualização
  const [viewOpen, setViewOpen] = useState(false);
  const [viewData, setViewData] = useState<Curadoria | null>(null);

  const fetchCuradorias = useCallback(async (pageNumber = 0) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        pageNumber: pageNumber.toString(),
        pageSize: pageSize.toString(),
        direction: 'desc'
      });
      const res = await fetch(`/api/curadoria?${params.toString()}`);
      if (!res.ok) throw new Error("Erro ao buscar curadorias");
      const data = await res.json();
      
      const curadoriasList = Array.isArray(data) ? data : (data.content || []);
      
      // Buscar evidências para cada curadoria
      const curadoriasComEvidencias = await Promise.all(
        curadoriasList.map(async (curadoria: Curadoria) => {
          try {
            const evidencias = await getEvidencias(`occ-${curadoria.id.toString().padStart(8, '0')}`);
            return {
              ...curadoria,
              evidence: evidencias && evidencias.urls.length > 0 ? evidencias.urls[0].url : ''
            };
          } catch (error) {
            console.error(`Erro ao buscar evidências para curadoria ${curadoria.id}:`, error);
            return { ...curadoria, evidence: '' };
          }
        })
      );
      
      setCuradorias(curadoriasComEvidencias);
      
      // Atualizar dados de paginação
      if (Array.isArray(data)) {
        setTotalElements(data.length);
        setTotalPages(Math.ceil(data.length / pageSize) || 1);
      } else {
        setTotalPages(data.totalPages || 1);
        setTotalElements(data.totalElements || 0);
      }
    } catch {
      setError("Erro ao buscar curadorias");
    }
    setLoading(false);
  }, [pageSize]);

  useEffect(() => {
    fetchCuradorias(page);
  }, [page, fetchCuradorias]);

  const handleView = async (id: number) => {
    try {
      setViewOpen(true);
      setViewData(null);
      const data = await getOcorrenciaById(id);
      setViewData({
        ...data,
        severidade: data.severidade ?? "",
        descricao: data.descricao ?? "",
        status: data.status ?? "",
        titulo: data.titulo ?? "",
        tipoOcorrencia: data.tipoOcorrencia ?? "",
        data: data.data ?? "",
      });
    } catch {
      setViewOpen(false);
    }
  };

  async function aprovarCuradoria(id: number) {
    setLoading(true);
    setError(null);
    try {
      await fetch(`/api/curadoria`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      fetchCuradorias();
    } catch {
      setError("Erro ao aprovar curadoria");
    }
    setLoading(false);
  }

  async function desaprovarCuradoria(id: number) {
    setLoading(true);
    setError(null);
    try {
      await fetch(`/api/curadoria?id=${id}`, {
        method: "DELETE",
      });
      fetchCuradorias();
    } catch {
      setError("Erro ao desaprovar curadoria");
    }
    setLoading(false);
  }

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
    curadorias,
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
    aprovarCuradoria,
    desaprovarCuradoria,
    viewOpen,
    setViewOpen,
    viewData,
    handleView,
  };
}