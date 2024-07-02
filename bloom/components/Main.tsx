"use client";

import React, {useState, useEffect, useCallback} from 'react';
import { useRouter } from 'next/navigation'; 
import Popup from './popUp';
import styles from '../styles/main.module.scss';
import ProyectPrev from './proyectPrev';
import { Dataset } from "@prisma/client";
import NavBar from './navBar';
import { ProjectPrevProps } from './proyectPrev';

type ProjectData = ProjectPrevProps & {
  lastEdited: string | null,
  creationDate: string
}

const MainPage: React.FC = () => {
  const router = useRouter(); 
  const [showPopup, setShowPopup] = useState(false);
  const [projects, setProjects] = useState<ProjectData[]>([]);

  const onDelete = useCallback((id: number) => {
    setProjects(projects.filter(p => p.id !== id));
  }, [projects]);

  useEffect(() => {
    fetch("http://localhost:3000/api/projects", {
      method: 'GET'
    }).then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    }).then(data => {
      if (Array.isArray(data)) {
        setProjects(data);
      } else {
        console.error("API response is not an array:", data);
      }
    }).catch(err => {
      console.error("Failed to fetch projects:", err);
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
          name: `Proyecto ${projects[projects.length - 1].id + 1}`,
          datasetId: dataset
      })
    }).then(response => {
      if (response.status !== 201) {
        console.log('Error al crear el proyecto: ');
        response.json().then(data => console.log(data));
        return;
      }

      response.json().then((project) => {
        setShowPopup(false);
        router.push(`/proyecto/${project.id}`);
      });
    })
  };

  return (
    <>
      <NavBar/>
      <div className={styles.mainPage}>
        <div className={styles.container}>
          <h1 className={styles.tittle}>Mis proyectos</h1>
          <div className={styles.buttons}>
            <button className={styles.button} onClick={handleCreateProject}>Crear Proyecto</button>
             {showPopup && <Popup onConfirm={handleConfirm} onCancel={handleCancel} />}
           <button className={styles.button}>Última modificación</button>
          </div>
            <div className={styles.proyectos}>
              {projects.map((project) => (
                <ProyectPrev key={project.id} id={project.id} name={project.name} lastEdited={new Date(project.lastEdited as string)} creationDate={new Date(project.creationDate)} onDelete={onDelete} />
              ))}
            </div>

        </div>
     </div>
    </>
  );
};

export default MainPage;
