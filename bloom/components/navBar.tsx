import React, {useEffect, useState} from 'react';
import { useRouter } from 'next/router';
import style from '@styles/navBar.module.scss';
import Image from 'next/image';
import logoSVG from '@public/logo.svg';
import userSVG from '@public/user.svg';
import { signOut } from 'next-auth/react';

const NavBar: React.FC = () => {
  const router = useRouter();
  const { pathname } = router;
  const [userPfp, setUserPfp] = useState<string | null>(null);
  
  let classProyect = "";
  let classClass = "";

  switch (pathname) {
    case "/dashboard":
      classProyect = style.selected;
      classClass = style.notSelected;
      break;
    case "/classes":
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
    router.push('/classes')
  }

  const handleUser = () => {
    signOut({redirectTo: "/"}).then();
  }

  useEffect(() => {
    fetch("/api/auth/profile", {
      method: "GET",
    }).then(response => {
      response.json().then(data => setUserPfp(data.image ?? null));
    });
  }, []);

  return (
    <div className={style.bar}>
      <Image className={style.logo} src={logoSVG} alt="logo" />
      <div className={style.options}>
        <button className={classProyect} onClick={handleProyects}>Proyectos</button>
        <button className={classClass} onClick={handleClasses}>Clases</button>
      </div>
      <button className={style.userBtn} onClick={handleUser}>
        <Image src={userPfp ?? userSVG} alt="user" className={style.user} width={30} height={30} />
      </button>
    </div>
  );
}

export default NavBar;
