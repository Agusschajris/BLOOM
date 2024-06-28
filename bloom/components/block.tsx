  import React from 'react';
  import style from '../styles/bloque.module.scss';
  import Image from 'next/image';
  import masSVG from '../public/mas.svg';

  interface BloqueProps {
    name: string;
    exp: string;
    isInBlockList: boolean;
    isInCanvas: boolean;
  }

  const Bloque: React.FC<BloqueProps> = (props) => {
    return (
      <div className={style.container}>
        <div className={style.bloque}>
          <p className={style.name}>{props.name}</p>
          {props.isInCanvas && (
            <button className={style.mas}><Image src={masSVG} alt="more" width={15} height={15} /></button>
          )}
        </div>

          {props.isInBlockList && (
            <div className={style.expContainer}>
              <p className={style.exp}>{props.exp}</p>
            </div>
          )}
      </div>
    );
  };

  export default Bloque;
