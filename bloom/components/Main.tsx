"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import Popup from './popUp';
import styles from '../styles/proyecto.module.scss';
import ProyectPrev from './proyectPrev';

interface Project {
  id: number;
  name: string;
}

const MainPage: React.FC = () => {
  const router = useRouter(); 
  const [showPopup, setShowPopup] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/projects", {
      method: 'GET'
    }).then(response => {
      response.json().then(data => {
        setProjects(data);
      });
    });
  }, []);


  const handleCreateProject = () => {
    setShowPopup(true);
  };

  const handleCancel = () => {
    setShowPopup(false);
  };

  const handleConfirm = (dataset: FileList | string) => {
    if (typeof dataset === 'string') {
      console.log('Dataset seleccionado:', dataset);
      fetch("http://localhost:3000/api/dataset/url",
        {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({dataset})
        }
      ).then((response) => {
        console.log(response);
      });
    } else {
      let formData = new FormData();
      Array.from(dataset).forEach(file => {
        console.log('Archivo seleccionado:', file.name);
        formData.append(file.name, file);
      });
      formData.append("close", "close");
      fetch("http://localhost:3000/api/dataset/upload", {
        method: 'POST',
        body: formData
      }).then((response) => {
        console.log(response);
      }).catch(err => {
        console.log(err);
      })
    }
    setShowPopup(false);
    router.push('/proyecto'); 
  };

  return (
    <div className="main-page">
      <h1>Mis proyectos</h1>
      <button className={styles.export} onClick={handleCreateProject}>Crear Proyecto</button>
      {showPopup && <Popup onConfirm={handleConfirm} onCancel={handleCancel} />}
      <div>
        {projects.map((project) => (
          <ProyectPrev key={project.id} id={project.id} name={project.name} />
        ))}
      </div>
    </div>
  );
};

export default MainPage;
