import Link from "next/link";
import styles from './logo.module.scss'
import Image from "next/image";

export default function Logo() {
    return(
        <div className={styles.logo}>
            <Image
                src={''}
                width={25}
                height={25}
                alt=""
            />
            <Link href={'/'}></Link>
        </div>
    )
}