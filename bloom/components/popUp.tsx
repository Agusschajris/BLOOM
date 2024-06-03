"use client";
import React, { useState } from 'react';
import popupStyle from "../styles/popup.module.scss";
import proyectoStyle from "../styles/proyecto.module.scss";

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
        //fetch para cuando se sube un dataset/file
        onConfirm(selectedFiles); 
      } else if (selectedDataset) {
        //fetch para cuando se selecciona uno de los datasets predeterminados
        onConfirm(selectedDataset); 
      }
    };
  
    return (
      <div className="popup">
        <h2 className={popupStyle.popupContent}>Seleccionar Dataset</h2>
          <div className={popupStyle.popupContent}>
              <div className={popupStyle.segmentPredefined}>
                <label>Defaults:</label>
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
              </div>
              <div className={popupStyle.segmentUpload}>
                  <label>Subir Archivo</label>
                  <input type="file" onChange={(e) => {
                      setSelectedFiles(e.target.files);
                      setSelectedDataset(null); // Pongo en null los datasets presubidos
                    }}
                  />
              </div>
          </div>
          <div className={popupStyle.popupContent}>
            <button className={proyectoStyle.export} onClick={handleConfirm}>Confirmar</button>
            <button className={proyectoStyle.export} onClick={onCancel}>Cancelar</button>
          </div>
      </div>
    );
  };
  
  export default Popup;