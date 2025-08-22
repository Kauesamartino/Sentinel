'use client';


import styles from './ocorrenciaspage.module.scss';
import Button from '@/_components/Button';
import OcorrenciasTable from '@/_components/Ocorrencias/OcorrenciasTable';
import Pagination from '@/_components/Ocorrencias/Pagination';
import OcorrenciaViewModal from '@/_components/Ocorrencias/OcorrenciaViewModal';
import OcorrenciaCreateModal from '@/_components/Ocorrencias/OcorrenciaCreateModal';
import OcorrenciaEditModal from '@/_components/Ocorrencias/OcorrenciaEditModal';
import { useOcorrencias } from '@/hooks/useOcorrencias';


const rows = [
  { label: 'id', styles: styles.idcell },
  { label: 'Descrição', styles: styles.descriptioncell },
  { label: 'Categoria', styles: styles.categorycell },
  { label: 'Data', styles: styles.datetimecell },
  { label: 'Status', styles: styles.statuscell },
  { label: 'Grau', styles: styles.graucell },
  { label: '', styles: styles.evidencecell },
];



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
  const {
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
    editOpen,
    setEditOpen,
    editId,
    editInitial,
    createOpen,
    setCreateOpen,
    handleGerarEvidencia,
    handleView,
    handleEdit,
    submitCreate,
    submitEdit,
  } = useOcorrencias();

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
