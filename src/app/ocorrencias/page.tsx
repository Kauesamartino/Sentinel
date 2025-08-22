'use client';

import { useEffect, useState } from 'react';
import styles from './ocorrenciaspage.module.scss';
import { getOcorrencias, getOcorrenciaById, createOcorrencia, updateOcorrencia } from '@/services/ocorrenciasService';
import { generateEvidenciaURL } from '@/services/evidenciaService';
import Button from '@/_components/Button';
import OcorrenciasTable, { Ocorrencia } from '@/_components/Ocorrencias/OcorrenciasTable/index';
import Pagination from '@/_components/Ocorrencias/Pagination/index';
import OcorrenciaViewModal from '@/_components/Ocorrencias/OcorrenciaViewModal/index';
import OcorrenciaCreateModal from '@/_components/Ocorrencias/OcorrenciaCreateModal/index';
import OcorrenciaEditModal from '@/_components/Ocorrencias/OcorrenciaEditModal/index';
import OcorrenciaForm, { OcorrenciaPayload, OcorrenciaUpdatePayload, formatEnumValue } from '@/_components/Ocorrencias/OcorrenciaForm/index';


const rows = [
  { label: 'id', styles: styles.idcell },
  { label: 'Descrição', styles: styles.descriptioncell },
  { label: 'Categoria', styles: styles.categorycell },
  { label: 'Data', styles: styles.datetimecell },
  { label: 'Status', styles: styles.statuscell },
  { label: 'Grau', styles: styles.graucell },
  { label: '', styles: styles.evidencecell },
];


// Tipo Ocorrencia importado de OcorrenciasTable

type OcorrenciaDetalhe = {
  id: number;
  titulo: string;
  descricao: string;
  data: string;
  severidade: string;
  status: string;
  tipoOcorrencia: string;
  ativo?: boolean;
  dadosDetalhamentoEstacao?: {
    id: number;
    nome: string;
    linha?: string;
    dadosControle?: {
      id: number;
      nome: string;
    };
    endereco?: {
      logradouro: string;
      bairro: string;
      cep: string;
      numero: string;
      complemento: string;
      cidade: string;
      uf: string;
    };
  };
};

function formatDate(value: string): string {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

const OcorrenciasPage = () => {


  const [ocorrencias, setOcorrencias] = useState<Ocorrencia[]>([]);
  const [evidenciaLoading, setEvidenciaLoading] = useState<{ [id: number]: boolean }>({});
  const [evidenciaLinks, setEvidenciaLinks] = useState<{ [id: number]: string }>({});
  // Gera a evidência para uma ocorrência
  const handleGerarEvidencia = async (id: number) => {
    setEvidenciaLoading((prev) => ({ ...prev, [id]: true }));
    try {
      const url = await generateEvidenciaURL(`occ-${id}`); // ajuste se o id já vier com prefixo
      setEvidenciaLinks((prev) => ({ ...prev, [id]: url }));
    } catch {
      setEvidenciaLinks((prev) => ({ ...prev, [id]: 'Erro ao gerar evidência' }));
    } finally {
      setEvidenciaLoading((prev) => ({ ...prev, [id]: false }));
    }
  };
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
      const data = await getOcorrencias(pageToFetch, 10, 'id');
      // Suporte a paginação: espera-se que a API retorne { content, totalPages }
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
  // ...existing code...

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
      const data: OcorrenciaDetalhe = await getOcorrenciaById(id);
      setEditId(id);
      setEditInitial({
        id: data.id,
        titulo: data.titulo,
        descricao: data.descricao,
        severidade: data.severidade as 'BAIXA' | 'MEDIA' | 'ALTA',
        status: data.status as 'ABERTO' | 'EM_ANDAMENTO' | 'CONCLUIDO' | string,
        tipoOcorrencia: data.tipoOcorrencia as 'ACIDENTE' | 'FALHA_TECNICA' | 'INCIDENTE' | 'OUTROS',
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

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Ocorrências</h1>
          <div className={styles.headerButtonWrapper}>
            <Button 
              onClick={() => setCreateOpen(true)}
              variant="primary"
              size="medium"
              className={styles.newOccurrenceButton}
            >
              Nova ocorrência
            </Button>
          </div>
        </div>
        {error && <div className={styles.errorMessage}>{error}</div>}
        <OcorrenciasTable
          ocorrencias={ocorrencias}
          loading={loading}
          error={error}
          rows={rows}
          evidenciaLoading={evidenciaLoading}
          evidenciaLinks={evidenciaLinks}
          onGerarEvidencia={handleGerarEvidencia}
          onView={handleView}
          onEdit={handleEdit}
        />
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
      <OcorrenciaViewModal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        viewData={viewData}
        formatDate={formatDate}
      />
      <OcorrenciaCreateModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={submitCreate}
      />
      <OcorrenciaEditModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        editId={editId}
        initial={editInitial}
        onSubmit={submitEdit}
      />
    </main>
  );
};



export default OcorrenciasPage;
