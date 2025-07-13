import { Menu } from './Menu'
import { Perfil } from './Perfil'
import styles from './header.module.scss'

export default function Header(){
    return(
        <div className={styles.grid}>
            <Menu />
            <Perfil />
        </div>
    )
}