'use client';
import Button from '../Button';
import styles from './hero.module.scss';

export default function Hero() {
    const scrollToEndOfHero = () => {
        // Pega a altura da janela para calcular o scroll
        const heroHeight = window.innerHeight;
        
        // Rola para o final da seção Hero menos 100px
        window.scrollTo({
            top: heroHeight - 100,
            behavior: 'smooth'
        });
    };
    return (
        <section>
            <div
                className={styles.bgc}
                style={{
                    backgroundImage: 'url(/image4gradient.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: '0 top',
                }}>
                <div className={styles.content}>
                    <div className={styles.text}>
                        <h1 className={styles.title}>Bem-vindo ao Sentinel</h1>
                        <p className={styles.subtitle}>
                            Seu sistema completo para gerenciamento de ocorrências, curadoria e relatórios.
                        </p>
                    </div>
                    <Button
                        onClick={scrollToEndOfHero}
                        variant="primary"
                        size="medium"
                        className={styles.ctaButton}
                    >
                        Conheça mais
                    </Button>
                </div>
            </div>
        </section>
    );
}