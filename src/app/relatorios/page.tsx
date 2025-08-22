'use client';

import { useEffect, useMemo, useState } from 'react';
import styles from './relatoriospage.module.scss';
import Button from '@/_components/Button';
import Modal from '@/_components/Modal';
import { createRelatorio, listOcorrenciasByRelatorio, listRelatorios, RelatorioCreate } from '@/services/relatoriosService';
import { formatEnumValue } from '../../utils/formatEnumValue';

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
  tipoOcorrencia?: 'ACIDENTE' | 'FALHA_TECNICA' | 'INCIDENTE' | 'OUTROS' | string;
  dataInicio: string;
  dataFim: string;
};

type RelatorioFormState = {
  titulo: string;
  descricao: string;
  tipoOcorrencia?: 'ACIDENTE' | 'FALHA_TECNICA' | 'INCIDENTE' | 'OUTROS' | '';
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
  const [relatorios, setRelatorios] = useState<Relatorio[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState<RelatorioFormState>(defaultForm);
  const isValid = useMemo(() => !!form.titulo && !!form.dataInicio && !!form.dataFim, [form]);

  const [viewOpen, setViewOpen] = useState(false);
  const [viewId, setViewId] = useState<number | null>(null);
  // const [viewPage, setViewPage] = useState(0); // Removido pois não é usado
  type OcorrenciaView = {
    id: number;
    titulo: string;
    tipoOcorrencia?: string;
    data: string;
    severidade?: string;
    status?: string;
  };
  const [viewData, setViewData] = useState<{ content: OcorrenciaView[]; totalElements: number } | null>(null);

  const refreshList = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listRelatorios({ page: 0, size: 10, sort: 'id' });
      const content = Array.isArray(res?.content) ? res.content : [];
      setRelatorios(content);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Erro ao listar relatórios';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshList();
  }, []);

  const openView = async (id: number, page = 0) => {
    setViewOpen(true);
    setViewId(id);
    try {
      const res = await listOcorrenciasByRelatorio(id, { page, size: 10, sort: 'id' });
      setViewData(res);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Falha ao carregar ocorrências do relatório';
      setViewData({ content: [], totalElements: 0 });
      setError(msg);
    }
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
      setError(msg);
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
              <th className={styles.cell}>Ações</th>
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
              <option value="ACIDENTE">ACIDENTE</option>
              <option value="FALHA_TECNICA">FALHA_TECNICA</option>
              <option value="INCIDENTE">INCIDENTE</option>
              <option value="OUTROS">OUTROS</option>
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
        {!viewData ? (
          <div className={styles.loading}>Carregando...</div>
        ) : (
          <div>
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
                {(viewData.content || []).map((o) => (
                  <tr className={styles.tr} key={o.id}>
                    <td className={styles.cell}>{o.id}</td>
                    <td className={styles.cell}>{o.titulo}</td>
                    <td className={styles.cell}>{formatEnumValue(o.tipoOcorrencia ?? '')}</td>
                    <td className={styles.cell}>{formatDate(o.data)}</td>
                    <td className={styles.cell}>{formatEnumValue(o.severidade ?? '')}</td>
                    <td className={styles.cell}>{formatEnumValue(o.status ?? '')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Pagination controls could go here using viewPage and totalElements */}
          </div>
        )}
      </Modal>
    </main>
  );
}
