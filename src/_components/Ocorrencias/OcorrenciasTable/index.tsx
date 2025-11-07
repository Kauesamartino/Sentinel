
import React from 'react';
import Button from '@/_components/Button';
import styles from './OcorrenciasTable.module.scss';
import { formatEnumValue } from '../../../utils/formatEnumValue';

export type Ocorrencia = {
	id: number;
	title: string;
	description?: string;
	category: string;
	date: string;
	status: string;
	grau: string;
	evidence: string;
};

interface OcorrenciasTableProps {
	ocorrencias: Ocorrencia[];
	loading: boolean;
	rows: { label: string; styles?: string }[];
	onView: (id: number) => void;
	onEdit: (id: number) => void;
	onViewEvidence: (id: number) => void;
	formatDate?: (value: string) => string;
}

const OcorrenciasTable: React.FC<OcorrenciasTableProps> = ({
	ocorrencias,
	loading,
	rows,
	onView,
	onEdit,
	onViewEvidence,
	formatDate,
}) => {
	// Função para obter a classe CSS baseada no grau
	const getGrauClass = (grau: string): string => {
		const grauLower = grau.toLowerCase();
		switch (grauLower) {
			case 'baixa':
				return styles.baixa;
			case 'media':
			case 'média':
				return styles.media;
			case 'alta':
				return styles.alta;
			case 'critica':
			case 'crítica':
				return styles.critica;
			default:
				return styles.baixa; // fallback para baixa
		}
	};
	return (
		<div className={styles.tableScrollContainer}>
			<table className={styles.table}>
				<thead className={styles.thead}>
					<tr className={styles.tr}>
						{rows.map((row, index) => (
							<th key={index} className={`${styles.headerrows} ${row.styles ? row.styles : ''} ${row.label === 'id' ? styles.idcell : ''} ${row.label === 'Grau' ? styles.idcell : ''}`}>
								{row.label}
							</th>
						))}
					</tr>
				</thead>
				<tbody className={styles.tbody}>
					{loading ? (
						<tr className={styles.tr}>
							<td colSpan={rows.length} className={styles.loadingMessage}>
								Carregando...
							</td>
						</tr>
					) : (
						ocorrencias.map((ocorrencia, index) => (
							<tr className={styles.tr} key={index}>
								<td className={`${styles.cell} ${styles.idcell}`}>{ocorrencia.id}</td>
								<td className={styles.cell}>{ocorrencia.title}</td>
								<td className={styles.cell}>{formatEnumValue(ocorrencia.category)}</td>
								<td className={styles.cell}>{formatDate ? formatDate(ocorrencia.date) : ocorrencia.date}</td>
								<td className={styles.cell}>{formatEnumValue(ocorrencia.status)}</td>
								<td className={`${styles.cell} ${styles.grauTdCell}`}>
									<p className={`${styles.grauCell} ${getGrauClass(ocorrencia.grau)}`}>
										{formatEnumValue(ocorrencia.grau)}
									</p>
								</td>
								<td className={styles.cell}>
									<div className={styles.actions}>
										{/* Botão para abrir modal de evidências */}
										<Button
											onClick={() => {
												console.log('Botão Ver evidência clicado para ID:', ocorrencia.id);
												onViewEvidence(ocorrencia.id);
											}}
											variant="transparent"
											size="small"
											className={styles.evidenceButton}
										>
											Ver evidência
										</Button>
										<Button
											onClick={() => onView(ocorrencia.id)}
											variant="transparent"
											size="small"
										>
											Detalhes
										</Button>
										<Button
											onClick={() => onEdit(ocorrencia.id)}
											variant="transparent"
											size="small"
										>
											Editar
										</Button>
									</div>
								</td>
							</tr>
						))
					)}
				</tbody>
			</table>
		</div>
	);
};

export default OcorrenciasTable;
