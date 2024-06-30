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
    case "/":
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

  const handleUser = () => {
    
  }

  return (
    <div className={style.bar}>
      <Image src={logoSVG} alt="logo" width={10} height={5} />
      <div className={style.options}>
        <button className={classProyect}>Proyectos</button>
        <button className={classClass}>Clases</button>
      </div>
      <button className={style.userBtn} onClick={handleUser}>
        <Image src={userSVG} alt="user" width={5} height={5} />
      </button>
    </div>
  );
}

export default NavBar;
