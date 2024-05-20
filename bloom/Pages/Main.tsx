"use client"; // Asegura que este componente se ejecute en el cliente

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Importar desde next/navigation
import Popup from '../src/app/Components/popUp';

const MainPage: React.FC = () => {
  const router = useRouter(); // Usa el enrutador de Next.js para la navegación
  const [showPopup, setShowPopup] = useState(false);

  const handleCreateProject = () => {
    setShowPopup(true);
  };

  const handleCancel = () => {
    setShowPopup(false);
  };

  const handleConfirm = (dataset: FileList | string) => {
    if (typeof dataset === 'string') {
      console.log('Dataset seleccionado:', dataset);
    } else {
      Array.from(dataset).forEach(file => {
        console.log('Archivo seleccionado:', file.name);
      });
    }
    setShowPopup(false);
    router.push('/proyecto'); // Esto me da error !! a ver
  };

  return (
    <div className="main-page">
      <h1>Página Principal</h1>
      <button onClick={handleCreateProject}>Crear Proyecto</button>
      {showPopup && <Popup onConfirm={handleConfirm} onCancel={handleCancel} />}
    </div>
  );
};

export default MainPage;
