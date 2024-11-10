import React, { useEffect, useState } from "react";
import NavBar from "@components/navBar";
import styles from "@styles/classes.module.scss";
import masSVG from "@public/masClasses.svg";
import Image from "next/image";
import ClassPreview from "@/components/classPreview";

interface Class {
  id: number;
  name: string;
}

const ClassesPage: React.FC = () => {
  const [classesCreated, setClassesCreated] = useState<Class[]>([]);
  const [joinedClasses, setJoinedClasses] = useState<Class[]>([]);

  useEffect(() => {
    // Acá van los dos fetch!!
    fetch("/api/clases?role=owner", {
      method: "GET"
    }).then(res => {
      if (!res.ok)
        throw new Error(`HTTP error! status: ${res.status}`);

      res.json().then(
        data => setClassesCreated(data)
      );
    });
    fetch("/api/clases?role=joined", {
      method: "GET"
    }).then(res => {
      if (!res.ok)
        throw new Error(`HTTP error! status: ${res.status}`);

      res.json().then(
        data => setJoinedClasses(data)
      );
    });
  }, []);

  const handleNewClass = () => {

  };

  const handleJoinClass = () => {

  };

  return (
    <>
      <NavBar />
      <div className={styles.mainPage}>
        <div className={styles.container}>
          <h1 className={styles.tittle}>Clases creadas</h1>
          <div className={styles.classesContainer}>
            <button className={styles.newClassBtn} onClick={handleNewClass}>
              <Image src={masSVG} alt="nueva clase" className={styles.masSVG} />
            </button>
            <div className={styles.createdClasses}>
              {classesCreated.map((project) => (
                <ClassPreview key={project.id} id={project.id} name={project.name} />
              ))}
            </div>
          </div>

          <h1 className={styles.tittle}>Clases unidas</h1>
          <div className={styles.classesContainer}>
            <button className={styles.newClassBtn} onClick={handleJoinClass}>
              <Image src={masSVG} alt="unirse a una clase" className={styles.masSVG} />
            </button>
            <div className={styles.createdClasses}>
              {joinedClasses.map((joinedClass) => (
                <ClassPreview key={joinedClass.id} id={joinedClass.id} name={joinedClass.name} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClassesPage;
