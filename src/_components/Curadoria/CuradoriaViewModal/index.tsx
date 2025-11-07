import styles from './CuradoriaViewModal.module.scss';
import Modal from '@/_components/Modal'; // Adjust the import path if necessary
import { formatEnumValue } from '../../../utils/formatEnumValue';

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
const CuradoriaViewModal: React.FC<CuradoriaViewModalProps> = ({ open, onClose, viewData, formatDate }) => {

  // Função para obter a classe CSS baseada na severidade
  const getSeveridadeClass = (severidade: string): string => {
    const severidadeLower = severidade.toLowerCase();
    switch (severidadeLower) {
      case 'baixa':
        return styles.baixa;
      case 'media':
      case 'média':
        return styles.media;
      case 'alta':
        return styles.alta;
      case 'critica':
      case 'crítica':
        return styles.critica;
      default:
        return styles.baixa; // fallback para baixa
    }
  };

  return (
    <Modal open={open} title={`Ocorrência ${viewData?.id}${viewData?.cameraOutDto?.id ? ` - Camera: ${viewData.cameraOutDto.id}` : ''}`} onClose={onClose} width={600}>
      {!viewData ? (
        <div>Carregando...</div>
      ) : (
        <div className={styles.viewContainer}>
          <div className={styles.fields}>
            <h3>{viewData.titulo}</h3>

            <div className={styles.fieldDesc}>
              <div className={styles.label}>Descrição</div>
              {viewData.descricao}
            </div>

            <div className={styles.infos}>
              {/* Data */}
              <div className={styles.fieldSeveridade}>
                <div className={styles.label}>Severidade</div>
                <p className={`${styles.valueSeveridade} ${getSeveridadeClass(viewData.severidade)}`}>
                  {formatEnumValue(viewData.severidade)}
                </p>
              </div>

              <div className={styles.fieldStatus}>
                <div className={styles.label}>Status</div>
                <div className={styles.valueStatus}>
                  {formatEnumValue(viewData.status)}
                </div>
              </div>

              <div className={styles.fieldTipoOcorrencia}>
                <div className={styles.label}>Tipo de Ocorrência</div>
                <div className={styles.valueTipoOcorrencia}>
                  {formatEnumValue(viewData.tipoOcorrencia)}
                </div>
              </div>
            </div>

            <div className={styles.fieldData}>
              <div className={styles.label}>Data</div>
              <div className={styles.valueData}>
                {formatDate(viewData.data)}
              </div>
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
                {viewData.estacaoOutDto?.ccoOutDto && (
                  <div>{viewData.estacaoOutDto.ccoOutDto.nome}</div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </Modal>
  )
};

export default CuradoriaViewModal;
