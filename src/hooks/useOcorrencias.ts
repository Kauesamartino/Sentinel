import { useState, useEffect } from 'react';
import { getOcorrencias, getOcorrenciaById, createOcorrencia, updateOcorrencia } from '@/services/ocorrenciasService';
import { generateEvidenciaURL } from '@/services/evidenciaService';
import { Ocorrencia } from '@/_components/Ocorrencias/OcorrenciasTable';
import { OcorrenciaDetalhe } from '@/_components/Ocorrencias/OcorrenciaViewModal';
import { OcorrenciaPayload, OcorrenciaUpdatePayload } from '@/_components/Ocorrencias/OcorrenciaForm';

export function useOcorrencias() {
  const [ocorrencias, setOcorrencias] = useState<Ocorrencia[]>([]);
  const [evidenciaLoading, setEvidenciaLoading] = useState<{ [id: number]: boolean }>({});
  const [evidenciaLinks, setEvidenciaLinks] = useState<{ [id: number]: string }>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

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
      const data = await getOcorrencias(pageToFetch); // Removido size e sort
      if (Array.isArray(data)) {
        setOcorrencias(data);
        setTotalPages(1);
      } else {
        setOcorrencias(data.content || []);
        setTotalPages(data.totalPages || 1);
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

  const handleGerarEvidencia = async (id: number) => {
    setEvidenciaLoading((prev) => ({ ...prev, [id]: true }));
    try {
      const url = await generateEvidenciaURL(`occ-${id}`);
      setEvidenciaLinks((prev) => ({ ...prev, [id]: url }));
    } catch {
      setEvidenciaLinks((prev) => ({ ...prev, [id]: 'Erro ao gerar evidência' }));
    } finally {
      setEvidenciaLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

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

  return {
    ocorrencias,
    evidenciaLoading,
    evidenciaLinks,
    loading,
    error,
    page,
    setPage,
    totalPages,
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
    handleGerarEvidencia,
    handleView,
    handleEdit,
    submitCreate,
    submitEdit,
  };
}
