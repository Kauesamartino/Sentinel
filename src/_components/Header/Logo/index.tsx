import Link from "next/link";
import styles from './logo.module.scss';
import Image from "next/image";

export default function Logo() {
    return (
        <div className={styles.logo}>
            <Link href={'/'}>
                <Image
                    src="https://aemassets.grupoccr.com.br/content/dam/sites-modulares/pt/media/images/logos/motiva_logo_only.svg"
                    width={150}
                    height={80}
                    alt="Logo Motiva"
                    draggable={false}
                    style={{ display: 'block' }}
                />
            </Link>
        </div>
    );
}