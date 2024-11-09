import React from 'react';
import style from '@styles/bloque.module.scss';
import Image from 'next/image';
import masSVG from '@public/mas.svg';
import PopUp from '@components/arguments';
import { useState } from 'react';
import { BlockInstance, Argument } from '@/pages/proyecto/[id]';

interface BloqueProps {
  block: BlockInstance;
  isInBlockList: boolean;
  isInCanvas: boolean;
  onSave: (args: Argument[]) => void;
}

const Bloque: React.FC<BloqueProps> = ({ block, isInBlockList, isInCanvas, onSave }) => {
  const [showPopup, setShowPopup] = useState(block.args.some(x => isInCanvas && x.default === undefined && x.value === undefined));

  const handleMoreClick = () => {
    setShowPopup(true);
  };

  return (
    <div className={style.container}>
      <div className={style.bloque}>
        <p className={style.name}>{block.visualName}</p>
        {isInCanvas && block.args.length > 0 && (
          <button className={style.mas} onClick={handleMoreClick}>
            <Image src={masSVG} alt="more" width={15} height={15} />
          </button>
        )}
      </div>
      {isInBlockList && (
        <div className={style.expContainer}>
          <p className={style.exp}>{block.exp}</p>
        </div>
      )}
      {showPopup && (
        <PopUp block={block} onClose={() => setShowPopup(false)} onSave={onSave} />
      )}
    </div>
  );
};

export default Bloque;
