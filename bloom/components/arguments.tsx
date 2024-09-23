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

  const handleVectorChange = (index: number, value: any, i: number) => {
    const newArgs = [...args];
    if (!newArgs[index].value)
      newArgs[index].value = newArgs[index].type === '[number, number]' ? [0, 0] : [0, 0, 0];
    (newArgs[index].value as [number, number]|[number, number, number])[i] = value;
    setArgs(newArgs);
  };

  const handleSave = () => {
    const isValid = args.every(arg => {
      if (arg.type === 'number') {
        return !isNaN(Number(arg.value));
      }
      return true;
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
            {
              arg.type === 'select' ? (
                <select
                  className={style.input}
                  required={null !in (arg.values as (string | null)[])}
                  onChange={(e) => handleChange(index, e.target.value)}
                  value={(arg.default as string|null) ?? ''}
                >
                  {(arg.values! as (string | null)[]).map((value, i) => (
                    <option value={value ?? ''} key={i}>{value ?? 'null'}</option>
                  ))}
                </select>
              ) : arg.type.startsWith('[') ? arg.type.split(",").map((_, i) => (
                <input
                  placeholder='-'
                  className={style.input}
                  type='number'
                  onChange={(e) => handleVectorChange(index, e.target.value, i)}
                />
              )) : (
                <input
                  placeholder='---'
                  className={style.input}
                  type={arg.type}
                  onChange={(e) => handleChange(index, e.target.value)}
                  value={arg.type !== 'checkbox' ? arg.default as undefined|null|string|number ?? '' : undefined}
                  checked={arg.type === 'checkbox' ? (arg.default as boolean | null) ?? false : undefined}
                />
              )
            }
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
