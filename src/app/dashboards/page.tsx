"use client";

import React, { useCallback } from 'react';
import styles from './dashboards.module.scss';
import { useDashboard } from '@/hooks/useDashboard';
import ChartWithFilter from '@/_components/ChartWithFilter';
import TimeFilterComponent from '@/_components/TimeFilter';
import StatisticsPanel from '@/_components/StatisticsPanel';
import { TimeFilter } from '@/services/dashboardService';

const DashboardPage: React.FC = () => {
  const {
    data,
    loading,
    error,
    globalTimeFilter,
    customStartDate,
    customEndDate,
    handleGlobalTimeFilterChange,
    refreshData
  } = useDashboard();

  // Memoizar a função de callback para evitar re-renders
  const handleFilterChange = useCallback((filter: TimeFilter, startDate?: Date, endDate?: Date) => {
    handleGlobalTimeFilterChange(filter, startDate, endDate);
  }, [handleGlobalTimeFilterChange]);

  return (
    <main className={styles.dashboardMain}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>Dashboards</h1>
            <p className={styles.subtitle}>
              Visualização e análise de ocorrências do sistema Sentinel
            </p>
          </div>
          <div className={styles.filterSection}>
            <TimeFilterComponent 
              currentFilter={globalTimeFilter}
              onFilterChange={handleFilterChange}
              compact={false}
              customStartDate={customStartDate}
              customEndDate={customEndDate}
            />
          </div>
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

        {/* Painel de Estatísticas */}
        <StatisticsPanel
          totalOcorrencias={data.statistics.totalOcorrencias}
          totalResolvidas={data.statistics.totalResolvidas}
          totalEmAndamento={data.statistics.totalEmAndamento}
          totalAbertas={data.statistics.totalAbertas}
          loading={loading}
        />

        {loading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.loading}>Carregando dados do dashboard...</div>
          </div>
        ) : (
          <div className={styles.chartsContainer}>
            
            {/* Gráfico de Ocorrências por Severidade */}
            <ChartWithFilter
              data={data.ocorrenciasPorSeveridade}
              title="Ocorrências por Severidade"
              type="bar"
              color="severidade"
            />

            {/* Gráfico de Ocorrências por Status */}
            <ChartWithFilter
              data={data.ocorrenciasPorStatus}
              title="Ocorrências por Status"
              type="pizza"
              color="status"
            />
            
            {/* Gráfico de Ocorrências por Tempo */}
            <ChartWithFilter
              data={data.ocorrenciasPorTempo}
              title="Evolução de Ocorrências no Tempo"
              type="line"
              color="#3b82f6"
            />

            {/* Gráfico de Ocorrências por Tipo */}
            <ChartWithFilter
              data={data.ocorrenciasPorTipo}
              title="Ocorrências por Tipo"
              type="pie"
              tall={true}
            />
          </div>
        )}
      </div>
    </main>
  );
};

export default DashboardPage;