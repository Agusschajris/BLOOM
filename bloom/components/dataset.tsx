import React from "react";
import Image from "next/image";
import redirectSVG from '@public/redirect.svg'
import style from '@styles/dataset.module.scss'
import ticSVG from '@public/tic.svg'

export interface DatasetOptionProps{
    name: string;
    link: URL;
}
const DatasetOption: React.FC<DatasetOptionProps> = ({ name, link }) => {
    const handleRedirect = () => {
        window.open(link, '_blank');
    };

    const handleSelect = () => {
        
    };

    return(
        <div className={style.wrapper}>
            <h1 className={style.name}>{name}</h1>
            <div className={style.btns}>
                <button onClick={handleRedirect} className={style.redirect}>
                    <Image src={redirectSVG} alt="redirigir" className={style.redirectSVG} width={25}/>
                </button>
                <button onClick={handleSelect} className={style.select}>
                    <Image src={ticSVG} alt="seleccionar" className={style.ticSVG} width={17}/>
                </button>
            </div>
        </div>
    );
};

export default DatasetOption;