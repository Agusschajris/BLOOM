import React, { useState } from 'react';
import {Argument, ArgValue, BlockInstance} from '@lib/blockydata';
import style from "@styles/arguments.module.scss";
import ticSVG from "@public/tic.svg";
import Image from 'next/image';

interface PopupProps {
  block: BlockInstance;
  onClose: () => void;
  onSave: (args: Argument[]) => void;
}

const Popup: React.FC<PopupProps> = ({ block, onClose, onSave }) => {
  const [args, setArgs] = useState<Argument[]>(block.args);

  const handleChange = (index: number, value: ArgValue) => {
    if (value === undefined) return;
    const newArgs = [...args];
    if (newArgs[index].values === 'N' || newArgs[index].values === 'Z')
      value = Math.floor(value as number);
    else if (value === '')
      value = null;
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
      return arg.default !== undefined || arg.value !== undefined;
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
          <button className={style.save} onClick={handleSave/*onClose*/}>
            <Image src={ticSVG} alt="close" width={20} height={16}/>
          </button>
        </div>
        {args.map((arg, index) => (
          <div className={style.argWrapper} key={arg.argName}>
            <label className={style.argName}>{arg.visualName}</label>
            {
              arg.type === 'select' ? (
                <select
                  className={style.input}
                  required={null ! in (arg.values as (string | null)[])}
                  onChange={(e) => handleChange(index, e.target.value)}
                  value={((arg.default !== undefined && arg.value === undefined) ? arg.default : arg.value) as string | null ?? ''}
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
                  onChange={(e) => handleChange(index, arg.type !== 'checkbox' ? e.target.value : e.target.checked)}
                  value={arg.type === 'checkbox' ? undefined : (arg.default !== undefined && arg.value === undefined ? arg.default : arg.value) as undefined | string | number}
                  checked={arg.type !== 'checkbox' ? undefined : (arg.value === undefined ? arg.default : arg.value) as boolean}
                  min={arg.values === 'N' ? 1 : arg.values === "%" ? 0 : undefined}
                  step={(arg.values === 'N' || arg.values === 'Z') ? 1 : undefined}
                  max={arg.values === '%' ? 1 : undefined}
                />
              )
            }
          </div>
        ))}
      </div>
    </div>
  );
};

export default Popup;
