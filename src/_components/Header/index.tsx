import Logo from './Logo'
import { Menu } from './Menu'
import { Perfil } from './Perfil'
import styles from './header.module.scss'

export default function Header() {
    return (
        <header className={styles.grid}>
            <div className={styles.grid__left}>
                <Logo />
                <Menu />
            </div>
            <Perfil />
        </header>
    )
}