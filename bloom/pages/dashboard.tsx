"use client";

import React, {useState, useEffect, useCallback} from 'react';
import { useRouter } from 'next/navigation'; 
import Popup from '../components/popUp';
import styles from '../styles/main.module.scss';
import ProyectPrev from '../components/proyectPrev';
import { Dataset } from "@prisma/client";
import NavBar from '../components/navBar';
import { Project } from '@prisma/client';
import { emptyCompression } from "./proyecto/[id]";

const MainPage: React.FC = () => {
  const router = useRouter(); 
  const [showPopup, setShowPopup] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);

  const onDelete = useCallback((id: number) => {
    setProjects(projects.filter(p => p.id !== id));
  }, [projects]);

  const onDuplicate = useCallback((id: number) => {
    fetch(`/api/projects/${id}`, {
      method: "POST",
    }).then(response => {
      response.json().then((copy: Project) => {
        setProjects([...projects, copy]);
      });
    });
  }, [projects]);

  useEffect(() => {
    fetch("/api/projects", {
      method: 'GET'
    }).then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    }).then(data => {
      if (Array.isArray(data)) {
        data.forEach(x => {
          x.lastEdited = new Date(x.lastEdited)
          x.creationDate = new Date(x.creationDate)
        })
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
      fetch("/api/dataset/upload", {
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
    fetch("/api/projects", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: `Proyecto ${projects.length > 0 ? projects.length + 1 : "Inicial"}`,
        datasetId: dataset,
        blocks: emptyCompression
      })
    }).then(response => {
      if (response.status !== 201) {
        console.log('Error al crear el proyecto: ');
        console.log(response);
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
                <ProyectPrev key={project.id} id={project.id} name={project.name} lastEdited={project.lastEdited} creationDate={project.creationDate} onDelete={onDelete} onDuplicate={onDuplicate} />
              ))}
            </div>

        </div>
     </div>
    </>
  );
};

export default MainPage;
