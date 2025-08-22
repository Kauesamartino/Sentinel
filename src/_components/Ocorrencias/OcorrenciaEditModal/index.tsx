import React from 'react';
import Modal from '@/_components/Modal';
import OcorrenciaForm, { OcorrenciaPayload, OcorrenciaUpdatePayload } from '../OcorrenciaForm/index';

interface OcorrenciaEditModalProps {
	open: boolean;
	onClose: () => void;
	editId: number | null;
	initial: Partial<OcorrenciaUpdatePayload>;
	onSubmit: (payload: OcorrenciaPayload | OcorrenciaUpdatePayload) => void;
}

const OcorrenciaEditModal: React.FC<OcorrenciaEditModalProps> = ({ open, onClose, editId, initial, onSubmit }) => (
	<Modal open={open} title={editId ? `Editar ocorrência #${editId}` : 'Editar'} onClose={onClose} width={500}>
		<OcorrenciaForm initial={initial} submitLabel="Salvar" onSubmit={onSubmit} isEdit={true} />
	</Modal>
);

export default OcorrenciaEditModal;
