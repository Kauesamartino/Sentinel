import styles from './not-found.module.scss';
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>404 - Página não encontrada</h1>
        <p className={styles.text}>A página que você procura não existe ou foi movida.</p>
        <Link href="/" className={styles.link}>
          Voltar para o início
        </Link>
      </div>
    </main>
  );
}
