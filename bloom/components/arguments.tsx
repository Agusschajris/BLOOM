import React, { useState } from 'react';
import { ArgumentInstance, BlockInstance } from '../pages/proyecto/[id]';

interface PopupProps {
    block: BlockInstance;
    onClose: () => void;
    onSave: (args: ArgumentInstance[]) => void;
}

const Popup: React.FC<PopupProps> = ({ block, onClose, onSave }) => {
    const [args, setArgs] = useState<ArgumentInstance[]>(block.args);

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
  );
};

export default Popup;
