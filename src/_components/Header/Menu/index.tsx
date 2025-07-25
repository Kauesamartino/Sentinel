import Link from "next/link"
import styles from "./menu.module.scss"

export const Menu = () => {

    const rotas = [{
        label: 'Ocorrências',
        to: '/ocorrencias'
    }, {
        label: 'Relatórios',
        to: 'relatorios'
    }, {
        label: 'Integrantes',
        to: 'integrantes'
    }]

    return (
        <nav className={styles.menu}>
            <ul className={styles.menu__list}>
                {rotas.map((rota, index) => (
                    <li key={index}>
                        <Link href={rota.to} className={styles.menu__link}>
                            {rota.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    )
}