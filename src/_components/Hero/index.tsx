import styles from './hero.module.scss';

export default function Hero() {
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
                </div>
            </div>
        </section>
    );
}