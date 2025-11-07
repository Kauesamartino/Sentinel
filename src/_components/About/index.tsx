import styles from './about.module.scss';

export default function About() {
    return (
        <section id="about" className={styles.section}>
            <div className={styles.apresentationText}>
                <h2 className={styles.title}>Sobre o Sentinel</h2>
                <p className={styles.description}>
                    O Sentinel é uma iniciativa dos alunos em parceria com a FIAP e a Motiva. É uma solução de segurança inteligente 
                    que utiliza visão computacional e inteligência artificial para detectar situações de risco em tempo real 
                    dentro de trens e estações.
                </p>
                <br />
                <p className={styles.description}>
                    Ele funciona de forma integrada pelas câmeras de segurança, que identificam automaticamente comportamentos 
                    suspeitos e enviam alertas para a central de monitoramento e também por meio de um chatbot no WhatsApp, 
                    onde o usuário pode relatar ocorrências com texto, imagem, áudio ou vídeo.
                </p>
                <br />
                <p className={styles.description}>
                    Tudo isso acontece em uma plataforma simples, rápida e eficiente, que garante respostas imediatas e ações 
                    precisas. O resultado é claro: menos violência, mais tranquilidade e viagens mais seguras.
                </p>
            </div>
        </section>
    )
}