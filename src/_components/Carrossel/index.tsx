'use client';

import { useState, useEffect } from 'react';
import Button from '../Button';
import styles from './carrossel.module.scss';

export default function Carrossel() {
    const items = [
        {
            id: 1,
            title: 'Ocorrencias',
            route: '/ocorrencias',
            description: 'Gerencie e monitore ocorrências de forma eficiente.',
            bgImage: 'ocorrencias.png'
        }, {
            id: 2,
            title: 'Relatórios',
            route: '/relatorios',
            description: 'Gere relatórios detalhados sobre as ocorrências registradas.',
            bgImage: 'relatorios.png'
        }, {
            id: 3,
            title: 'Curadoria',
            route: '/curadoria',
            description: 'Revise e valide as informações das ocorrências.',
            bgImage: 'ccr.png'
        }, {
            id: 4,
            title: 'Dashboards',
            route: '/dashboards',
            description: 'Visualize dados e métricas de forma interativa.',
            bgImage: 'dashboards.png'
        }, {
            id: 5,
            title: 'Integrantes',
            route: '/integrantes',
            description: 'Visualize a equipe desenvolvedora do projeto.',
            bgImage: 'integrantes.png'
        }
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        console.log('Carrossel iniciado - Index atual:', currentIndex);
        
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => {
                const nextIndex = (prevIndex + 1) % items.length;
                console.log('Mudando de', prevIndex, 'para', nextIndex);
                return nextIndex;
            });
        }, 7000);

        return () => {
            console.log('Limpando interval do carrossel');
            clearInterval(interval);
        };
    }, [currentIndex, items.length]);

    const goToSlide = (index: number) => {
        console.log('Navegação manual para slide:', index);
        setCurrentIndex(index);
    };

    return (
        <section className={styles.section}>
            <div className={styles.carrosselContainer}>
                
                <div 
                    className={styles.carrosselTrack}
                    style={{
                        transform: `translateX(-${currentIndex * 20}%)`
                    }}
                >
                    {items.map(item => (
                        <div
                            key={item.id}
                            className={styles.card}
                            style={{
                                backgroundImage: `url(/${item.bgImage})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}>
                            <div className={styles.container}>
                                <h3 className={styles.title}>{item.title}</h3>
                                <p className={styles.description}>{item.description}</p>
                                <Button
                                    onClick={() => {
                                        window.location.href = item.route;
                                    }}
                                    variant="primary"
                                    size="medium"
                                    className={styles.accessButton}
                                >
                                    Acessar {item.title}
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>


                <div className={styles.indicators}>
                    {items.map((_, index) => (
                        <button
                            key={index}
                            className={`${styles.indicator} ${
                                index === currentIndex ? styles.active : ''
                            }`}
                            onClick={() => goToSlide(index)}
                            aria-label={`Ir para slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}