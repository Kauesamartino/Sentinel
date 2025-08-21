import styles from './page.module.scss';
import Link from 'next/link';

const features = [
    {
        title: 'Ocorrências',
        description: 'Registre, visualize e gerencie ocorrências de forma rápida e eficiente.',
        link: '/ocorrencias',
        icon: '📋',
    },
    {
        title: 'Relatórios',
        description: 'Gere relatórios detalhados e acompanhe o histórico das ocorrências.',
        link: '/relatorios',
        icon: '📊',
    },
    {
        title: 'Integrantes',
        description: 'Conheça a equipe responsável pelo sistema.',
        link: '/integrantes',
        icon: '👥',
    },
];

export default function HomePage() {
    return (
        <main className={styles.main}>
            <div className={styles.hero}>
                <h1 className={styles.title}>Bem-vindo ao Sentinel</h1>
                <p className={styles.subtitle}>
                    Gerencie ocorrências, gere relatórios e acompanhe tudo em um só lugar.
                </p>
            </div>
            <div className={styles.featuresGrid}>
                {features.map((feature) => (
                    <Link href={feature.link} key={feature.title} className={styles.card}>
                        <span className={styles.icon}>{feature.icon}</span>
                        <h2 className={styles.cardTitle}>{feature.title}</h2>
                        <p className={styles.cardDesc}>{feature.description}</p>
                    </Link>
                ))}
            </div>
            <div className={styles.ctaBox}>
                <span className={styles.ctaText}>Dica: Clique nos cards acima para navegar!</span>
            </div>
        </main>
    );
}
