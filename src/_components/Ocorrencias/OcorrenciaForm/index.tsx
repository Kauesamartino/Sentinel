'use client';

import React, { useMemo, useState, useEffect } from 'react';
import styles from './OcorrenciaForm.module.scss';
import { getEstacoes, type Estacao } from '@/services/estacoesService';

export type OcorrenciaPayload = {
  titulo: string;
  descricao: string;
  severidade: 'BAIXA' | 'MEDIA' | 'ALTA';
  tipoOcorrencia: 'ACIDENTE' | 'FALHA_TECNICA' | 'INCIDENTE' | 'OUTROS';
  idEstacao: number;
};

export type OcorrenciaUpdatePayload = OcorrenciaPayload & {
  id: number;
  status: 'ABERTO' | 'EM_ANDAMENTO' | 'CONCLUIDO' | string;
};


type Props = {
  initial?: Partial<OcorrenciaUpdatePayload>;
  onSubmit: (payload: OcorrenciaPayload | OcorrenciaUpdatePayload) => Promise<void> | void;
  submitLabel?: string;
  isEdit?: boolean;
};

export default function OcorrenciaForm({ initial, onSubmit, submitLabel = 'Salvar', isEdit = false }: Props) {
  const [form, setForm] = useState<OcorrenciaUpdatePayload>({
    id: initial?.id ?? 0,
    titulo: initial?.titulo ?? '',
    descricao: initial?.descricao ?? '',
    severidade: (initial?.severidade as 'BAIXA' | 'MEDIA' | 'ALTA') ?? 'BAIXA',
    status: (initial?.status as 'ABERTO' | 'EM_ANDAMENTO' | 'CONCLUIDO' | string) ?? 'ABERTO',
    tipoOcorrencia: (initial?.tipoOcorrencia as 'ACIDENTE' | 'FALHA_TECNICA' | 'INCIDENTE' | 'OUTROS') ?? 'INCIDENTE',
    idEstacao: (initial as { idEstacao?: number })?.idEstacao ?? 0,
  });

  const isValid = useMemo(() => !!form.titulo && !!form.tipoOcorrencia && form.idEstacao > 0, [form]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
    const [estacoes, setEstacoes] = useState<Estacao[]>([]);
  const [loadingEstacoes, setLoadingEstacoes] = useState(true);

  // Função para agrupar estações por linha
  const estacoesAgrupadas = useMemo(() => {
    const grupos: Record<string, Estacao[]> = {};
    
    estacoes.forEach((estacao) => {
      const linha = estacao.linha.replace('LINHA_', 'Linha ').replace('_', ' ');
      if (!grupos[linha]) {
        grupos[linha] = [];
      }
      grupos[linha].push(estacao);
    });
    
    // Ordenar estações dentro de cada linha por nome
    Object.keys(grupos).forEach((linha) => {
      grupos[linha].sort((a, b) => a.nome.localeCompare(b.nome));
    });
    
    return grupos;
  }, [estacoes]);

  useEffect(() => {
    const fetchEstacoes = async () => {
      try {
        const response = await getEstacoes();
        setEstacoes(response.content || []);
      } catch (err) {
        console.error('Erro ao buscar estações:', err);
        setError('Erro ao carregar estações');
      } finally {
        setLoadingEstacoes(false);
      }
    };

    fetchEstacoes();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      if (isEdit) {
        await onSubmit(form);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, status, ...createPayload } = form;
        await onSubmit(createPayload);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Falha ao salvar';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {error && <div className={styles.error}>{error}</div>}
      
      <div className={styles.field}>
        <label className={styles.label}>Título</label>
        <input 
          name="titulo" 
          value={form.titulo} 
          onChange={handleChange} 
          required 
          className={styles.input}
          placeholder="Digite o título da ocorrência"
        />
      </div>
      
      <div className={styles.field}>
        <label className={styles.label}>Descrição</label>
        <textarea 
          name="descricao" 
          value={form.descricao} 
          onChange={handleChange} 
          rows={3} 
          className={styles.textarea}
          placeholder="Descreva os detalhes da ocorrência"
        />
      </div>
      
      <div className={styles.field}>
        <label className={styles.label}>Estação</label>
        <select 
          name="idEstacao" 
          value={form.idEstacao} 
          onChange={handleChange}
          required
          className={styles.select}
          disabled={loadingEstacoes}
        >
          <option value={0}>
            {loadingEstacoes ? 'Carregando estações...' : 'Selecione uma estação'}
          </option>
          {Object.entries(estacoesAgrupadas)
            .sort(([linhaA], [linhaB]) => linhaA.localeCompare(linhaB))
            .map(([linha, estacoesLinha]) => (
              <optgroup key={linha} label={linha}>
                {estacoesLinha.map((estacao) => (
                  <option key={estacao.id} value={estacao.id}>
                    {estacao.nome}
                  </option>
                ))}
              </optgroup>
            ))}
        </select>
      </div>
      
      {!isEdit && (
        <div className={styles.field}>
          <label className={styles.label}>Severidade</label>
          <select 
            name="severidade" 
            value={form.severidade} 
            onChange={handleChange}
            className={styles.select}
          >
            <option value="BAIXA">BAIXA</option>
            <option value="MEDIA">MEDIA</option>
            <option value="ALTA">ALTA</option>
          </select>
        </div>
      )}
      
      {isEdit && (
        <div className={styles.field}>
          <label className={styles.label}>Status</label>
          <select 
            name="status" 
            value={form.status} 
            onChange={handleChange}
            className={styles.select}
          >
            <option value="ABERTO">Aberto</option>
            <option value="EM_ANDAMENTO">Em andamento</option>
            <option value="CONCLUIDO">Concluído</option>
          </select>
        </div>
      )}
      
      <div className={styles.field}>
        <label className={styles.label}>Tipo</label>
        <select 
          name="tipoOcorrencia" 
          value={form.tipoOcorrencia} 
          onChange={handleChange}
          className={styles.select}
        >
          <option value="ACIDENTE">Acidente</option>
          <option value="FALHA_TECNICA">Falha técnica</option>
          <option value="INCIDENTE">Incidente</option>
          <option value="OUTROS">Outros</option>
        </select>
      </div>
      
      <div className={styles.actions}>
        <button 
          type="submit" 
          disabled={!isValid || submitting}
          className={styles.submitButton}
        >
          {submitting ? 'Salvando...' : submitLabel}
        </button>
      </div>
    </form>
  );
} 