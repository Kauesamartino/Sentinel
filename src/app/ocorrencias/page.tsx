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
            <tr className={styles.tr}>
              {rows.map((_, index) => (
                <td key={index} className={styles.cell}>
                  {/* Conteúdo da célula */}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  );
};



export default OcorrenciasPage;
