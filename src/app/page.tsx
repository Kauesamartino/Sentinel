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
            <Hero />
        </main>
    );
}
