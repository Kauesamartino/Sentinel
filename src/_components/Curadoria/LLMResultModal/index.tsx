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
  const getWarningCards = () => {
    const cards = [];

    // Adicionar card de vendedor apenas se detectado
    if (result.seller) {
      cards.push({
        key: 'seller',
        icon: <FaExclamationTriangle className={styles.warningIcon} />,
        title: 'Detecção de Vendedor',
        text: 'Possível vendedor detectado',
        className: styles.warning
      });
    }

    // Adicionar card de itens perigosos apenas se detectado
    if (result.dangerousItems) {
      cards.push({
        key: 'dangerous',
        icon: <FaTimesCircle className={styles.dangerIcon} />,
        title: 'Itens Perigosos',
        text: 'Itens perigosos identificados',
        className: styles.danger
      });
    }

    // Se nenhum problema foi detectado, mostrar card de sucesso
    if (cards.length === 0) {
      cards.push({
        key: 'success',
        icon: <FaCheckCircle className={styles.successIcon} />,
        title: 'Análise Concluída',
        text: 'Nenhum problema detectado pela IA',
        className: styles.success
      });
    }

    return cards;
  };

  const warningCards = getWarningCards();

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
                {warningCards.map((card) => (
                  <div key={card.key} className={`${styles.statusCard} ${card.className}`}>
                    <div className={styles.statusHeader}>
                      {card.icon}
                      <span className={styles.statusTitle}>{card.title}</span>
                    </div>
                    <p className={styles.statusText}>{card.text}</p>
                  </div>
                ))}
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