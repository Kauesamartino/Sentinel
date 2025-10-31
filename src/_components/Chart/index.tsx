import React from 'react';
import styles from './Chart.module.scss';

export interface ChartData {
  label: string;
  value: number;
}

interface ChartProps {
  data: ChartData[];
  title: string;
  type?: 'bar' | 'pie' | 'line';
  color?: string;
}

const Chart: React.FC<ChartProps> = ({ 
  data, 
  title, 
  type = 'bar',
  color = '#3b82f6'
}) => {
  const maxValue = Math.max(...data.map(d => d.value), 1);
  const totalValue = data.reduce((sum, d) => sum + d.value, 0);

  // Função para obter cores baseadas no tipo de dado
  const getBarColor = (label: string, index: number) => {
    if (color === 'status') {
      const statusColors: { [key: string]: string } = {
        'ABERTO': '#f59e0b', // Laranja - aguardando ação
        'EM_ANDAMENTO': '#3b82f6', // Azul - em progresso
        'RESOLVIDO': '#10b981', // Verde - concluído com sucesso
        'FECHADO': '#6b7280', // Cinza - arquivado/finalizado
      };
      return statusColors[label] || statusColors[label.toUpperCase()] || '#6366f1';
    }
    
    if (color === 'severidade') {
      const severidadeColors: { [key: string]: string } = {
        'BAIXA': '#06d6a0', // Verde teal vibrante
        'MEDIA': '#ffd23f', // Amarelo dourado
        'ALTA': '#f72585', // Rosa magenta
        'CRITICA': '#8b0000', // Vermelho escarlate
      };
      return severidadeColors[label] || severidadeColors[label.toUpperCase()] || '#dc2626';
    }
    
    return typeof color === 'string' ? color : '#3b82f6';
  };

  // Função para formatar labels
  const formatLabel = (label: string) => {
    if (color === 'status') {
      const statusLabels: { [key: string]: string } = {
        'ABERTO': 'Aberto',
        'EM_ANDAMENTO': 'Em And.',
        'RESOLVIDO': 'Resolvido',
        'FECHADO': 'Fechado',
      };
      return statusLabels[label] || statusLabels[label.toUpperCase()] || label;
    }
    
    if (color === 'severidade') {
      const severidadeLabels: { [key: string]: string } = {
        'BAIXA': 'Baixa',
        'MEDIA': 'Média',
        'ALTA': 'Alta',
        'CRITICA': 'Crítica',
      };
      return severidadeLabels[label] || severidadeLabels[label.toUpperCase()] || label;
    }
    
    return label;
  };

  if (type === 'line') {
    return (
      <div className={styles.chartContainer}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.lineChart}>
          <svg className={styles.lineSvg} viewBox="0 0 800 400" preserveAspectRatio="xMidYMid meet">
            {/* Grid lines */}
            {[0, 1, 2, 3, 4, 5].map(i => (
              <line
                key={`grid-${i}`}
                x1="80"
                y1={60 + (i * 50)}
                x2="720"
                y2={60 + (i * 50)}
                stroke="#e5e7eb"
                strokeWidth="1"
              />
            ))}
            
            {/* Y-axis labels */}
            {[0, 1, 2, 3, 4, 5].map(i => {
              const value = Math.round(maxValue - (i * maxValue / 5));
              return (
                <text
                  key={`y-label-${i}`}
                  x="70"
                  y={65 + (i * 50)}
                  fontSize="14"
                  fill="#6b7280"
                  textAnchor="end"
                >
                  {value}
                </text>
              );
            })}

            {/* Line path */}
            {data.length > 1 && (
              <path
                d={data.map((item, index) => {
                  const x = 80 + (index * (640 / (data.length - 1)));
                  const y = 310 - ((item.value / maxValue) * 250);
                  return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
                }).join(' ')}
                stroke={color}
                strokeWidth="3"
                fill="none"
              />
            )}

            {/* Data points */}
            {data.map((item, index) => {
              const x = 80 + (index * (640 / Math.max(data.length - 1, 1)));
              const y = 310 - ((item.value / maxValue) * 250);
              return (
                <g key={index}>
                  <circle
                    cx={x}
                    cy={y}
                    r="6"
                    fill={color}
                    stroke="#fff"
                    strokeWidth="2"
                  />
                  <text
                    x={x}
                    y={y - 15}
                    fontSize="12"
                    fill={color}
                    textAnchor="middle"
                    fontWeight="600"
                  >
                    {item.value}
                  </text>
                </g>
              );
            })}

            {/* X-axis labels */}
            {data.map((item, index) => {
              const x = 80 + (index * (640 / Math.max(data.length - 1, 1)));
              return (
                <text
                  key={`x-label-${index}`}
                  x={x}
                  y={340}
                  fontSize="12"
                  fill="#6b7280"
                  textAnchor="middle"
                  transform={`rotate(-45 ${x} 340)`}
                >
                  {item.label}
                </text>
              );
            })}
          </svg>
        </div>
      </div>
    );
  }

  if (type === 'pie') {
    return (
      <div className={styles.chartContainer}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.pieChart}>
          {data.map((item, index) => {
            const percentage = totalValue > 0 ? (item.value / totalValue) * 100 : 0;
            return (
              <div key={item.label} className={styles.pieItem}>
                <div 
                  className={styles.pieBar}
                  style={{ 
                    width: `${percentage}%`,
                    backgroundColor: `hsl(${(index * 60) % 360}, 70%, 50%)`
                  }}
                />
                <div className={styles.pieLabel}>
                  <span className={styles.labelText}>{item.label}</span>
                  <span className={styles.labelValue}>
                    {item.value} ({percentage.toFixed(1)}%)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.chartContainer}>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.barChart}>
        {data.map((item, index) => {
          const height = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
          const displayHeight = Math.max(height, item.value === 0 ? 2 : height); // Altura mínima de 2% para barras vazias
          const barColor = getBarColor(item.label, index);
          const barOpacity = item.value === 0 ? 0.3 : 1; // Transparência para barras vazias
          
          return (
            <div key={item.label} className={styles.barItem}>
              <div className={styles.barContainer}>
                <div 
                  className={styles.bar}
                  style={{ 
                    height: `${displayHeight}%`,
                    backgroundColor: barColor,
                    opacity: barOpacity
                  }}
                />
                <div 
                  className={`${styles.barTooltip} ${
                    data.length <= 2 ? (index === 1 ? styles.tooltipLeft : '') :
                    data.length <= 4 ? (index >= 2 ? styles.tooltipLeft : '') :
                    (index >= Math.ceil(data.length / 2) ? styles.tooltipLeft : '')
                  }`}
                  style={{
                    bottom: `${Math.max(height > 0 ? height * 0.5 : 10, 20)}%`
                  }}
                >
                  <div className={styles.tooltipContent}>
                    <div className={styles.tooltipHeader}>
                      <div 
                        className={styles.tooltipIndicator}
                        style={{ backgroundColor: barColor }}
                      />
                      <span className={styles.tooltipTitle}>{formatLabel(item.label)}</span>
                    </div>
                    <div className={styles.tooltipBody}>
                      <span className={styles.tooltipValue}>{item.value}</span>
                      <span className={styles.tooltipLabel}>
                        {item.value === 1 ? 'ocorrência' : 'ocorrências'}
                      </span>
                    </div>
                    <div className={styles.tooltipArrow}></div>
                  </div>
                </div>
              </div>
              <span className={styles.barLabel}>{formatLabel(item.label)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Chart;