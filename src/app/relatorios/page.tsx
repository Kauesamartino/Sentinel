/* eslint-disable */
'use client';

import { useMemo, useState } from 'react';
import styles from './relatoriospage.module.scss';
import Button from '@/_components/Button';
import Pagination from '@/_components/Pagination';
import Modal from '@/_components/Modal';
import OcorrenciaViewModal from '@/_components/Ocorrencias/OcorrenciaViewModal';
import { createRelatorio, RelatorioCreate } from '@/services/relatoriosService';
import { getOcorrenciaById } from '@/services/ocorrenciasService';
import { formatEnumValue } from '../../utils/formatEnumValue';
import { useRelatorios } from '@/hooks/useRelatorios';
import { useRelatorioOcorrencias } from '@/hooks/useRelatorioOcorrencias';

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

type Relatorio = {
  id: number;
  titulo: string;
  descricao: string;
  tipoOcorrencia?: 'ASSEDIO' | 'AGRESSAO' | 'VENDEDOR_AMBULANTE' | 'FURTO' | 'PERTURBACAO' | 'OBJETOS_SUSPEITOS' | 'OUTROS' | string;
  dataInicio: string;
  dataFim: string;
};

type RelatorioFormState = {
  titulo: string;
  descricao: string;
  tipoOcorrencia?: 'ASSEDIO' | 'AGRESSAO' | 'VENDEDOR_AMBULANTE' | 'FURTO' | 'PERTURBACAO' | 'OBJETOS_SUSPEITOS' | 'OUTROS' | '';
  dataInicio: string;
  dataFim: string;
};

const defaultForm: RelatorioFormState = {
  titulo: '',
  descricao: '',
  tipoOcorrencia: '',
  dataInicio: new Date().toISOString(),
  dataFim: new Date().toISOString(),
};

export default function RelatoriosPage() {
  const {
    relatorios,
    loading,
    error,
    totalPages,
    totalElements,
    pageSize,
    currentPage,
    prev,
    next,
    goToPrevious,
    goToNext,
    refreshList,
  } = useRelatorios();

  const {
    viewData,
    loading: viewLoading,
    error: viewError,
    totalPages: viewTotalPages,
    totalElements: viewTotalElements,
    pageSize: viewPageSize,
    currentPage: viewCurrentPage,
    prev: viewPrev,
    next: viewNext,
    loadOcorrencias,
    goToPrevious: viewGoToPrevious,
    goToNext: viewGoToNext,
    resetData,
  } = useRelatorioOcorrencias();

  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState<RelatorioFormState>(defaultForm);
  const isValid = useMemo(() => !!form.titulo && !!form.dataInicio && !!form.dataFim, [form]);

  const [viewOpen, setViewOpen] = useState(false);
  const [viewId, setViewId] = useState<number | null>(null);

  // Estados para o modal de detalhes da ocorrência
  const [ocorrenciaModalOpen, setOcorrenciaModalOpen] = useState(false);
  const [, setSelectedOcorrenciaId] = useState<number | null>(null);
  const [ocorrenciaDetails, setOcorrenciaDetails] = useState<any>(null);

  const openView = async (id: number) => {
    setViewOpen(true);
    setViewId(id);
    resetData();
    await loadOcorrencias(id, 0);
  };

  const submitCreate = async () => {
    try {
      const payload: RelatorioCreate = {
        titulo: form.titulo,
        descricao: form.descricao,
        tipoOcorrencia: form.tipoOcorrencia || undefined,
        dataInicio: form.dataInicio,
        dataFim: form.dataFim,
      };
      await createRelatorio(payload);
      setCreateOpen(false);
      setForm(defaultForm);
      await refreshList();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Falha ao criar relatório';
    }
  };

  // Função para abrir o modal de detalhes da ocorrência
  const handleOcorrenciaClick = async (ocorrenciaId: number) => {
    try {
      setSelectedOcorrenciaId(ocorrenciaId);
      setOcorrenciaModalOpen(true);
      setOcorrenciaDetails(null); // Reset dos detalhes
      
      // Buscar detalhes da ocorrência
      const details = await getOcorrenciaById(ocorrenciaId);
      setOcorrenciaDetails(details);
    } catch (error) {
      console.error('Erro ao buscar detalhes da ocorrência:', error);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Relatórios de Ocorrências</h1>
          <div className={styles.headerButtonWrapper}>
            <Button variant="primary" onClick={() => setCreateOpen(true)}>Gerar relatório</Button>
          </div>
        </div>

        {error && <div className={styles.loading}>{error}</div>}

        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr className={styles.tr}>
              <th className={`${styles.cell} ${styles.id}`}>ID</th>
              <th className={styles.cell}>Título</th>
              <th className={styles.cell}>Tipo</th>
              <th className={styles.cell}>Início</th>
              <th className={styles.cell}>Fim</th>
              <th className={styles.cell}></th>
            </tr>
          </thead>
          <tbody className={styles.tbody}>
            {loading ? (
              <tr className={styles.tr}><td colSpan={6} className={`${styles.cell} ${styles.loading}`}>Carregando...</td></tr>
            ) : (
              relatorios.map((r) => (
                <tr className={styles.tr} key={r.id}>
                  <td className={`${styles.cell} ${styles.id}`}>{r.id}</td>
                  <td className={styles.cell}>{r.titulo}</td>
                  <td className={styles.cell}>{r.tipoOcorrencia ? formatEnumValue(String(r.tipoOcorrencia)) : 'Todos'}</td>
                  <td className={styles.cell}>{formatDate(r.dataInicio)}</td>
                  <td className={styles.cell}>{formatDate(r.dataFim)}</td>
                  <td className={styles.cell}>
                    <div className={styles.actions}>
                      <Button variant="transparent" size="small" onClick={() => openView(r.id)}>Ver relatório</Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          totalElements={totalElements}
          pageSize={pageSize}
          prev={prev}
          next={next}
          onPrevious={goToPrevious}
          onNext={goToNext}
        />
      </div>

      <Modal open={createOpen} title="Gerar relatório" onClose={() => setCreateOpen(false)} width={600}>
        <div className={styles.formGrid}>
          <div className={styles.formRow}>
            <label className={styles.label}>Título</label>
            <input className={styles.input} value={form.titulo} onChange={(e) => setForm((p) => ({ ...p, titulo: e.target.value }))} />
          </div>
          <div className={styles.formRow}>
            <label className={styles.label}>Descrição</label>
            <textarea className={styles.input} rows={3} value={form.descricao} onChange={(e) => setForm((p) => ({ ...p, descricao: e.target.value }))} />
          </div>
          <div className={styles.formRow}>
            <label className={styles.label}>Tipo de Ocorrência (opcional)</label>
            <select className={styles.select} value={form.tipoOcorrencia} onChange={(e) => setForm((p) => ({ ...p, tipoOcorrencia: e.target.value as RelatorioFormState['tipoOcorrencia'] }))}>
              <option value="">Todos</option>
              <option value="ASSEDIO">Assédio</option>
              <option value="AGRESSAO">Agressão</option>
              <option value="VENDEDOR_AMBULANTE">Vendedor Ambulante</option>
              <option value="FURTO">Furto</option>
              <option value="PERTURBACAO">Perturbação</option>
              <option value="OBJETOS_SUSPEITOS">Objetos Suspeitos</option>
              <option value="OUTROS">Outros</option>
            </select>
          </div>
          <div className={styles.dateRow}>
            <div className={styles.formRow}>
              <label className={styles.label}>Data inicial</label>
              <input className={styles.input} type="datetime-local" value={form.dataInicio.slice(0,16)} onChange={(e) => setForm((p) => ({ ...p, dataInicio: new Date(e.target.value).toISOString() }))} />
            </div>
            <div className={styles.formRow}>
              <label className={styles.label}>Data final</label>
              <input className={styles.input} type="datetime-local" value={form.dataFim.slice(0,16)} onChange={(e) => setForm((p) => ({ ...p, dataFim: new Date(e.target.value).toISOString() }))} />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button variant="secondary" onClick={() => setCreateOpen(false)}>Cancelar</Button>
            <Button variant="primary" onClick={submitCreate} disabled={!isValid}>Gerar</Button>
          </div>
        </div>
      </Modal>

      <Modal open={viewOpen} title={viewId ? `Relatório #${viewId}` : 'Relatório'} onClose={() => setViewOpen(false)} width={800}>
        {viewLoading && !viewData ? (
          <div className={styles.loading}>Carregando...</div>
        ) : (
          <div>
            {viewError && <div className={styles.loading}>{viewError}</div>}
            <table className={styles.table}>
              <thead className={styles.thead}>
                <tr className={styles.tr}>
                  <th className={styles.cell}>ID</th>
                  <th className={styles.cell}>Título</th>
                  <th className={styles.cell}>Tipo</th>
                  <th className={styles.cell}>Data</th>
                  <th className={styles.cell}>Severidade</th>
                  <th className={styles.cell}>Status</th>
                </tr>
              </thead>
              <tbody className={styles.tbody}>
                {viewLoading ? (
                  <tr className={styles.tr}>
                    <td colSpan={6} className={`${styles.cell} ${styles.loading}`}>
                      Carregando...
                    </td>
                  </tr>
                ) : (
                  (viewData?.content || []).map((o) => (
                    <tr 
                      className={`${styles.tr} ${styles.clickableRow}`} 
                      key={o.id}
                      onClick={() => handleOcorrenciaClick(o.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td className={styles.cell}>{o.id}</td>
                      <td className={styles.cell}>{o.titulo}</td>
                      <td className={styles.cell}>{formatEnumValue(o.tipoOcorrencia ?? '')}</td>
                      <td className={styles.cell}>{formatDate(o.data)}</td>
                      <td className={styles.cell}>{formatEnumValue(o.severidade ?? '')}</td>
                      <td className={styles.cell}>{formatEnumValue(o.status ?? '')}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            
            {viewTotalPages > 1 && viewId && (
              <Pagination 
                currentPage={viewCurrentPage}
                totalPages={viewTotalPages}
                totalElements={viewTotalElements}
                pageSize={viewPageSize}
                prev={viewPrev}
                next={viewNext}
                onPrevious={() => viewGoToPrevious(viewId)}
                onNext={() => viewGoToNext(viewId)}
              />
            )}
          </div>
        )}
      </Modal>

      {/* Modal de detalhes da ocorrência */}
      <OcorrenciaViewModal
        open={ocorrenciaModalOpen}
        onClose={() => setOcorrenciaModalOpen(false)}
        viewData={ocorrenciaDetails}
        formatDate={formatDate}
      />
    </main>
  );
}
