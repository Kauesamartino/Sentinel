import React, { useState } from 'react';
import styles from './CustomDateModal.module.scss';

interface CustomDateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (startDate: Date, endDate: Date) => void;
  initialStartDate?: Date;
  initialEndDate?: Date;
}

const CustomDateModal: React.FC<CustomDateModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  initialStartDate,
  initialEndDate
}) => {
  // Função para converter Date para string local (YYYY-MM-DD)
  const formatDateForInput = (date?: Date) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [startDate, setStartDate] = useState<string>(
    formatDateForInput(initialStartDate)
  );
  const [endDate, setEndDate] = useState<string>(
    formatDateForInput(initialEndDate)
  );

  const handleConfirm = () => {
    if (startDate && endDate) {
      // Criar datas locais usando os componentes individuais para evitar problemas de timezone
      const [startYear, startMonth, startDay] = startDate.split('-').map(Number);
      const [endYear, endMonth, endDay] = endDate.split('-').map(Number);
      
      const start = new Date(startYear, startMonth - 1, startDay, 0, 0, 0, 0);
      const end = new Date(endYear, endMonth - 1, endDay, 23, 59, 59, 999);
      
      console.log('Modal - Datas selecionadas:', {
        startInput: startDate,
        endInput: endDate,
        startDate: start,
        endDate: end,
        startISO: start.toISOString(),
        endISO: end.toISOString()
      });
      
      if (start <= end) {
        onConfirm(start, end);
        onClose();
      }
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={handleBackdropClick}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Selecionar Período Personalizado</h2>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.dateGroup}>
            <label className={styles.dateLabel}>
              Data Inicial
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={styles.dateInput}
              />
            </label>
          </div>

          <div className={styles.dateGroup}>
            <label className={styles.dateLabel}>
              Data Final
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
                className={styles.dateInput}
              />
            </label>
          </div>

          {startDate && endDate && (() => {
            const [startYear, startMonth, startDay] = startDate.split('-').map(Number);
            const [endYear, endMonth, endDay] = endDate.split('-').map(Number);
            const start = new Date(startYear, startMonth - 1, startDay);
            const end = new Date(endYear, endMonth - 1, endDay);
            return start > end;
          })() && (
            <div className={styles.errorMessage}>
              A data inicial deve ser anterior à data final
            </div>
          )}
        </div>

        <div className={styles.modalFooter}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            type="button"
            className={styles.confirmButton}
            onClick={handleConfirm}
            disabled={!startDate || !endDate || (() => {
              const [startYear, startMonth, startDay] = startDate.split('-').map(Number);
              const [endYear, endMonth, endDay] = endDate.split('-').map(Number);
              const start = new Date(startYear, startMonth - 1, startDay);
              const end = new Date(endYear, endMonth - 1, endDay);
              return start > end;
            })()}
          >
            Aplicar Filtro
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomDateModal;