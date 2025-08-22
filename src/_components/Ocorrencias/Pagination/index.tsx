import React from 'react';
import Button from '@/_components/Button';
import styles from './Pagination.module.scss';

interface PaginationProps {
	page: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ page, totalPages, onPageChange }) => {
	if (totalPages <= 1) return null;
	return (
		<div className={styles.pagination}>
			<Button
				variant="secondary"
				size="small"
				onClick={() => onPageChange(Math.max(0, page - 1))}
				disabled={page === 0}
			>
				Anterior
			</Button>
			<span className={styles.paginationLabel}>
				Página {page + 1} de {totalPages}
			</span>
			<Button
				variant="secondary"
				size="small"
				onClick={() => onPageChange(Math.min(totalPages - 1, page + 1))}
				disabled={page >= totalPages - 1}
			>
				Próxima
			</Button>
		</div>
	);
};

export default Pagination;
