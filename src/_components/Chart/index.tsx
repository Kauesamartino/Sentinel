import React from 'react';
import styles from './Chart.module.scss';

export interface ChartData {
  label: string;
  value: number;
}

interface ChartProps {
  data: ChartData[];
  title: string;
  type?: 'bar' | 'pie' | 'line' | 'pizza';
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
  const getBarColor = (label: string) => {
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
      <div className={styles.lineChart}>
        <svg className={styles.lineSvg} viewBox="0 0 1000 400" preserveAspectRatio="xMidYMid meet">
            {/* Background gradient */}
            <defs>
              <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={color} stopOpacity="0.3"/>
                <stop offset="100%" stopColor={color} stopOpacity="0.05"/>
              </linearGradient>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={color}/>
                <stop offset="100%" stopColor={`${color}cc`}/>
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* Grid lines horizontais */}
            {[0, 1, 2, 3, 4, 5, 6].map(i => (
              <line
                key={`grid-h-${i}`}
                x1="50"
                y1={30 + (i * 50)}
                x2="950"
                y2={30 + (i * 50)}
                stroke="#f1f5f9"
                strokeWidth="1"
                strokeDasharray="2,4"
              />
            ))}

            {/* Grid lines verticais */}
            {data.map((_, index) => {
              const x = 50 + (index * (900 / Math.max(data.length - 1, 1)));
              return (
                <line
                  key={`grid-v-${index}`}
                  x1={x}
                  y1="30"
                  x2={x}
                  y2="330"
                  stroke="#f8fafc"
                  strokeWidth="1"
                  strokeDasharray="2,4"
                />
              );
            })}
            
            {/* Y-axis */}
            <line x1="50" y1="30" x2="50" y2="330" stroke="#cbd5e1" strokeWidth="2"/>
            
            {/* X-axis */}
            <line x1="50" y1="330" x2="950" y2="330" stroke="#cbd5e1" strokeWidth="2"/>
            
            {/* Y-axis labels */}
            {[0, 1, 2, 3, 4, 5, 6].map(i => {
              const value = Math.round(maxValue - (i * maxValue / 6));
              return (
                <text
                  key={`y-label-${i}`}
                  x="40"
                  y={35 + (i * 50)}
                  fontSize="14"
                  fill="#64748b"
                  textAnchor="end"
                  fontWeight="500"
                >
                  {value}
                </text>
              );
            })}

            {/* Area under the line */}
            {data.length > 1 && (
              <path
                d={[
                  `M 50 330`,
                  ...data.map((item, index) => {
                    const x = 50 + (index * (900 / (data.length - 1)));
                    const y = 330 - ((item.value / maxValue) * 300);
                    return `L ${x} ${y}`;
                  }),
                  `L ${50 + ((data.length - 1) * (900 / (data.length - 1)))} 330`,
                  'Z'
                ].join(' ')}
                fill="url(#areaGradient)"
              />
            )}

            {/* Main line */}
            {data.length > 1 && (
              <path
                d={data.map((item, index) => {
                  const x = 50 + (index * (900 / (data.length - 1)));
                  const y = 330 - ((item.value / maxValue) * 300);
                  return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
                }).join(' ')}
                stroke="url(#lineGradient)"
                strokeWidth="4"
                fill="none"
                filter="url(#glow)"
                className={styles.animatedLine}
              />
            )}

            {/* Data points */}
            {data.map((item, index) => {
              const x = 50 + (index * (900 / Math.max(data.length - 1, 1)));
              const y = 330 - ((item.value / maxValue) * 300);
              return (
                <g key={index} className={styles.dataPoint}>
                  {/* Outer ring */}
                  <circle
                    cx={x}
                    cy={y}
                    r="12"
                    fill={color}
                    fillOpacity="0.2"
                    className={styles.pulseRing}
                  />
                  {/* Main point */}
                  <circle
                    cx={x}
                    cy={y}
                    r="7"
                    fill={color}
                    stroke="#ffffff"
                    strokeWidth="3"
                    className={styles.dataPointCircle}
                  />
                  {/* Value label */}
                  <text
                    x={x}
                    y={y - 20}
                    fontSize="13"
                    fill={color}
                    textAnchor="middle"
                    fontWeight="700"
                    className={styles.valueLabel}
                  >
                    {item.value}
                  </text>
                </g>
              );
            })}

            {/* X-axis labels */}
            {data.map((item, index) => {
              const x = 50 + (index * (900 / Math.max(data.length - 1, 1)));
              return (
                <text
                  key={`x-label-${index}`}
                  x={x}
                  y={355}
                  fontSize="14"
                  fill="#64748b"
                  textAnchor="middle"
                  fontWeight="500"
                  transform={data.length > 4 ? `rotate(-35 ${x} 355)` : undefined}
                >
                  {item.label}
                </text>
              );
            })}

            {/* Chart title in SVG */}
            <text
              x="500"
              y="20"
              fontSize="16"
              fill="#1e293b"
              textAnchor="middle"
              fontWeight="600"
            >
              Tendência no Período
            </text>
          </svg>
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

  if (type === 'pizza') {
    const radius = 120;
    const centerX = 150;
    const centerY = 150;
    let cumulativeAngle = 0;

    return (
      <div className={styles.chartContainer}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.pizzaChart}>
          <svg 
            className={styles.pizzaSvg} 
            viewBox="0 0 300 300" 
            width="300" 
            height="300"
          >
            {/* Fatias da pizza */}
            {data.map((item, index) => {
              const percentage = totalValue > 0 ? (item.value / totalValue) * 100 : 0;
              const angle = (percentage / 100) * 360;
              
              // Coordenadas para desenhar o arco
              const startAngle = cumulativeAngle;
              const endAngle = cumulativeAngle + angle;
              
              const startX = centerX + radius * Math.cos((startAngle * Math.PI) / 180);
              const startY = centerY + radius * Math.sin((startAngle * Math.PI) / 180);
              const endX = centerX + radius * Math.cos((endAngle * Math.PI) / 180);
              const endY = centerY + radius * Math.sin((endAngle * Math.PI) / 180);
              
              const largeArcFlag = angle > 180 ? 1 : 0;
              
              const pathData = [
                `M ${centerX} ${centerY}`,
                `L ${startX} ${startY}`,
                `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`,
                'Z'
              ].join(' ');

              cumulativeAngle += angle;

              const sliceColor = getBarColor(item.label);

              // Posição para o tooltip (meio da fatia)
              const tooltipAngle = (startAngle + endAngle) / 2;
              const tooltipX = centerX + (radius * 0.7) * Math.cos((tooltipAngle * Math.PI) / 180);
              const tooltipY = centerY + (radius * 0.7) * Math.sin((tooltipAngle * Math.PI) / 180);

              return (
                <g key={item.label} className={styles.pizzaSlice} data-slice={item.label}>
                  <path
                    d={pathData}
                    fill={sliceColor}
                    className={styles.pizzaPath}
                  />
                  
                  {/* Tooltip da fatia */}
                  <g className={styles.pizzaTooltip}>
                    <rect
                      x={tooltipX - 35}
                      y={tooltipY - 25}
                      width="70"
                      height="50"
                      rx="8"
                      fill="rgba(0, 0, 0, 0.8)"
                      stroke="#fff"
                      strokeWidth="1"
                    />
                    <text
                      x={tooltipX}
                      y={tooltipY - 8}
                      fontSize="10"
                      fill="#fff"
                      textAnchor="middle"
                      fontWeight="600"
                    >
                      {formatLabel(item.label)}
                    </text>
                    <text
                      x={tooltipX}
                      y={tooltipY + 6}
                      fontSize="12"
                      fill="#fff"
                      textAnchor="middle"
                      fontWeight="700"
                    >
                      {item.value}
                    </text>
                    <text
                      x={tooltipX}
                      y={tooltipY + 18}
                      fontSize="8"
                      fill="#ccc"
                      textAnchor="middle"
                      fontWeight="500"
                    >
                      ({percentage.toFixed(1)}%)
                    </text>
                  </g>
                </g>
              );
            })}
          </svg>

          {/* Legenda da pizza */}
          <div className={styles.pizzaLegend}>
            {data.map((item, index) => {
              const percentage = totalValue > 0 ? (item.value / totalValue) * 100 : 0;
              const sliceColor = getBarColor(item.label);
              
              return (
                <div key={item.label} className={styles.pizzaLegendItem} data-legend={item.label}>
                  <div 
                    className={styles.pizzaLegendColor}
                    style={{ backgroundColor: sliceColor }}
                  />
                  <div className={styles.pizzaLegendText}>
                    <span className={styles.pizzaLegendLabel}>
                      {formatLabel(item.label)}
                    </span>
                    <span className={styles.pizzaLegendValue}>
                      {item.value} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
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
          const barColor = getBarColor(item.label);
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