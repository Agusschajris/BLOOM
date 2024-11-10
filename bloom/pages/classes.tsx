import React, { useEffect, useState } from "react";
import NavBar from "@components/navBar";
import styles from "@styles/classes.module.scss";
import masSVG from "@public/masClasses.svg";
import Image from "next/image";
import ClassPreview from "@/components/classPreview";
import JoinedClassPreview from "@/components/joinedClassPreview";

interface Class {
    id: number;
    name: string;
    owner: string;
}

const ClassesPage: React.FC = () => {
    const [classesCreated, setClassesCreated] = useState<Class[]>([]);
    const [joinedClasses, setJoinedClasses] = useState<Class[]>([]);

    useEffect(() => {
        // Acá van los dos fetch!!
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
                    <div className={styles.header}>
                        <h1 className={styles.tittle}>Clases creadas</h1>
                        <button className={styles.newClassBtn} onClick={handleNewClass}>
                            <Image src={masSVG} alt="nueva clase" className={styles.masSVG} width={20}/>
                        </button>
                    </div>
                    <div className={styles.createdClasses}>
                        {classesCreated.map((classCreated) => (
                            <ClassPreview key={classCreated.id} id={classCreated.id} name={classCreated.name}/>
                        ))}
                    </div>
                    
                    <div className={styles.header}>
                        <h1 className={styles.tittle}>Clases unidas</h1>
                        <button className={styles.newClassBtn} onClick={handleJoinClass}>
                            <Image src={masSVG} alt="unirse a una clase" className={styles.masSVG} width={20}/>
                        </button>
                    </div>
                    <div className={styles.createdClasses}>
                        {joinedClasses.map((joinedClass) => (
                            <JoinedClassPreview key={joinedClass.id} id={joinedClass.id} name={joinedClass.name} owner={joinedClass.owner}/>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );

};

export default ClassesPage;
