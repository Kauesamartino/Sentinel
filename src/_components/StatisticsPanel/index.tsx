import React from 'react';
import styles from './StatisticsPanel.module.scss';

interface StatisticsPanelProps {
  totalOcorrencias: number;
  totalResolvidas: number;
  totalEmAndamento: number;
  totalAbertas: number;
  loading?: boolean;
}

const StatisticsPanel: React.FC<StatisticsPanelProps> = ({
  totalOcorrencias,
  totalResolvidas,
  totalEmAndamento,
  totalAbertas,
  loading = false
}) => {
  const calculatePercentage = (value: number, total: number): number => {
    return total > 0 ? Math.round((value / total) * 100) : 0;
  };

  const statistics = [
    {
      label: 'Total de Ocorrências',
      value: totalOcorrencias,
      color: '#3b82f6',
      percentage: 100
    },
    {
      label: 'Resolvidas',
      value: totalResolvidas,
      color: '#10b981',
      percentage: calculatePercentage(totalResolvidas, totalOcorrencias)
    },
    {
      label: 'Em Andamento',
      value: totalEmAndamento,
      color: '#f59e0b',
      percentage: calculatePercentage(totalEmAndamento, totalOcorrencias)
    },
    {
      label: 'Abertas',
      value: totalAbertas,
      color: '#ef4444',
      percentage: calculatePercentage(totalAbertas, totalOcorrencias)
    }
  ];

  if (loading) {
    return (
      <div className={styles.panel}>
        <div className={styles.singleCard}>
          <div className={styles.skeleton}></div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.panel}>
      <div className={styles.singleCard}>
        
        <div className={styles.statisticsGrid}>
          {statistics.map((stat, index) => (
            <div key={index} className={styles.statItem}>
              <div className={styles.statHeader}>
                <span className={styles.statLabel}>{stat.label}</span>
                <span className={styles.statPercentage}>{stat.percentage}%</span>
              </div>
              
              <div className={styles.statValue} style={{ color: stat.color }}>
                {stat.value.toLocaleString('pt-BR')}
              </div>
              
              <div className={styles.statProgressBar}>
                <div 
                  className={styles.statProgress}
                  style={{ 
                    width: `${stat.percentage}%`,
                    backgroundColor: stat.color
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatisticsPanel;