import React, { useState } from 'react';
import styles from './TimeFilter.module.scss';
import { TimeFilter } from '@/services/dashboardService';
import CustomDateModal from './CustomDateModal';

interface TimeFilterProps {
  currentFilter: TimeFilter;
  onFilterChange: (filter: TimeFilter, startDate?: Date, endDate?: Date) => void;
  compact?: boolean;
  customStartDate?: Date;
  customEndDate?: Date;
}

const timeFilterOptions = [
  { value: '1h' as TimeFilter, label: '1 Hora' },
  { value: '1d' as TimeFilter, label: '1 Dia' },
  { value: '7d' as TimeFilter, label: '7 Dias' },
  { value: '30d' as TimeFilter, label: '30 Dias' },
  { value: '90d' as TimeFilter, label: '90 Dias' },
  { value: 'all' as TimeFilter, label: 'Todas' },
  { value: 'custom' as TimeFilter, label: 'Personalizado' },
];

const TimeFilterComponent: React.FC<TimeFilterProps> = ({ 
  currentFilter, 
  onFilterChange,
  compact = false,
  customStartDate,
  customEndDate
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>, filter: TimeFilter) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (filter === 'custom') {
      setIsModalOpen(true);
    } else {
      onFilterChange(filter);
    }
  };

  const handleCustomDateConfirm = (startDate: Date, endDate: Date) => {
    onFilterChange('custom', startDate, endDate);
  };

  const getCustomButtonLabel = () => {
    if (currentFilter === 'custom' && customStartDate && customEndDate) {
      // Formatar datas manualmente para evitar problemas de timezone
      const formatLocalDate = (date: Date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        return `${day}/${month}`;
      };
      
      const startFormatted = formatLocalDate(customStartDate);
      const endFormatted = formatLocalDate(customEndDate);
      
      return `${startFormatted} - ${endFormatted}`;
    }
    return 'Personalizado';
  };

  return (
    <>
      <div className={`${styles.filterContainer} ${compact ? styles.compact : ''}`}>
        {!compact && <span className={styles.filterLabel}></span>}
        <div className={styles.filterButtons}>
          {timeFilterOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`${styles.filterButton} ${
                currentFilter === option.value ? styles.active : ''
              }`}
              onClick={(e) => handleFilterClick(e, option.value)}
            >
              {option.value === 'custom' ? getCustomButtonLabel() : option.label}
            </button>
          ))}
        </div>
      </div>

      <CustomDateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleCustomDateConfirm}
        initialStartDate={customStartDate}
        initialEndDate={customEndDate}
      />
    </>
  );
};

export default TimeFilterComponent;