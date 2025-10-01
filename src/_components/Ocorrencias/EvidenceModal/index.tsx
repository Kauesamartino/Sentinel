import React, { useState, useEffect, useCallback } from 'react';
import Modal from '@/_components/Modal';
import styles from './EvidenceModal.module.scss';
import { getEvidencias, type EvidenciaResponse } from '@/services/evidenciaService';
import Link from 'next/link';
import Image from 'next/image';

interface EvidenceModalProps {
    open: boolean;
    onClose: () => void;
    occurrenceId: number;
}

const EvidenceModal: React.FC<EvidenceModalProps> = ({ open, onClose, occurrenceId }) => {
    const [evidence, setEvidence] = useState<EvidenciaResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [selectedUrl, setSelectedUrl] = useState<string>('');

    console.log('EvidenceModal renderizado com props:', { open, occurrenceId });

    const fetchEvidence = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getEvidencias(occurrenceId.toString());
            setEvidence(data);
            if (data && data.urls.length > 0) {
                setSelectedUrl(data.urls[0].url);
            }
        } catch (error) {
            console.error('Erro ao buscar evidências:', error);
        } finally {
            setLoading(false);
        }
    }, [occurrenceId]);

    useEffect(() => {
        console.log('EvidenceModal useEffect:', { open, occurrenceId });
        if (open && occurrenceId) {
            fetchEvidence();
        }
    }, [open, occurrenceId, fetchEvidence]);

    const handleUrlSelect = (url: string) => {
        console.log('Arquivo selecionado:', url);
        setSelectedUrl(url);
        console.log('selectedUrl atualizado para:', url);
    };

    const getFileType = (key: string) => {
        if (key.includes('snapshot') || key.endsWith('.jpg') || key.endsWith('.png')) {
            return 'image';
        }
        if (key.includes('clip') || key.endsWith('.mp4') || key.endsWith('.mov')) {
            return 'video';
        }
        return 'unknown';
    };

    const getFileName = (key: string) => {
        return key.split('/').pop() || key;
    };

    return (
        <Modal 
            open={open} 
            onClose={onClose}
            title={`Evidências - Ocorrência #${occurrenceId}`}
        >
            <div className={styles.container}>

                {loading ? (
                    <div className={styles.loading}>Carregando evidências...</div>
                ) : evidence ? (
                    <div className={styles.content}>
                        <div className={styles.info}>
                            <p><strong>Total de evidências:</strong> {evidence.count}</p>
                            <p><strong>Modelo:</strong> {evidence.model}</p>
                        </div>

                        {evidence.urls.length > 0 && (
                            <>
                                <div className={styles.urlList}>
                                    <h3>Arquivos disponíveis:</h3>
                                    {evidence.urls.map((item, index) => (
                                        <button
                                            key={index}
                                            className={`${styles.urlItem} ${selectedUrl === item.url ? styles.active : ''}`}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                console.log('Clicou no arquivo:', item.key, 'URL:', item.url);
                                                handleUrlSelect(item.url);
                                            }}
                                            type="button"
                                        >
                                            <span className={styles.fileType}>
                                                {getFileType(item.key) === 'image' ? '📷' : '🎥'}
                                            </span>
                                            <span className={styles.fileName}>
                                                {getFileName(item.key)}
                                            </span>
                                        </button>
                                    ))}
                                </div>

                                {selectedUrl && (
                                    <div className={styles.preview}>
                                        {(() => {
                                            const selectedFile = evidence.urls.find(u => u.url === selectedUrl);
                                            const fileType = getFileType(selectedFile?.key || '');
                                            console.log('Renderizando preview para:', selectedFile?.key, 'Tipo:', fileType);
                                            return fileType === 'image' ? (
                                            <Image
                                                src={selectedUrl}
                                                alt="Evidência"
                                                className={styles.imagePreview}
                                                onError={(e) => {
                                                    console.error('Erro ao carregar imagem');
                                                    e.currentTarget.style.display = 'none';
                                                }}
                                            />
                                        ) : (
                                            <video
                                                src={selectedUrl}
                                                controls
                                                className={styles.videoPreview}
                                                onError={() => {
                                                    console.error('Erro ao carregar vídeo:', selectedUrl);
                                                }}
                                                onLoadStart={() => {
                                                    console.log('Iniciando carregamento do vídeo:', selectedUrl);
                                                }}
                                            >
                                                Seu navegador não suporta o elemento de vídeo.
                                            </video>
                                        );
                                        })()}
                                        <div className={styles.actions}>
                                            <Link
                                                href={selectedUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={styles.openButton}
                                            >
                                                Abrir em Nova Aba
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                ) : (
                    <div className={styles.noEvidence}>
                        Nenhuma evidência encontrada para esta ocorrência.
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default EvidenceModal;