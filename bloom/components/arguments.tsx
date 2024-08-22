import React, { useState } from 'react';
import { Argument, BlockInstance } from '../pages/proyecto/[id]';
import style from "../styles/arguments.module.scss"
import closeSVG from "../public/close.svg"
import ticSVG from "../public/tic.svg"
import Image from 'next/image';

interface PopupProps {
    block: BlockInstance;
    onClose: () => void;
    onSave: (args: Argument[]) => void;
}

const Popup: React.FC<PopupProps> = ({ block, onClose, onSave }) => {
    const [args, setArgs] = useState<Argument[]>(block.args);

    const handleChange = (index: number, value: any) => {
        const newArgs = [...args];
        newArgs[index].value = value;
        setArgs(newArgs);
    };

    const handleSave = () => {
        const isValid = args.every(arg => {
            if (arg.type === 'number') {
                return !isNaN(Number(arg.value));
            }
                 true;
            });
        
            if (isValid) {
                onSave(args);
                onClose();
            } else {
                alert('Invalid values');
        }
    };

  return (
    <div>
      <div className={style.overlay}></div>
      <div className={style.popUp}>
        <div className={style.header}>
          <h1>{block.visualName}</h1>
          <button className={style.cancel} onClick={onClose}>
                    <Image src={closeSVG} alt="close" width={15} height={15} />
          </button>
        </div>
        {args.map((arg, index) => (
          <div className={style.argWrapper} key={arg.argName}>
            <label className={style.argName} >{arg.visualName}</label>
            <input
              placeholder='---'
              className={style.input}
              type={arg.type === 'number' ? 'number' : 'text'}
              onChange={(e) => handleChange(index, e.target.value)}
            />
          </div>
        ))}
        <button className={style.save} onClick={handleSave}>
          <Image src={ticSVG} alt='save' width={15} height={15}/>
        </button>
      </div>
    </div>
  );
};

export default Popup;
