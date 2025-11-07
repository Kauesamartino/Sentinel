import React from 'react';
import Modal from '@/_components/Modal';
import viewStyles from './OcorrenciaViewModal.module.scss';
import { formatEnumValue } from '../../../utils/formatEnumValue';

export type OcorrenciaDetalhe = {
	id: number;
	titulo: string;
	descricao: string;
	data: string;
	severidade: string;
	status: string;
	tipoOcorrencia: string;
	ativo?: boolean;
	estacaoOutDto?: {
		id: number;
		nome: string;
		linha?: string;
		ccoOutDto?: {
			id: number;
			nome: string;
		};
	};
	cameraOutDto?: {
		id: number;
		nome: string;
	};
};

interface OcorrenciaViewModalProps {
	open: boolean;
	onClose: () => void;
	viewData: OcorrenciaDetalhe | null;
	formatDate: (value: string) => string;
}

const OcorrenciaViewModal: React.FC<OcorrenciaViewModalProps> = ({ open, onClose, viewData, formatDate }) => {
	// Função para obter a classe CSS baseada na severidade
	const getSeveridadeClass = (severidade: string): string => {
		const severidadeLower = severidade.toLowerCase();
		switch (severidadeLower) {
			case 'baixa':
				return viewStyles.baixa;
			case 'media':
			case 'média':
				return viewStyles.media;
			case 'alta':
				return viewStyles.alta;
			case 'critica':
			case 'crítica':
				return viewStyles.critica;
			default:
				return viewStyles.baixa; // fallback para baixa
		}
	};

	return (
		<Modal open={open} title={`Ocorrência ${viewData?.id}${viewData?.cameraOutDto?.id ? ` - Camera: ${viewData.cameraOutDto.id}` : ''}`} onClose={onClose} width={600}>
		{!viewData ? (
			<div>Carregando...</div>
		) : (
			<div className={viewStyles.viewContainer}>
				<div className={viewStyles.fields}>
					<h3>{viewData.titulo}</h3>

					<div className={viewStyles.fieldDesc}>
						<div className={viewStyles.label}>Descrição</div>
						{viewData.descricao}
					</div>

					<div className={viewStyles.infos}>
						{/* Data */}
						<div className={viewStyles.fieldSeveridade}>
							<div className={viewStyles.label}>Severidade</div>
							<p className={`${viewStyles.valueSeveridade} ${getSeveridadeClass(viewData.severidade)}`}>
								{formatEnumValue(viewData.severidade)}
							</p>
						</div>

						<div className={viewStyles.fieldStatus}>
							<div className={viewStyles.label}>Status</div>
							<div className={viewStyles.valueStatus}>
								{formatEnumValue(viewData.status)}
							</div>
						</div>

						<div className={viewStyles.fieldTipoOcorrencia}>
							<div className={viewStyles.label}>Tipo de Ocorrência</div>
							<div className={viewStyles.valueTipoOcorrencia}>
								{formatEnumValue(viewData.tipoOcorrencia)}
							</div>
						</div>
					</div>

					<div className={viewStyles.fieldData}>
						<div className={viewStyles.label}>Data</div>
						<div className={viewStyles.valueData}>
							{formatDate(viewData.data)}
						</div>
					</div>
				</div>
				{viewData?.estacaoOutDto && (
					<div className={viewStyles.stationInfo}>
						<h4 className={viewStyles.stationTitle}>Informações da Estação</h4>
						<div className={viewStyles.stationDetails}>
							<div><strong>Nome: </strong>Estação {viewData.estacaoOutDto?.nome}</div>
							{viewData.estacaoOutDto?.linha && (
								<div><strong>Linha: </strong>{formatEnumValue(viewData.estacaoOutDto.linha)}</div>
							)}
							{viewData.estacaoOutDto?.ccoOutDto && (
								<div>{viewData.estacaoOutDto.ccoOutDto.nome}</div>
							)}
						</div>
					</div>
				)}
			</div>
		)}
	</Modal>
	);
};

export default OcorrenciaViewModal;
