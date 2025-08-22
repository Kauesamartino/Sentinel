import React from 'react';
import Modal from '@/_components/Modal';
import viewStyles from './OcorrenciaViewModal.module.scss';
import { formatEnumValue } from '../utils/formatEnumValue';

export type OcorrenciaDetalhe = {
	id: number;
	titulo: string;
	descricao: string;
	data: string;
	severidade: string;
	status: string;
	tipoOcorrencia: string;
	ativo?: boolean;
	dadosDetalhamentoEstacao?: {
		id: number;
		nome: string;
		linha?: string;
		dadosControle?: {
			id: number;
			nome: string;
		};
		endereco?: {
			logradouro: string;
			bairro: string;
			cep: string;
			numero: string;
			complemento: string;
			cidade: string;
			uf: string;
		};
	};
};

interface OcorrenciaViewModalProps {
	open: boolean;
	onClose: () => void;
	viewData: OcorrenciaDetalhe | null;
	formatDate: (value: string) => string;
}

const OcorrenciaViewModal: React.FC<OcorrenciaViewModalProps> = ({ open, onClose, viewData, formatDate }) => (
	<Modal open={open} title="Ocorrência" onClose={onClose} width={600}>
		{!viewData ? (
			<div>Carregando...</div>
		) : (
			<div className={viewStyles.viewContainer}>
				<div className={viewStyles.fields}>
				<div className={viewStyles.field}>
					<span className={viewStyles.label}>Título</span>
					<div className={viewStyles.value}>{viewData.titulo}</div>
				</div>
				<div className={viewStyles.field}>
					<span className={viewStyles.label}>Descrição</span>
					<div className={viewStyles.description}>{viewData.descricao || 'Sem descrição'}</div>
				</div>
				<div className={viewStyles.field}>
					<span className={viewStyles.label}>Data</span>
					<div className={viewStyles.value}>{formatDate(viewData.data)}</div>
				</div>
				<div className={viewStyles.field}>
					<span className={viewStyles.label}>Severidade</span>
					<div className={viewStyles.value}>{formatEnumValue(viewData.severidade)}</div>
				</div>
				<div className={viewStyles.field}>
					<span className={viewStyles.label}>Status</span>
					<div className={viewStyles.value}>{formatEnumValue(viewData.status)}</div>
				</div>
				<div className={viewStyles.field}>
					<span className={viewStyles.label}>Tipo</span>
					<div className={viewStyles.value}>{formatEnumValue(viewData.tipoOcorrencia)}</div>
				</div>
				</div>
				{viewData?.dadosDetalhamentoEstacao && (
					<div className={viewStyles.stationInfo}>
						<h4 className={viewStyles.stationTitle}>Informações da Estação</h4>
						<div className={viewStyles.stationDetails}>
							<div><strong>Nome:</strong> {viewData.dadosDetalhamentoEstacao?.nome}</div>
							{viewData.dadosDetalhamentoEstacao?.linha && (
								<div><strong>Linha: </strong>{formatEnumValue(viewData.dadosDetalhamentoEstacao.linha)}</div>
							)}
							{viewData.dadosDetalhamentoEstacao?.dadosControle && (
								<div><strong>Centro de Controle:</strong> {viewData.dadosDetalhamentoEstacao.dadosControle.nome}</div>
							)}
						</div>
					</div>
				)}
			</div>
		)}
	</Modal>
);

export default OcorrenciaViewModal;
