"use client"; // Asegura que este componente se ejecute en el cliente

import React from 'react';
import Bloque from '../components/bloque'
import data from "../public/blocks.json"
import styles from '../styles/proyecto.module.scss'

const Proyecto: React.FC = () => {
  return (
    <>
      <header className={styles.header}>
        <button className="home"></button>
        <h1 className='name'>Proyecto</h1>
      </header>
      <h1>Página de Confirmación</h1>
      <p>Proyecto creado exitosamente.</p>
      <div>
        {data.map(bloque => (<Bloque key={bloque.visualName} name={bloque.visualName} exp={bloque.exp} />))}
      </div>
    </>
  );
};

export default Proyecto;
