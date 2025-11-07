"use client";

import React, { useState } from "react";
import styles from "./curadoria.module.scss";
import { CuradoriaTable, CuradoriaViewModal, Pagination } from "@/_components/Curadoria";
import ConfirmActionModal from "@/_components/Curadoria/ConfirmActionModal";
import EvidenceModal from "@/_components/Ocorrencias/EvidenceModal";
import LLMResultModal from "@/_components/Curadoria/LLMResultModal";
import { useCuradoria } from "@/hooks/useCuradoria";
import { useLLMAnalysis } from "@/hooks/useLLMAnalysis";
import { toast } from "react-toastify";

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
        totalPages,
        totalElements,
        pageSize,
        currentPage,
        prev,
        next,
        goToPrevious,
        goToNext,
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
    
    // Estado para modal de evidências
    const [evidenceModalOpen, setEvidenceModalOpen] = useState(false);
    const [selectedOccurrenceId, setSelectedOccurrenceId] = useState<number | null>(null);
    
    // Estado LLM
    const { startAnalysis, isAnalyzing, getAnalysisState } = useLLMAnalysis();
    const [llmResultModalOpen, setLlmResultModalOpen] = useState(false);
    const [selectedLLMResult, setSelectedLLMResult] = useState<any>(null);
    const [selectedLLMOccurrenceId, setSelectedLLMOccurrenceId] = useState<number | null>(null);

    function handleConfirm(action: "aprovar" | "desaprovar", id: number) {
        setConfirmAction(action);
        setSelectedId(id);
        setConfirmModalOpen(true);
    }

    const handleViewEvidence = (id: number) => {
        console.log('handleViewEvidence chamado com ID (curadoria):', id);
        setSelectedOccurrenceId(id);
        setEvidenceModalOpen(true);
        console.log('Estado do modal definido para true (curadoria)');
    };

    const handleAnalyzeLLM = async (id: number) => {
        try {
            toast.info('Iniciando análise com LLM...', {
                position: 'top-right',
                autoClose: 3000
            });
            
            const result = await startAnalysis(id);
            
            if (result) {
                setSelectedLLMResult(result);
                setSelectedLLMOccurrenceId(id);
                setLlmResultModalOpen(true);
                
                toast.success('Análise LLM concluída!', {
                    position: 'top-right',
                    autoClose: 3000
                });
            }
        } catch (error) {
            console.error('Erro na análise LLM:', error);
            toast.error(`Erro na análise LLM: ${error instanceof Error ? error.message : 'Erro desconhecido'}`, {
                position: 'top-right',
                autoClose: 5000
            });
        }
    };

    async function handleActionConfirm() {
        if (!selectedId || !confirmAction) return;
        setActionLoading(true);
        try {
            if (confirmAction === "aprovar") {
                await aprovarCuradoria(selectedId);
            } else {
                await desaprovarCuradoria(selectedId);
            }
        } catch {
            toast.error("Erro ao aprovar");
        } finally {
            setActionLoading(false);
            setConfirmModalOpen(false);
            setSelectedId(null);
            setConfirmAction(null);
        }
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
                    onViewEvidence={handleViewEvidence}
                    onAprovar={(id: number) => handleConfirm("aprovar", id)}
                    onDesaprovar={(id: number) => handleConfirm("desaprovar", id)}
                    onAnalyzeLLM={handleAnalyzeLLM}
                    isAnalyzingLLM={isAnalyzing}
                />
                <Pagination 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalElements={totalElements}
                    pageSize={pageSize}
                    prev={prev}
                    next={next}
                    onPrevious={goToPrevious}
                    onNext={goToNext}
                />
                <CuradoriaViewModal
                    open={viewOpen}
                    onClose={() => setViewOpen(false)}
                    viewData={
                        viewData
                            ? {
                                ...viewData,
                                descricao: (viewData as unknown as { descricao?: string }).descricao ?? "",
                                severidade: (viewData as unknown as { severidade?: string }).severidade ?? "",
                            }
                            : null
                    }
                    formatDate={formatDate}
                />
                {confirmAction && (
                    <ConfirmActionModal
                        open={confirmModalOpen}
                        action={confirmAction}
                        onConfirm={handleActionConfirm}
                        onCancel={() => setConfirmModalOpen(false)}
                        loading={actionLoading}
                    />
                )}
                <EvidenceModal
                    open={evidenceModalOpen}
                    onClose={() => setEvidenceModalOpen(false)}
                    occurrenceId={selectedOccurrenceId || 0}
                />
                {selectedLLMResult && selectedLLMOccurrenceId && (
                    <LLMResultModal
                        isOpen={llmResultModalOpen}
                        onClose={() => {
                            setLlmResultModalOpen(false);
                            setSelectedLLMResult(null);
                            setSelectedLLMOccurrenceId(null);
                        }}
                        result={selectedLLMResult}
                        occurrenceId={selectedLLMOccurrenceId}
                    />
                )}
            </div>
        </main>
    );
};

export default CuradoriaPage;
