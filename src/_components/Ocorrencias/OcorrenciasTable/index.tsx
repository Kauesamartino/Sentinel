
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
	formatDate?: (value: string) => string;
}

const OcorrenciasTable: React.FC<OcorrenciasTableProps> = ({
	ocorrencias,
	loading,
	rows,
	onView,
	onEdit,
	formatDate,
}) => {
	return (
		<div className={styles.tableScrollContainer}>
			<table className={styles.table}>
				<thead className={styles.thead}>
					<tr className={styles.tr}>
						{rows.map((row, index) => (
							<th key={index} className={`${styles.headerrows} ${row.styles ? row.styles : ''} ${row.label === 'id' ? styles.idcell : ''}`}>
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
								<td className={styles.cell}>{formatEnumValue(ocorrencia.grau)}</td>
								<td className={styles.cell}>
									<div className={styles.actions}>
										{/* Campo Evidência como link clicável */}
										{ocorrencia.evidence ? (
											<a
												href={ocorrencia.evidence}
												target="_blank"
												rel="noopener noreferrer"
												className={styles.evidenceLink}
											>
												Ver evidência
											</a>
										) : (
											<span className={styles.noEvidence}>Sem evidência</span>
										)}
										<Button
											onClick={() => onView(ocorrencia.id)}
											variant="transparent"
											size="small"
										>
											Ver
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
