import styles from './ocorrenciaspage.module.scss';

const rows = [
  { label: 'id', styles: styles.idcell },
  { label: 'Descrição', styles: styles.descriptioncell },
  { label: 'Categoria', styles: styles.categorycell },
  { label: 'Data', styles: styles.datetimecell },
  { label: 'Status', styles: styles.statuscell },
  { label: 'Grau', styles: styles.graucell },
  { label: 'Evidências', styles: styles.evidencecell },
  { label: 'Ações', styles: styles.actionscell },
];

const ocorrencias = [{
  id: 1,
  description: 'Ocorrência de teste',
  category: 'Categoria A',
  date: '2023-10-01',
  status: 'Pendente',
  grau: 'Alto',
  evidence: 'Evidência',
}, {
  id: 2,
  description: 'Outra ocorrência de teste',
  category: 'Categoria B',
  date: '2023-10-02',
  status: 'Concluída',
  grau: 'Médio',
  evidence: 'Evidência',
}, {
  id: 3,
  description: 'Mais uma ocorrência de teste',
  category: 'Categoria C',
  date: '2023-10-03',
  status: 'Em andamento',
  grau: 'Baixo',
  evidence: 'Evidência',
}]

const OcorrenciasPage = () => {
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
                <td className={styles.cell}>{ocorrencia.id}</td>
                <td className={styles.cell}>{ocorrencia.description}</td>
                <td className={styles.cell}>{ocorrencia.category}</td>
                <td className={styles.cell}>{ocorrencia.date}</td>
                <td className={styles.cell}>{ocorrencia.status}</td>
                <td className={styles.cell}>{ocorrencia.grau}</td>
                <td className={styles.cell}>{ocorrencia.evidence}</td>
                <td className={styles.cell}>Ver Editar</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};



export default OcorrenciasPage;
