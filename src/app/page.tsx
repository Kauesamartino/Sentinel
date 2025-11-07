import About from '@/_components/About';
import styles from './page.module.scss';
import Hero from '@/_components/Hero';
import Operations from '@/_components/Operations';
import Carrossel from '@/_components/Carrossel';

export default function HomePage() {
    return (
        <main className={styles.main}>
            <Hero />
            <About />
            <Carrossel />
            <Operations />
        </main>
    );
}
