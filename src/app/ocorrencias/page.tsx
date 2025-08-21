'use client';

import { useEffect, useState } from 'react';
import styles from './ocorrenciaspage.module.scss';
import { getOcorrencias } from '@/services/ocorrenciasService';


const rows = [
  { label: 'id', styles: styles.idcell },
  { label: 'Descrição', styles: styles.descriptioncell },
  { label: 'Categoria', styles: styles.categorycell },
  { label: 'Data', styles: styles.datetimecell },
  { label: 'Status', styles: styles.statuscell },
  { label: 'Grau', styles: styles.graucell },
  { label: 'Evidências', styles: styles.evidencecell },
  { label: '', styles: styles.actionscell },
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


  useEffect(() => {
    const fetchOcorrencias = async () => {
      // Example: requesting page=0, size=1, sort=id as required
      const data = await getOcorrencias(0, 1, 'id');
      setOcorrencias(data);
    };

    fetchOcorrencias();
  }, []);

  return (
    <main className={styles.main}>
      <h1>Ocorrências</h1>
      <div className={styles.container}>
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
            {ocorrencias.map((ocorrencia, index) => (
              <tr className={styles.tr} key={index}>
                <td className={`${styles.cell} ${styles.idcell}`}>{ocorrencia.id}</td>
                <td className={styles.cell}>{ocorrencia.description}</td>
                <td className={styles.cell}>{ocorrencia.category}</td>
                <td className={styles.cell}>{formatDate(ocorrencia.date)}</td>
                <td className={styles.cell}>{ocorrencia.status}</td>
                <td className={styles.cell}>{ocorrencia.grau}</td>
                <td className={styles.cell}>{ocorrencia.evidence}</td>
                <td className={styles.cell}>Ver</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};



export default OcorrenciasPage;
