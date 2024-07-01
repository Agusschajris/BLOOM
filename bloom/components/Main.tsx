"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import Popup from './popUp';
import styles from '../styles/proyecto.module.scss';
import ProyectPrev from './proyectPrev';
import { Dataset } from "@prisma/client";

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

  const handleConfirm = (dataset: FileList | number) => {
    if (typeof dataset !== 'number') {
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
        response.json().then((data: Dataset[]) => {
          dataset = data[0].id;
        });
      }).catch(err => {
        console.log(err);
      });
    }
    fetch("http://localhost:3000/api/projects", {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          name: "Nuevo proyecto",
          datasetId: dataset
      })
    }).then(response => {
      if (response.status !== 201) {
        console.log('Error al crear el proyecto: ');
        response.json().then(data => console.log(data));
        return;
      }

      response.json().then((project: Project) => {
        setShowPopup(false);
        router.push(`/proyecto/${project.id}`);
      });
    })
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
