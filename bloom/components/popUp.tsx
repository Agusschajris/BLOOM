"use client";
import React, { useState } from 'react';

//Defino las props que quiero que reciba el PopUp
//Tomara una file subida o un string del dataset predeterminado (hablar con agus para ver como se maneja el dataset)
interface PopupProps {
    onConfirm: (dataset: FileList | string) => void;
    onCancel: () => void;
}

const Popup: React.FC<PopupProps> = ({ onConfirm, onCancel }) => {
    const [selectedDataset, setSelectedDataset] = useState<string | null>(null); // Dataset seleccionado
    const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null); // Archivos seleccionados
  
    const handleConfirm = () => {
      if (selectedFiles) {
        //
        onConfirm(selectedFiles); // Si se selecciono un archivo, lo envio
      } else if (selectedDataset) {
        onConfirm(selectedDataset); // Si se selecciono un dataset, lo envio
      }
    };
  
    return (
      <div className="popup">
        <h2>Seleccionar Dataset</h2>
        <label>
          Dataset 1
          <input type="radio" name="dataset" value="dataset1" onChange={() => {
              setSelectedDataset('dataset1');
              setSelectedFiles(null); // Verifico que no haya archivos seleccionados
            }}/>
        </label>
        <label>
          Dataset 2
          <input type="radio" name="dataset" value="dataset2" onChange={() => {
              setSelectedDataset('dataset2');
              setSelectedFiles(null); // Verifico que no haya archivos seleccionados
            }}/>
        </label>
        <label>
          Subir Archivo
          <input type="file" onChange={(e) => {
              setSelectedFiles(e.target.files);
              setSelectedDataset(null); // Pongo en null los datasets presubidos
            }}
          />
        </label>
        <button onClick={handleConfirm}>Confirmar</button>
        <button onClick={onCancel}>Cancelar</button>
      </div>
    );
  };
  
  export default Popup;