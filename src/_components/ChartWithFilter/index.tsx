import React from 'react';
import Chart from '@/_components/Chart';
import TimeFilterComponent from '@/_components/TimeFilter';
import { TimeFilter } from '@/services/dashboardService';
import styles from './ChartWithFilter.module.scss';

export interface ChartData {
  label: string;
  value: number;
}

interface ChartWithFilterProps {
  data: ChartData[];
  title: string;
  type?: 'bar' | 'pie' | 'line';
  color?: string;
  currentFilter: TimeFilter;
  onFilterChange: (filter: TimeFilter) => void;
}

const ChartWithFilter: React.FC<ChartWithFilterProps> = ({ 
  data, 
  title, 
  type = 'bar',
  color = '#3b82f6',
  currentFilter,
  onFilterChange
}) => {
  return (
    <div className={styles.chartWithFilterContainer}>
      <h2 className={styles.chartMainTitle}>{title}</h2>
      <TimeFilterComponent 
        currentFilter={currentFilter}
        onFilterChange={onFilterChange}
        compact={false}
      />
      <Chart
        data={data}
        title=""
        type={type}
        color={color}
      />
    </div>
  );
};

export default ChartWithFilter;