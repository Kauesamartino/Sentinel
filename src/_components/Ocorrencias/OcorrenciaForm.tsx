'use client';

import React, { useMemo, useState } from 'react';
import styles from './ocorrenciaForm.module.scss';

export type OcorrenciaPayload = {
  titulo: string;
  descricao: string;
  severidade: 'BAIXA' | 'MEDIA' | 'ALTA';
  tipoOcorrencia: 'ACIDENTE' | 'FALHA_TECNICA' | 'INCIDENTE' | 'OUTROS';
};

export type OcorrenciaUpdatePayload = OcorrenciaPayload & {
  id: number;
  status: 'ABERTO' | 'EM_ANDAMENTO' | 'CONCLUIDO' | string;
};

// Utility function to format enum values for display
export const formatEnumValue = (value: string): string => {
  if (!value) return '';
  
  // Handle LINHA_X_NAME format
  if (value.startsWith('LINHA_')) {
    const parts = value.replace('LINHA_', '').split('_');
    if (parts.length >= 2) {
      const number = parts[0];
      const name = parts.slice(1).join(' ');
      return `Linha ${number} - ${name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()}`;
    }
  }
  
  // Handle other enum formats
  return value
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
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
  });

  const isValid = useMemo(() => !!form.titulo && !!form.tipoOcorrencia, [form]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
            <option value="ABERTO">ABERTO</option>
            <option value="EM_ANDAMENTO">EM_ANDAMENTO</option>
            <option value="CONCLUIDO">CONCLUIDO</option>
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
          <option value="ACIDENTE">ACIDENTE</option>
          <option value="FALHA_TECNICA">FALHA_TÉCNICA</option>
          <option value="INCIDENTE">INCIDENTE</option>
          <option value="OUTROS">OUTROS</option>
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