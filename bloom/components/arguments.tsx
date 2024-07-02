import React, { useState } from 'react';
import { Argument, BlockInstance } from '../pages/proyecto/[id]';
import style from "../styles/arguments.module.scss"

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
        <h2>{block.visualName}</h2>
        {args.map((arg, index) => (
          <div key={arg.argName}>
            <label>{arg.visualName}</label>
            <input
              type={arg.type === 'number' ? 'number' : 'text'}
              onChange={(e) => handleChange(index, e.target.value)}
            />
          </div>
        ))}
        <button onClick={handleSave}>Save</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default Popup;
