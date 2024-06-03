import React from "react";
import style from '../styles/bloque.module.scss';

interface BloqueProps {
    name: string;
    exp: string;
}

const Bloque: React.FC<BloqueProps> = ({ name, exp }) => {
    return (
        <div className={style.container}>
            <div className={style.bloque}>
                <p className={style.name}>{name}</p>
            </div>
            <span className={style.span}>{exp}</span>
        </div>
    );
};

export default Bloque;
