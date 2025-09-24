import React from "react";
import styles from "./ConfirmActionModal.module.scss";

interface ConfirmActionModalProps {
  open: boolean;
  action: "aprovar" | "desaprovar";
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

const actionLabels = {
  aprovar: {
    title: "Confirmar aprovação",
    message: "Tem certeza que deseja aprovar esta ocorrência?",
    confirm: "Aprovar",
    color: "#273BE2"
  },
  desaprovar: {
    title: "Confirmar desaprovação",
    message: "Tem certeza que deseja desaprovar esta ocorrência?",
    confirm: "Desaprovar",
    color: "#273BE2"
  }
};

const ConfirmActionModal: React.FC<ConfirmActionModalProps> = ({ open, action, onConfirm, onCancel, loading }) => {
  if (!open) return null;
  const { title, message, confirm, color } = actionLabels[action];
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 style={{ color }}>{title}</h2>
        <p>{message}</p>
        <div className={styles.actions}>
          <button className={styles.cancel} onClick={onCancel} disabled={loading}>Cancelar</button>
          <button className={styles.confirm} style={{ backgroundColor: color }} onClick={onConfirm} disabled={loading}>
            {loading ? "Processando..." : confirm}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmActionModal;
