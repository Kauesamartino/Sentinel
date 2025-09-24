"use client";

import React from "react";
import styles from "./curadoria.module.scss";
import { CuradoriaTable, CuradoriaViewModal, Pagination } from "@/_components/Curadoria";
import ConfirmActionModal from "@/_components/Curadoria/ConfirmActionModal";
import { useCuradoria } from "@/hooks/useCuradoria";

const rows = [
	{ label: "id", styles: styles.idcell },
	{ label: "Titulo", styles: styles.namecell },
	{ label: "Tipo de Ocorrência", styles: styles.areacell },
	{ label: "Data", styles: styles.datetimecell },
	{ label: "Status", styles: styles.statuscell },
	{ label: "", styles: styles.actionsCell },
];

function formatDate(value: string): string {
	if (!value) return "";
	const d = new Date(value);
	if (Number.isNaN(d.getTime())) return value;
	return new Intl.DateTimeFormat("pt-BR", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	}).format(d);
}

const CuradoriaPage = () => {
			const {
				curadorias,
				loading,
				error,
				page,
				setPage,
				totalPages,
				viewOpen,
				setViewOpen,
				viewData,
				handleView,
				aprovarCuradoria,
				desaprovarCuradoria,
			} = useCuradoria();

			const [confirmModalOpen, setConfirmModalOpen] = React.useState(false);
			const [confirmAction, setConfirmAction] = React.useState<"aprovar" | "desaprovar" | null>(null);
			const [selectedId, setSelectedId] = React.useState<number | null>(null);
			const [actionLoading, setActionLoading] = React.useState(false);

			function handleConfirm(action: "aprovar" | "desaprovar", id: number) {
				setConfirmAction(action);
				setSelectedId(id);
				setConfirmModalOpen(true);
			}

			async function handleActionConfirm() {
				if (!selectedId || !confirmAction) return;
				setActionLoading(true);
				if (confirmAction === "aprovar") {
					await aprovarCuradoria(selectedId);
				} else {
					await desaprovarCuradoria(selectedId);
				}
				setActionLoading(false);
				setConfirmModalOpen(false);
				setSelectedId(null);
				setConfirmAction(null);
			}



	return (
			<main className={styles.main}>
				<div className={styles.container}>
					<div className={styles.header}>
						<h1 className={styles.title}>Curadoria</h1>
					</div>
					{error && <div className={styles.errorMessage}>{error}</div>}
					<CuradoriaTable
						curadorias={curadorias}
						loading={loading}
						rows={rows}
						formatDate={formatDate}
						onView={handleView}
						onAprovar={(id: number) => handleConfirm("aprovar", id)}
						onDesaprovar={(id: number) => handleConfirm("desaprovar", id)}
					/>
					<Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
				</div>
				<CuradoriaViewModal
					open={viewOpen}
					onClose={() => setViewOpen(false)}
					viewData={viewData}
					formatDate={formatDate}
				/>
						{/* Modal de confirmação de ação */}
						{confirmAction && (
							<ConfirmActionModal
								open={confirmModalOpen}
								action={confirmAction}
								onConfirm={handleActionConfirm}
								onCancel={() => setConfirmModalOpen(false)}
								loading={actionLoading}
							/>
						)}
			</main>
	);
};

export default CuradoriaPage;
