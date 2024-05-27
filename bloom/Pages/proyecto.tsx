"use client"; // Asegura que este componente se ejecute en el cliente

import React from 'react';
import Bloque from '../Components/bloque';
import data from "../public/blocks.json"

const Proyecto: React.FC = () => {
  return (
    <>
      <h1>Página de Confirmación</h1>
      <p>Proyecto creado exitosamente.</p>
      <div className="overflow-auto h-64">
        {data.map(bloque => (<Bloque key={bloque.visualName} name={bloque.visualName} exp={bloque.exp} />))}
      </div>
    </>
  );
};

export default Proyecto;
