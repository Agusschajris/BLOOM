import React from 'react';
import { useLocation } from 'react-router-dom';
import './CustomComponent.css';
import style from '../styles/navBar.module.scss';
import Image from 'next/image';
import logoSVG from '../public/logo.svg';
import userSVG from '../public/user.svg';

const navBar = () => {

    const handleUser = () => {
        
    }
    const location = useLocation()
    let classProyect = ""
    let classClass = ""

    switch (location.pathname) {
        case "/":
            classProyect = "selected"
            classClass = "notSelected"
            break;
        case "/clases":
            classProyect = "notSelected"
            classClass = "selected"
            break;
    }

    return (
        <div className={style.bar}>
            <Image src={logoSVG} alt="logo" width={10} height={5} />
            <div className={style.options}>
                <button className={style.classProyect}>Proyectos</button>
                <button className={style.classClass}>Clases</button>
            </div>
            <button className={style.userBtn} onClick={handleUser}>
                <Image src={userSVG} alt="user" width={5} height={5} />
            </button>
        </div>
    )

}

export default navBar;