
import React from 'react';
import Button from '@/_components/Button';
import styles from './OcorrenciasTable.module.scss';
import { formatEnumValue } from '../../../utils/formatEnumValue';

export type Ocorrencia = {
	id: number;
	description: string;
	category: string;
	date: string;
	status: string;
	grau: string;
	evidence: string;
};

interface OcorrenciasTableProps {
	ocorrencias: Ocorrencia[];
	loading: boolean;
	error: string | null;
	rows: { label: string; styles?: string }[];
	evidenciaLoading: { [id: number]: boolean };
	evidenciaLinks: { [id: number]: string };
	onGerarEvidencia: (id: number) => void;
	onView: (id: number) => void;
	onEdit: (id: number) => void;
}

const OcorrenciasTable: React.FC<OcorrenciasTableProps> = ({
	ocorrencias,
	loading,
	error,
	rows,
	evidenciaLoading,
	evidenciaLinks,
	onGerarEvidencia,
	onView,
	onEdit,
}) => {
	return (
		<div className={styles.tableScrollContainer}>
			<table className={styles.table}>
				<thead className={styles.thead}>
					<tr className={styles.tr}>
						{rows.map((row, index) => (
							<th key={index} className={`${styles.headerrows} ${row.styles ? row.styles : ''}`}>
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
								<td className={styles.cell}>{ocorrencia.description}</td>
								<td className={styles.cell}>{formatEnumValue(ocorrencia.category)}</td>
								<td className={styles.cell}>{ocorrencia.date}</td>
								<td className={styles.cell}>{formatEnumValue(ocorrencia.status)}</td>
								<td className={styles.cell}>{formatEnumValue(ocorrencia.grau)}</td>
								<td className={styles.cell}>
									<div className={styles.evidenceActions}>
										{ocorrencia.evidence && <span>{ocorrencia.evidence}</span>}
										<Button
											variant="transparent"
											size="small"
											onClick={() => onGerarEvidencia(ocorrencia.id)}
											disabled={evidenciaLoading[ocorrencia.id]}
										>
											{evidenciaLoading[ocorrencia.id] ? 'Gerando...' : 'Gerar evidência'}
										</Button>
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
									{evidenciaLinks[ocorrencia.id] && evidenciaLinks[ocorrencia.id].startsWith('http') && (
										<div>
											<a
												href={evidenciaLinks[ocorrencia.id]}
												target="_blank"
												rel="noopener noreferrer"
												className={styles.evidenceLink}
											>
												Ver evidência
											</a>
										</div>
									)}
									{evidenciaLinks[ocorrencia.id] && evidenciaLinks[ocorrencia.id].startsWith('Erro') && (
										<div className={styles.evidenceError}>{evidenciaLinks[ocorrencia.id]}</div>
									)}
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
