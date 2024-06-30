import React from "react";
import style from "../styles/proyectPrev.module.scss";

interface ProyectPrevProps {
    
}

const ProyectPrev: React.FC<ProyectPrevProps> = ({}) => {
    return (
        <div className={style.container}>
            <div className={style.preview}></div>
            <div className={style.footer}>
                <p className={style.name}>Proyecto 1</p>
                <button className={style.edit}>Editar</button>
            </div>
        </div>
    );
}