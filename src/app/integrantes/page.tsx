import Image from 'next/image';
import styles from './integrantespage.module.scss';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import Link from 'next/link';

const lista = [
	{
		name: 'Kauê Samartino',
		photo: '/kaue.jpg',
		rm: '559317',
		github: 'https://github.com/Kauesamartino',
		linkedin: 'https://www.linkedin.com/in/kauesamartino/',
		alt: 'foto de Kauê',
	},
	{
		name: 'Davi Praxedes',
		photo: '/xeds.jpg',
		rm: '560719',
		github: 'https://github.com/davipraxedes',
		linkedin: 'https://www.linkedin.com/in/davipraxedes/',
		alt: 'foto de Davi',
	},
	{
		name: 'João dos Santos',
		photo: '/foto_joao.jpg',
		rm: '560400',
		github: 'https://github.com/joaoscj',
		linkedin: 'https://www.linkedin.com/in/joaoscj/',
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
							<div className={styles.icones}>
								<Link 
									href={item.github} 
									target="_blank" 
									rel="noopener noreferrer"
									className={styles.iconLink}
									aria-label={`GitHub de ${item.name}`}
								>
									<FaGithub className={styles.icon} />
								</Link>
								<Link 
									href={item.linkedin} 
									target="_blank" 
									rel="noopener noreferrer"
									className={styles.iconLink}
									aria-label={`LinkedIn de ${item.name}`}
								>
									<FaLinkedin className={styles.icon} />
								</Link>
							</div>
						</div>
					))}
				</div>
			</div>
		</main>
	);
}
