import styles from './CuradoriaViewModal.module.scss';
import Modal from '@/_components/Modal'; // Adjust the import path if necessary

interface CuradoriaViewModalProps {
  open: boolean;
  onClose: () => void;
  viewData: CuradoriaDetalhe | null;
  formatDate: (value: string) => string;
}

export type CuradoriaDetalhe = {
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
const CuradoriaViewModal: React.FC<CuradoriaViewModalProps> = ({ open, onClose, viewData, formatDate }) => (
  <Modal open={open} title="Curadoria" onClose={onClose} width={600}>
    {!viewData ? (
      <div>Carregando...</div>
    ) : (
      <div className={styles.viewContainer}>
        <div className={styles.fields}>
          <div className={styles.field}>
            <span className={styles.label}>Título</span>
            <div className={styles.value}>{viewData.titulo}</div>
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Descrição</span>
            <div className={styles.description}>{viewData.descricao || 'Sem descrição'}</div>
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Data</span>
            <div className={styles.value}>{formatDate(viewData.data)}</div>
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Severidade</span>
            <div className={styles.value}>{viewData.severidade}</div>
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Status</span>
            <div className={styles.value}>{viewData.status}</div>
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Tipo</span>
            <div className={styles.value}>{viewData.tipoOcorrencia}</div>
          </div>
        </div>
        {viewData?.estacaoOutDto && (
          <div className={styles.stationInfo}>
            <h4 className={styles.stationTitle}>Informações da Estação</h4>
            <div className={styles.stationDetails}>
              <div><strong>Nome:</strong> {viewData.estacaoOutDto?.nome}</div>
              {viewData.estacaoOutDto?.linha && (
                <div><strong>Linha: </strong>{viewData.estacaoOutDto.linha}</div>
              )}
              {viewData.estacaoOutDto?.dadosControle && (
                <div><strong>Centro de Controle:</strong> {viewData.estacaoOutDto.dadosControle.nome}</div>
              )}
            </div>
          </div>
        )}
      </div>
    )}
  </Modal>
);

export default CuradoriaViewModal;
