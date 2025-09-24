
import { useState, useEffect } from "react";

export function useCuradoria() {
  const [curadorias, setCuradorias] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal de visualização
  const [viewOpen, setViewOpen] = useState(false);
  const [viewData, setViewData] = useState<any | null>(null);


  async function fetchCuradorias(pageNumber = 1) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/curadoria?page=${pageNumber}`);
      if (!res.ok) throw new Error("Erro ao buscar curadorias");
      const data = await res.json();
      // Espera-se que data tenha: content, totalPages, totalElements
      setCuradorias(Array.isArray(data.content) ? data.content : []);
      setTotalPages(data.totalPages || 1);
    } catch (err: any) {
      setError(err.message || "Erro desconhecido");
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchCuradorias(page);
  }, [page]);


  async function handleView(id: number) {
    setLoading(true);
    setViewOpen(true);
    try {
      const res = await fetch(`/api/ocorrencias/${id}`);
      if (!res.ok) throw new Error('Erro ao buscar detalhes da ocorrência');
      const data = await res.json();
      setViewData(data);
    } catch (err: any) {
      setViewData(null);
      setError(err.message || 'Erro desconhecido');
    }
    setLoading(false);
  }

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
    } catch (err: any) {
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
    } catch (err: any) {
      setError("Erro ao desaprovar curadoria");
    }
    setLoading(false);
  }

  return {
    curadorias,
    loading,
    error,
    page,
    setPage,
    totalPages,
    aprovarCuradoria,
    desaprovarCuradoria,
    viewOpen,
    setViewOpen,
    viewData,
    handleView,
  };
}