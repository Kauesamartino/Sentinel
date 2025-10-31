import React from 'react';
import styles from './TimeFilter.module.scss';
import { TimeFilter } from '@/services/dashboardService';

interface TimeFilterProps {
  currentFilter: TimeFilter;
  onFilterChange: (filter: TimeFilter) => void;
  compact?: boolean;
}

const timeFilterOptions = [
  { value: '1h' as TimeFilter, label: '1 Hora' },
  { value: '1d' as TimeFilter, label: '1 Dia' },
  { value: '7d' as TimeFilter, label: '7 Dias' },
  { value: '30d' as TimeFilter, label: '30 Dias' },
  { value: '90d' as TimeFilter, label: '90 Dias' },
];

const TimeFilterComponent: React.FC<TimeFilterProps> = ({ 
  currentFilter, 
  onFilterChange,
  compact = false 
}) => {
  return (
    <div className={`${styles.filterContainer} ${compact ? styles.compact : ''}`}>
      {!compact && <span className={styles.filterLabel}>Período:</span>}
      <div className={styles.filterButtons}>
        {timeFilterOptions.map((option) => (
          <button
            key={option.value}
            className={`${styles.filterButton} ${
              currentFilter === option.value ? styles.active : ''
            }`}
            onClick={() => onFilterChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TimeFilterComponent;