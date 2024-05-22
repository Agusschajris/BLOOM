"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; 
import Popup from './popUp';

const MainPage: React.FC = () => {
  const router = useRouter(); 
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
    router.push('/proyecto'); 
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
