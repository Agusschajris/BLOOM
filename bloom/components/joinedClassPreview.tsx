import React from "react"
import style from '@styles/classesPrev.module.scss'
import dots from '@public/dots.svg'
import Image from "next/image"

interface Props{
    id: number,
    name: string,
    owner: string;
}

const JoinedClassPreview: React.FC<Props> = ({/*id,*/ name, owner}) => {

    const handleMore = () => {
        
    };

    return(
    <div className={style.container}>
        <h1 className={style.name}>{name}</h1>
        <div className={style.ownerWrap}>
            <p className={style.owner}>Creador por: {owner}</p>
        </div>
        <button className={style.more} onClick={handleMore}>
            <Image src={dots} alt="más" className={style.dotsSVG}/>
        </button>
    </div>
    )
};

export default JoinedClassPreview;