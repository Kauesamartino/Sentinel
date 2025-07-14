import Link from "next/link";
import styles from './logo.module.scss'
import logo from './logoccr.png'
import Image from "next/image";

export default function Logo() {
    return (
        <div className={styles.logo}>
            <Link href={'/'}>
                <Image
                    src={logo}
                    width={55}
                    height={55}
                    alt=""
                />
            </Link>
        </div>
    )
}