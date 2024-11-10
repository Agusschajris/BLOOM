import React from "react";
import style from '@styles/classesPrev.module.scss'

interface Props{
    id: number,
    name: string;
}

const ClassPreview: React.FC<Props> = ({id, name}) => {
    return(
    <div className={style.container}>
        <h1 className={style.name}>{name}</h1>
    </div>
    )
};

export default ClassPreview;