import Image from 'next/image';
import styles from './integrantespage.module.scss';

const lista = [
	{
		name: 'Kauê Samartino',
		photo: '/kaue.jpg',
		rm: '559317',
		alt: 'foto de Kauê',
	},
	{
		name: 'Davi Praxedes',
		photo: '/xeds.jpg',
		rm: '560719',
		alt: 'foto de Davi',
	},
	{
		name: 'João dos Santos',
		photo: '/foto_joao.jpg',
		rm: '560400',
		alt: 'foto de João',
	},
];

export default function IntegrantesPage() {
	return (
		<main className={styles.main}>
			<div className={styles.container}>
				<h1 className={styles.title}>Integrantes</h1>
				<div className={styles.integrantesGrid}>
					{lista.map((item) => (
						<div className={styles.card} key={item.rm}>
							<Image
								width={200}
								height={200}
								src={item.photo}
								alt={item.alt}
								className={styles.photo}
								loading="lazy"
							/>
							<div className={styles.name}>{item.name}</div>
							<div className={''}>RM: {item.rm}</div>
						</div>
					))}
				</div>
			</div>
		</main>
	);
}
