import React from "react";
import style from "../styles/proyectPrev.module.scss";
import Image from 'next/image';
import configSVG from '../public/config.svg';
import closeSVG from '../public/close.svg';
import { useRouter } from 'next/router';
import { useState } from 'react';

interface ProyectPrevProps {
    id: number,
    name: string,
    onDelete: (id: number) => void
}

const ProyectPrev: React.FC<ProyectPrevProps> = ({id, name, onDelete}) => {
    const [showPopup, setShowPopup] = useState(false);
    const [showConfig, setShowConfig] = useState(false);
    const router = useRouter();
    const handleEdit = () => {
        setShowPopup(true);
    }

    const handleCancel = () => {
        setShowPopup(false);
    };
    
    const handleConfig = () => {
        setShowConfig(true);

    }

    const handleModify  = () => {
        router.push(`/proyecto/${id}`);
    }

    const handleDownload = () => {

    }

    const handleOpen = () => {

    }

    const handleChangeName = () => {

    }

    const handleDuplicate = () => {

    }

    const handleDelete = () => {
        fetch(`http://localhost:3000/api/projects/${id}`, {
            method: 'DELETE'
        }).then(() => {onDelete(id)});
    }

    return (
        <div className={style.container}>
            <div className={style.preview}>
            </div>
            <div className={style.footer}>
                <p className={style.name}>{name}</p>
                <button className={style.edit} onClick={handleEdit}>Editar</button>
            </div>
            
            {showPopup && (
            <>
            <div className={style.overlay} onClick={handleCancel} />
            <div className={style.popUp}>
                <button className={style.cancel} onClick={handleCancel}>
                    <Image src={closeSVG} alt="close" width={15} height={15} />
                </button>
                <div className={style.wrapper}>
                    <div className={style.bigPreview}></div>
                    <div className={style.aside}>
                        <div className={style.header}>
                            <h1>{name}</h1>
                            <button className={style.config} onClick={handleConfig}>
                                <Image src={configSVG} alt="configuration" width={15} height={15} />
                            </button>
                        </div>
                        <hr className={style.line}/>
                        <button className={style.modify} onClick={handleModify}>Modificar</button>
                        <button className={style.download} onClick={handleDownload}>Descargar</button>
                        <button className={style.open} onClick={handleOpen}>Abrir en Collab</button>
                        <hr className={style.line}/>
                        <p className={style.time}>Editado Septiembre 20, 2023</p>
                        <p className={style.time}>Creado Septiembre 12, 2023</p>
                    </div>
                </div>
            </div>
            </>
            )}

            {showConfig && (
            <div className={style.configPopUp}>
                <button className={style.change} onClick={handleChangeName}>Cambiar nombre</button>
                <button className={style.duplicate} onClick={handleDuplicate}>Duplicar</button>
                <button className={style.delete} onClick={handleDelete}>Eliminar</button>
            </div>)}

        </div>
    );
}

export default ProyectPrev;