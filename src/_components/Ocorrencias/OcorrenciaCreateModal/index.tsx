import React from 'react';
import Modal from '@/_components/Modal';
import OcorrenciaForm, { OcorrenciaPayload } from '../OcorrenciaForm/index';

interface OcorrenciaCreateModalProps {
	open: boolean;
	onClose: () => void;
	onSubmit: (payload: OcorrenciaPayload) => void;
}

const OcorrenciaCreateModal: React.FC<OcorrenciaCreateModalProps> = ({ open, onClose, onSubmit }) => (
	<Modal open={open} title="Nova ocorrência" onClose={onClose} width={500}>
		<OcorrenciaForm submitLabel="Criar" onSubmit={onSubmit} />
	</Modal>
);

export default OcorrenciaCreateModal;

