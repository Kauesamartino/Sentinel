"use client";

import React from 'react';
import styles from './dashboards.module.scss';
import { useDashboard } from '@/hooks/useDashboard';
import ChartWithFilter from '@/_components/ChartWithFilter';

const DashboardPage: React.FC = () => {
  const {
    data,
    loading,
    error,
    timeFilters,
    handleTimeFilterChange,
    refreshData
  } = useDashboard();

  return (
    <main className={styles.dashboardMain}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Dashboards</h1>
          <p className={styles.subtitle}>
            Visualização e análise de ocorrências do sistema Sentinel
          </p>
        </div>

        {error && (
          <div className={styles.errorContainer}>
            <p className={styles.error}>
              Erro ao carregar dados: {error}
            </p>
            <button 
              className={styles.refreshButton}
              onClick={refreshData}
            >
              Tentar Novamente
            </button>
          </div>
        )}

        {loading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.loading}>Carregando dados do dashboard...</div>
          </div>
        ) : (
          <div className={styles.chartsContainer}>
            {/* Gráfico de Ocorrências por Tempo */}
            <ChartWithFilter
              data={data.ocorrenciasPorTempo}
              title="Evolução de Ocorrências no Tempo"
              type="line"
              color="#3b82f6"
              currentFilter={timeFilters.tempo}
              onFilterChange={(filter) => handleTimeFilterChange('tempo', filter)}
            />

            {/* Gráfico de Ocorrências por Tipo */}
            <ChartWithFilter
              data={data.ocorrenciasPorTipo}
              title="Ocorrências por Tipo"
              type="pie"
              currentFilter={timeFilters.tipo}
              onFilterChange={(filter) => handleTimeFilterChange('tipo', filter)}
            />

            {/* Gráfico de Ocorrências por Status */}
            <ChartWithFilter
              data={data.ocorrenciasPorStatus}
              title="Ocorrências por Status"
              type="bar"
              color="status"
              currentFilter={timeFilters.status}
              onFilterChange={(filter) => handleTimeFilterChange('status', filter)}
            />

            {/* Gráfico de Ocorrências por Severidade */}
            <ChartWithFilter
              data={data.ocorrenciasPorSeveridade}
              title="Ocorrências por Severidade"
              type="bar"
              color="severidade"
              currentFilter={timeFilters.severidade}
              onFilterChange={(filter) => handleTimeFilterChange('severidade', filter)}
            />
          </div>
        )}
      </div>
    </main>
  );
};

export default DashboardPage;