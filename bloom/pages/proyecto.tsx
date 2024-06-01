"use client"; // Asegura que este componente se ejecute en el cliente

import React from 'react';
import { useRouter } from 'next/router'; 
import Bloque from '../components/bloque'
import data from "../public/blocks.json"
import styles from '../styles/proyecto.module.scss'
import homeSVG from '../public/home.svg'

const Proyecto: React.FC = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push('/');
  };

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <button className={styles.home} onClick={handleClick}>
          <img src={homeSVG} alt="home" />
        </button>
        <h1>Proyecto</h1>
        <button className={styles.export}>Exportar</button>
      </header>
      <div className={styles.container}>
      <aside className={styles.blocksAside}>
        <h1>CAPAS</h1>
        <div className={styles.blocksWrap}>
          {data.map(bloque => (<Bloque key={bloque.visualName} name={bloque.visualName} exp={bloque.exp} />))}
        </div>
      </aside>
      <div className={styles.canvas}>canvas</div>
      <aside className={styles.codigoWrap}>
        <h1>CÓDIGO</h1>
      </aside>
      </div>
    </div>
  );
};

export default Proyecto;
