import React from "react";
import styles from "./Pagination.module.scss";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className={styles.paginationContainer}>
      <button
        className={styles.pageButton}
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        Anterior
      </button>
      <span className={styles.pageInfo}>
        Página {page} de {totalPages}
      </span>
      <button
        className={styles.pageButton}
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Próxima
      </button>
    </div>
  );
};

export default Pagination;
