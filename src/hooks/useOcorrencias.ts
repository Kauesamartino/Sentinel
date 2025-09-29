import { useState, useEffect } from 'react';
import { getOcorrencias, getOcorrenciaById, createOcorrencia, updateOcorrencia } from '@/services/ocorrenciasService';
import { getEvidencias } from '@/services/evidenciaService';
import { Ocorrencia } from '@/_components/Ocorrencias/OcorrenciasTable';
import { OcorrenciaDetalhe } from '@/_components/Ocorrencias/OcorrenciaViewModal';
import { OcorrenciaPayload, OcorrenciaUpdatePayload } from '@/_components/Ocorrencias/OcorrenciaForm';

export function useOcorrencias() {
  const [ocorrencias, setOcorrencias] = useState<Ocorrencia[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(10);

  const [viewOpen, setViewOpen] = useState<boolean>(false);
  const [viewData, setViewData] = useState<OcorrenciaDetalhe | null>(null);
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editInitial, setEditInitial] = useState<Partial<OcorrenciaUpdatePayload>>({});
  const [createOpen, setCreateOpen] = useState<boolean>(false);

  const refreshList = async (pageToFetch = page) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getOcorrencias(pageToFetch, pageSize);
      const ocorrenciasList = Array.isArray(data) ? data : (data.content || []);
      
      // Buscar evidências para cada ocorrência
      const ocorrenciasComEvidencias = await Promise.all(
        ocorrenciasList.map(async (ocorrencia: Ocorrencia) => {
          try {
            const evidencias = await getEvidencias(`occ-${ocorrencia.id.toString().padStart(8, '0')}`);
            return {
              ...ocorrencia,
              evidence: evidencias && evidencias.urls.length > 0 ? evidencias.urls[0].url : ''
            };
          } catch (error) {
            console.error(`Erro ao buscar evidências para ocorrência ${ocorrencia.id}:`, error);
            return { ...ocorrencia, evidence: '' };
          }
        })
      );
      
      setOcorrencias(ocorrenciasComEvidencias);
      
      // Atualizar dados de paginação
      if (Array.isArray(data)) {
        // Fallback para APIs que retornam array direto
        setTotalElements(data.length);
        setTotalPages(Math.ceil(data.length / pageSize) || 1);
      } else {
        // API Spring Boot com estrutura de paginação padrão
        setTotalPages(data.totalPages || 1);
        setTotalElements(data.totalElements || 0);
      }
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : 'Erro ao carregar ocorrências';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshList(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);



  const handleView = async (id: number) => {
    try {
      setViewOpen(true);
      setViewData(null);
      const data = await getOcorrenciaById(id);
      setViewData(data);
    } catch {
      setViewOpen(false);
    }
  };

  const handleEdit = async (id: number) => {
    try {
      const data = await getOcorrenciaById(id);
      setEditId(id);
      setEditInitial({
        id: data.id,
        titulo: data.titulo,
        descricao: data.descricao,
        severidade: data.severidade,
        status: data.status,
        tipoOcorrencia: data.tipoOcorrencia,
      });
      setEditOpen(true);
    } catch {
      // noop
    }
  };

  const submitCreate = async (payload: OcorrenciaPayload) => {
    await createOcorrencia(payload as Record<string, unknown>);
    setCreateOpen(false);
    await refreshList();
  };

  const submitEdit = async (payload: OcorrenciaPayload | OcorrenciaUpdatePayload) => {
    if (!editId) return;
    const updatePayload = 'id' in payload ? payload : { ...payload, id: editId };
    await updateOcorrencia(editId, updatePayload as Record<string, unknown>);
    setEditOpen(false);
    setEditId(null);
    await refreshList();
  };

  // Lógica de navegação prev/next inspirada no exemplo fornecido
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
  
  const goToPage = (targetPage: number) => {
    if (targetPage >= 0 && targetPage < totalPages) {
      setPage(targetPage);
    }
  };

  return {
    ocorrencias,
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
    goToPage,
    viewOpen,
    setViewOpen,
    viewData,
    setViewData,
    editOpen,
    setEditOpen,
    editId,
    setEditId,
    editInitial,
    setEditInitial,
    createOpen,
    setCreateOpen,
    refreshList,
    handleView,
    handleEdit,
    submitCreate,
    submitEdit,
  };
}
