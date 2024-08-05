import React from 'react';
import { useRouter } from 'next/router';
import style from '../styles/navBar.module.scss';
import Image from 'next/image';
import logoSVG from '../public/logo.svg';
import userSVG from '../public/user.svg';

const NavBar: React.FC = () => {
  const router = useRouter();
  const { pathname } = router;
  
  let classProyect = "";
  let classClass = "";

  switch (pathname) {
    case "/dashboard":
      classProyect = style.selected;
      classClass = style.notSelected;
      break;
    case "/clases":
      classProyect = style.notSelected;
      classClass = style.selected;
      break;
    default:
      classProyect = style.notSelected;
      classClass = style.notSelected;
      break;
  }

  const handleProyects = () => {
    router.push('/dashboard')
  }

  const handleClasses = () => {
    
  }

  const handleUser = () => {
    
  }

  return (
    <div className={style.bar}>
      <Image className={style.logo} src={logoSVG} alt="logo" />
      <div className={style.options}>
        <button className={classProyect} onClick={handleProyects}>Proyectos</button>
        <button className={classClass} onClick={handleClasses}>Clases</button>
      </div>
      <button className={style.userBtn} onClick={handleUser}>
        <Image src={userSVG} alt="user" className={style.user}/>
      </button>
    </div>
  );
}

export default NavBar;
