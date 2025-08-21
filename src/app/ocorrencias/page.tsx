'use client';

import { useEffect, useState } from 'react';
import styles from './ocorrenciaspage.module.scss';
import { getOcorrencias, getOcorrenciaById, createOcorrencia, updateOcorrencia } from '@/services/ocorrenciasService';
import { generateEvidenciaURL } from '@/services/evidenciaService';
import Modal from '@/_components/Modal';
import OcorrenciaForm, { OcorrenciaPayload, OcorrenciaUpdatePayload, formatEnumValue } from '@/_components/Ocorrencias/OcorrenciaForm';
import viewStyles from '@/_components/Ocorrencias/ocorrenciaView.module.scss';
import Button from '@/_components/Button';


const rows = [
  { label: 'id', styles: styles.idcell },
  { label: 'Descrição', styles: styles.descriptioncell },
  { label: 'Categoria', styles: styles.categorycell },
  { label: 'Data', styles: styles.datetimecell },
  { label: 'Status', styles: styles.statuscell },
  { label: 'Grau', styles: styles.graucell },
  { label: '', styles: styles.evidencecell },
];


type Ocorrencia = {
  id: number;
  description: string;
  category: string;
  date: string;
  status: string;
  grau: string;
  evidence: string;
};

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
  // Renderização dos controles de paginação
  const renderPagination = () => {
    if (totalPages <= 1) return null;
    return (
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, margin: '24px 0' }}>
        <Button
          variant="secondary"
          size="small"
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
        >
          Anterior
        </Button>
        <span style={{ alignSelf: 'center', fontWeight: 500 }}>
          Página {page + 1} de {totalPages}
        </span>
        <Button
          variant="secondary"
          size="small"
          onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          disabled={page >= totalPages - 1}
        >
          Próxima
        </Button>
      </div>
    );
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
        <div className={styles.tableScrollContainer}>
          <table className={styles.table}>
            <thead className={styles.thead}>
              <tr className={styles.tr}>
                {rows.map((row, index) => (
                  <th key={index} className={`${styles.headerrows} ${row.styles}`}>
                    {row.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className={styles.tbody}>
              {loading ? (
                <tr className={styles.tr}>
                  <td colSpan={rows.length} className={styles.loadingMessage}>
                    Carregando...
                  </td>
                </tr>
              ) : (
                ocorrencias.map((ocorrencia, index) => (
                  <tr className={styles.tr} key={index}>
                    <td className={`${styles.cell} ${styles.idcell}`}>{ocorrencia.id}</td>
                    <td className={styles.cell}>{ocorrencia.description}</td>
                    <td className={styles.cell}>{formatEnumValue(ocorrencia.category)}</td>
                    <td className={styles.cell}>{formatDate(ocorrencia.date)}</td>
                    <td className={styles.cell}>{formatEnumValue(ocorrencia.status)}</td>
                    <td className={styles.cell}>{formatEnumValue(ocorrencia.grau)}</td>
                    <td className={styles.cell}>
                      <div className={styles.evidenceActions}>
                        {ocorrencia.evidence && <span>{ocorrencia.evidence}</span>}
                        <Button
                          variant="transparent"
                          size="small"
                          onClick={() => handleGerarEvidencia(ocorrencia.id)}
                          disabled={evidenciaLoading[ocorrencia.id]}
                        >
                          {evidenciaLoading[ocorrencia.id] ? 'Gerando...' : 'Gerar evidência'}
                        </Button>
                        <Button
                          onClick={() => handleView(ocorrencia.id)}
                          variant="transparent"
                          size="small"
                        >
                          Ver
                        </Button>
                        <Button
                          onClick={() => handleEdit(ocorrencia.id)}
                          variant="transparent"
                          size="small"
                        >
                          Editar
                        </Button>
                      </div>
                      {evidenciaLinks[ocorrencia.id] && evidenciaLinks[ocorrencia.id].startsWith('http') && (
                        <div>
                          <a href={evidenciaLinks[ocorrencia.id]} target="_blank" rel="noopener noreferrer" style={{ color: '#273BE2', fontWeight: 500, fontSize: 13 }}>
                            Ver evidência
                          </a>
                        </div>
                      )}
                      {evidenciaLinks[ocorrencia.id] && evidenciaLinks[ocorrencia.id].startsWith('Erro') && (
                        <div style={{ color: '#e30613', fontSize: 13 }}>{evidenciaLinks[ocorrencia.id]}</div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {renderPagination()}
      </div>

      <Modal open={viewOpen} title="Ocorrência" onClose={() => setViewOpen(false)} width={600}>
        {!viewData ? (
          <div className={styles.loadingMessage}>Carregando...</div>
        ) : (
          <div className={viewStyles.viewContainer}>
            <div className={viewStyles.fields}>
              <div className={viewStyles.field}>
                <span className={viewStyles.label}>Título</span>
                <div className={viewStyles.value}>{viewData.titulo}</div>
              </div>
              
              <div className={viewStyles.field}>
                <span className={viewStyles.label}>Descrição</span>
                <div className={viewStyles.description}>{viewData.descricao || 'Sem descrição'}</div>
              </div>
              
              <div className={viewStyles.field}>
                <span className={viewStyles.label}>Data</span>
                <div className={viewStyles.value}>{formatDate(viewData.data)}</div>
              </div>
              
              <div className={viewStyles.field}>
                <span className={viewStyles.label}>Severidade</span>
                <div className={viewStyles.value}>{formatEnumValue(viewData.severidade)}</div>
              </div>
              
              <div className={viewStyles.field}>
                <span className={viewStyles.label}>Status</span>
                <div className={viewStyles.value}>{formatEnumValue(viewData.status)}</div>
              </div>
              
              <div className={viewStyles.field}>
                <span className={viewStyles.label}>Tipo</span>
                <div className={viewStyles.value}>{formatEnumValue(viewData.tipoOcorrencia)}</div>
              </div>
            </div>
            
            {viewData?.dadosDetalhamentoEstacao && (
              <div className={viewStyles.stationInfo}>
                <h4 className={viewStyles.stationTitle}>Informações da Estação</h4>
                <div className={viewStyles.stationDetails}>
                  <div><strong>Nome:</strong> {viewData.dadosDetalhamentoEstacao?.nome}</div>
                  {viewData.dadosDetalhamentoEstacao?.linha && (
                    <div><strong>Linha: </strong>{formatEnumValue(viewData.dadosDetalhamentoEstacao.linha)}</div>
                  )}
                  {viewData.dadosDetalhamentoEstacao?.dadosControle && (
                    <div><strong>Centro de Controle:</strong> {viewData.dadosDetalhamentoEstacao.dadosControle.nome}</div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      <Modal open={createOpen} title="Nova ocorrência" onClose={() => setCreateOpen(false)} width={500}>
        <OcorrenciaForm submitLabel="Criar" onSubmit={submitCreate} />
      </Modal>

      <Modal open={editOpen} title={editId ? `Editar ocorrência #${editId}` : 'Editar'} onClose={() => setEditOpen(false)} width={500}>
        <OcorrenciaForm initial={editInitial} submitLabel="Salvar" onSubmit={submitEdit} isEdit={true} />
      </Modal>
    </main>
  );
};



export default OcorrenciasPage;
