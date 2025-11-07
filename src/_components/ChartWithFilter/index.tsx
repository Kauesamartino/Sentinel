import React from 'react';
import Chart from '@/_components/Chart';
import styles from './ChartWithFilter.module.scss';

export interface ChartData {
  label: string;
  value: number;
}

interface ChartWithFilterProps {
  data: ChartData[];
  title: string;
  type?: 'bar' | 'pie' | 'line' | 'pizza';
  color?: string;
}

const ChartWithFilter: React.FC<ChartWithFilterProps> = ({ 
  data, 
  title, 
  type = 'bar',
  color = '#3b82f6'
}) => {
  return (
    <div className={styles.chartWithFilterContainer}>
      <h2 className={styles.chartMainTitle}>{title}</h2>
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