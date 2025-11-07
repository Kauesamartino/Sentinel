import styles from './about.module.scss';

export default function About() {
    return (
        <section id="about" className={styles.section}>
            <div className={styles.apresentationText}>
                <h2 className={styles.title}>Sobre o Sentinel</h2>
                <p className={styles.description}>
                    O Sentinel é uma iniciativa para melhorar a segurança e a eficiência na gestão de ocorrências. Um projeto
                    dos alunos em conjunto com a FIAP e a Motiva, desenvolvido para facilitar o registro, acompanhamento e análise de eventos,
                    promovendo uma resposta rápida e eficaz. Nossa plataforma oferece ferramentas intuitivas para usuários
                    e administradores, garantindo transparência e colaboração em todas as etapas do processo.
                </p>
            </div>
        </section>
    )
}