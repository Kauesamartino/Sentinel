import styles from './page.module.scss';
import Hero from '@/_components/Hero';

export default function HomePage() {
    return (
        <main className={styles.main}>
            <Hero />
        </main>
    );
}
