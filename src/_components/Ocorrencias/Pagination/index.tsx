import React from 'react';
import Button from '@/_components/Button';
import styles from './Pagination.module.scss';

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	totalElements: number;
	pageSize: number;
	prev: number | null;
	next: number | null;
	onPrevious: () => void;
	onNext: () => void;
}

const Pagination: React.FC<PaginationProps> = ({ 
	currentPage, 
	totalPages, 
	totalElements, 
	pageSize,
	prev, 
	next, 
	onPrevious, 
	onNext
}) => {
	if (totalPages <= 1) return null;

	// Calcular range de itens mostrados
	const startItem = (currentPage - 1) * pageSize + 1;
	const endItem = Math.min(currentPage * pageSize, totalElements);
	
	return (
		<div className={styles.pagination}>
			<div className={styles.paginationInfo}>
				<span>Mostrando {startItem}-{endItem} de {totalElements} itens</span>
			</div>
			
			<div className={styles.paginationControls}>
				{prev !== null && (
					<Button
						variant="secondary"
						size="small"
						onClick={onPrevious}
					>
						← Anterior
					</Button>
				)}
				
				<span className={styles.paginationLabel}>
					Página {currentPage} de {totalPages}
				</span>
				
				{next !== null && (
					<Button
						variant="secondary"
						size="small"
						onClick={onNext}
					>
						Próxima →
					</Button>
				)}
			</div>
		</div>
	);
};

export default Pagination;
