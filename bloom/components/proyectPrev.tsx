import React from "react";
import style from "../styles/proyectPrev.module.scss";
import Image from 'next/image';
import configSVG from '../public/config.svg';
import { useRouter } from 'next/router';

interface ProyectPrevProps {
    id: number
    name: string
}

const ProyectPrev: React.FC<ProyectPrevProps> = ({id, name}) => {
    const router = useRouter();
    const handleEdit = () => {

    }
    
    const handleConfig = () => {

    }

    const handleModify = () => {
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

    }

    return (
        <div className={style.container}>
            <div className={style.preview}></div>
            <div className={style.footer}>
                <p className={style.name}>{name}</p>
                <button className={style.edit} onClick={handleEdit}>Editar</button>
            </div>

            <div className={style.popUp}>
                <div className={style.bigPreview}></div>
                <div className={style.aside}>
                    <div className={style.header}>
                        <h1>Proyecto 1</h1>
                        <button className={style.config} onClick={handleConfig}>
                            <Image src={configSVG} alt="more" width={15} height={15} />
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

            <div className={style.configPopUp}>
                <button className={style.change} onClick={handleChangeName}>Cambiar nombre</button>
                <button className={style.duplicate} onClick={handleDuplicate}>Duplicar</button>
                <button className={style.delete} onClick={handleDelete}>Eliminar</button>
            </div>

        </div>
    );
}

export default ProyectPrev;