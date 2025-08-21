'use client';

import React from 'react';
import styles from './modal.module.scss';

type ModalProps = {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
  width?: number | string;
};

export default function Modal({ open, title, onClose, children, width = 600 }: ModalProps) {
  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className={styles.overlay}
      onClick={onClose}
    >
      <div
        className={styles.modal}
        style={{ width }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
          <button 
            onClick={onClose} 
            className={styles.closeButton}
            aria-label="Fechar"
          >
            ×
          </button>
        </div>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
} 