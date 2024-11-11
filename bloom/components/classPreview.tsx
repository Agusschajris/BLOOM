import React from "react"
import style from '@styles/classesPrev.module.scss'
import dots from '@public/dots.svg'
import Image from "next/image"

interface Props{
    id: number,
    name: string,
}

const ClassPreview: React.FC<Props> = ({/*id,*/ name}) => {

    const handleMore = () => {
        
    };

    return(
    <div className={style.container}>
        <h1 className={style.name}>{name}</h1>
        <button className={style.more} onClick={handleMore}>
            <Image src={dots} alt="más" className={style.dotsSVG}/>
        </button>
    </div>
    )
};

export default ClassPreview;