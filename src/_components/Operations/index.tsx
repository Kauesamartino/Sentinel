import Image from 'next/image';
import styles from './operations.module.scss';

export default function Operations() {

    const cards = [
        {
            id: 1,
            title: 'Monitoramento em Tempo Real',
            description: 'Realizamos o monitoramento contínuo dentro de trens e estações, utilizando câmeras para detectar situações anômalas e potenciais ameaças à segurança dos passageiros.',
            urlImage: '/camera.jpg'
        }, {
            id: 2,
            title: 'Chatbot de Atendimento',
            description: 'Nosso chatbot avançado está disponível 24/7 para auxiliar passageiros, responder perguntas frequentes e registrar ocorrências.',
            urlImage: '/chatbot.jpg'
        } , {
            id: 3,
            title: 'Análise de Ocorrências',
            description: 'Utilizamos técnicas avançadas de análise de dados para identificar padrões e tendências em ocorrências, permitindo uma resposta mais rápida e eficaz.',
            urlImage: '/analise.jpg'
        }
    ]

    return (
        <section className={styles.section}>
            <h2 className={styles.title}>O que oferecemos</h2>
            <div className={styles.cardsContainer}>
                {cards.map(card => (
                    <div key={card.id} className={styles.card}>
                        <Image
                            src={card.urlImage}
                            alt={card.title}
                            width={1000}
                            height={200}
                            quality={100}
                            className={styles.cardImage}
                        />
                        <h3 className={styles.cardTitle}>{card.title}</h3>
                        <p className={styles.cardDescription}>{card.description}</p>
                    </div>
                ))}
            </div>
        </section>
    )
}