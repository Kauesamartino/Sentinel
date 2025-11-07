import React from 'react';
import { LLMAnalysisResult } from '@/services/llmService';
import Modal from '@/_components/Modal';
import styles from './LLMResultModal.module.scss';
import { FaCheckCircle, FaTimesCircle, FaExclamationTriangle } from 'react-icons/fa';

interface LLMResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: LLMAnalysisResult;
  occurrenceId: number;
  isLoading?: boolean;
}

const LLMResultModal: React.FC<LLMResultModalProps> = ({
  isOpen,
  onClose,
  result,
  occurrenceId,
  isLoading = false
}) => {
  const getSellerStatus = () => {
    if (result.seller) {
      return {
        icon: <FaExclamationTriangle className={styles.warningIcon} />,
        text: 'Possível vendedor detectado',
        className: styles.warning
      };
    }
    return {
      icon: <FaCheckCircle className={styles.successIcon} />,
      text: 'Nenhum vendedor detectado',
      className: styles.success
    };
  };

  const getDangerousItemsStatus = () => {
    if (result.dangerousItems) {
      return {
        icon: <FaTimesCircle className={styles.dangerIcon} />,
        text: 'Itens perigosos identificados',
        className: styles.danger
      };
    }
    return {
      icon: <FaCheckCircle className={styles.successIcon} />,
      text: 'Nenhum item perigoso detectado',
      className: styles.success
    };
  };

  const sellerStatus = getSellerStatus();
  const dangerousStatus = getDangerousItemsStatus();

  return (
    <Modal 
      open={isOpen} 
      onClose={onClose} 
      title={`Análise LLM - Ocorrência #${occurrenceId}`}
      width="800px"
    >
        <div className={styles.modalContent}>
          {isLoading ? (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Processando análise com IA...</p>
            </div>
          ) : (
            <>
              {/* Status Cards */}
              <div className={styles.statusGrid}>
                <div className={`${styles.statusCard} ${sellerStatus.className}`}>
                  <div className={styles.statusHeader}>
                    {sellerStatus.icon}
                    <span className={styles.statusTitle}>Detecção de Vendedor</span>
                  </div>
                  <p className={styles.statusText}>{sellerStatus.text}</p>
                </div>

                <div className={`${styles.statusCard} ${dangerousStatus.className}`}>
                  <div className={styles.statusHeader}>
                    {dangerousStatus.icon}
                    <span className={styles.statusTitle}>Itens Perigosos</span>
                  </div>
                  <p className={styles.statusText}>{dangerousStatus.text}</p>
                </div>
              </div>

              {/* Descrição */}
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Descrição da Análise</h3>
                <div className={styles.descriptionCard}>
                  <p className={styles.description}>
                    {result.description || 'Nenhuma descrição disponível.'}
                  </p>
                </div>
              </div>

              {/* Resumo (se disponível) */}
              {result.summary && (
                <div className={styles.section}>
                  <h3 className={styles.sectionTitle}>Resumo do Conteúdo</h3>
                  <div className={styles.summaryCard}>
                    <p className={styles.summary}>
                      {result.summary}
                    </p>
                  </div>
                </div>
              )}

              {/* Recomendações */}
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Recomendações</h3>
                <div className={styles.recommendationCard}>
                  {result.seller || result.dangerousItems ? (
                    <div className={styles.highPriority}>
                      <FaExclamationTriangle className={styles.warningIcon} />
                      <div>
                        <p className={styles.recommendationTitle}>Atenção Requerida</p>
                        <p className={styles.recommendationText}>
                          Esta ocorrência requer análise manual devido aos itens detectados pela IA.
                          Recomenda-se revisão detalhada antes de aprovação.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.lowPriority}>
                      <FaCheckCircle className={styles.successIcon} />
                      <div>
                        <p className={styles.recommendationTitle}>Baixo Risco</p>
                        <p className={styles.recommendationText}>
                          A análise da IA não detectou problemas significativos nesta ocorrência.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </Modal>
  );
};

export default LLMResultModal;