"use client";

import React, { useCallback } from 'react';
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

  // Memoizar as funções de callback para evitar re-renders
  const handleTempoFilterChange = useCallback((filter: string) => {
    handleTimeFilterChange('tempo', filter as any);
  }, [handleTimeFilterChange]);

  const handleTipoFilterChange = useCallback((filter: string) => {
    handleTimeFilterChange('tipo', filter as any);
  }, [handleTimeFilterChange]);

  const handleStatusFilterChange = useCallback((filter: string) => {
    handleTimeFilterChange('status', filter as any);
  }, [handleTimeFilterChange]);

  const handleSeveridadeFilterChange = useCallback((filter: string) => {
    handleTimeFilterChange('severidade', filter as any);
  }, [handleTimeFilterChange]);

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
              onFilterChange={handleTempoFilterChange}
            />

            {/* Gráfico de Ocorrências por Tipo */}
            <ChartWithFilter
              data={data.ocorrenciasPorTipo}
              title="Ocorrências por Tipo"
              type="pie"
              currentFilter={timeFilters.tipo}
              onFilterChange={handleTipoFilterChange}
            />

            {/* Gráfico de Ocorrências por Status */}
            <ChartWithFilter
              data={data.ocorrenciasPorStatus}
              title="Ocorrências por Status"
              type="bar"
              color="status"
              currentFilter={timeFilters.status}
              onFilterChange={handleStatusFilterChange}
            />

            {/* Gráfico de Ocorrências por Severidade */}
            <ChartWithFilter
              data={data.ocorrenciasPorSeveridade}
              title="Ocorrências por Severidade"
              type="bar"
              color="severidade"
              currentFilter={timeFilters.severidade}
              onFilterChange={handleSeveridadeFilterChange}
            />
          </div>
        )}
      </div>
    </main>
  );
};

export default DashboardPage;