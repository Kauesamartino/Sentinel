import { useState, useEffect } from "react";

// Update the import path to the correct location of ocorrencia.ts or ocorrencia.js
import { getOcorrenciaById } from "@/services/ocorrenciasService";

export function useCuradoria() {
  type Curadoria = {
    id: number;
    titulo: string;
    tipoOcorrencia: string;
    data: string;
    severidade?: string;
    status: string;
  };
  const [curadorias, setCuradorias] = useState<Curadoria[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal de visualização
  const [viewOpen, setViewOpen] = useState(false);
  const [viewData, setViewData] = useState<Curadoria | null>(null);

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

  const handleView = async (id: number) => {
    try {
      setViewOpen(true);
      setViewData(null);
      const data = await getOcorrenciaById(id);
      setViewData({
        ...data,
        severidade: data.severidade ?? "",
        // garanta também os outros campos obrigatórios
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