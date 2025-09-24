
import React from "react";
import styles from "./CuradoriaTable.module.scss";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import tableStyles from "./CuradoriaTable.module.scss";
import Button from "@/_components/Button";

interface Curadoria {
    id: number;
    titulo: string;
    tipoOcorrencia: string;
    data: string;
    status: string;
}

interface Row {
    label: string;
    styles: string;
}

interface CuradoriaTableProps {
    curadorias: Curadoria[];
    loading: boolean;
    rows: Row[];
    onView: (id: number) => void;
    onAprovar: (id: number) => void;
    formatDate: (date: string) => string;
    onDesaprovar: (id: number) => void;
}

const CuradoriaTable: React.FC<CuradoriaTableProps> = ({
    curadorias,
    loading,
    rows,
    onView,
    onAprovar,
    formatDate,
    onDesaprovar,
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
                    ) : curadorias.length === 0 ? (
                        <tr className={styles.tr}>
                            <td colSpan={rows.length} className={styles.loadingMessage}>
                                Nenhuma curadoria encontrada.
                            </td>
                        </tr>
                    ) : (
                        curadorias.map((curadoria, index) => (
                            <tr className={styles.tr} key={index}>
                                <td className={`${styles.cell} ${styles.idcell}`}>{curadoria.id}</td>
                                <td className={styles.cell}>{curadoria.titulo}</td>
                                <td className={styles.cell}>{curadoria.tipoOcorrencia}</td>
                                <td className={styles.cell}>{formatDate(curadoria.data)}</td>
                                <td className={styles.cell}>{curadoria.status}</td>
                                <td className={styles.cell}>
                                    <div className={styles.evidenceActions}>
                                        <Button
                                            onClick={() => onView(curadoria.id)}
                                            variant="transparent"
                                            size="small"
                                        >
                                            Ver
                                        </Button>
                                        <div className={styles.separator}>
                                            <Button
                                                onClick={() => onAprovar(curadoria.id)}
                                                variant="transparent"
                                                size="small"
                                                className={tableStyles.approveButton}
                                            >
                                                <FaCheckCircle style={{ fontSize: '18px', verticalAlign: 'middle' }} />
                                                Aprovar 
                                            </Button>
                                            <Button
                                                onClick={() => onDesaprovar(curadoria.id)}
                                                variant="transparent"
                                                size="small"
                                                className={tableStyles.disapproveButton}
                                            >
                                                <FaTimesCircle style={{ fontSize: '18px', verticalAlign: 'middle' }} />
                                                Desaprovar
                                            </Button>
                                        </div>
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

export default CuradoriaTable;
