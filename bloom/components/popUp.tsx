"use client";
import React, { useState } from 'react';
import popupStyle from "../styles/popup.module.scss";

interface PopupProps {
    onConfirm: (dataset: FileList | number) => void;
    onCancel: () => void;
}

const Popup: React.FC<PopupProps> = ({ onConfirm, onCancel }) => {
    const [selectedDataset, setSelectedDataset] = useState<number | null>(null);
    const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
    const [selectedButton, setSelectedButton] = useState<number | null>(null);

    const handleConfirm = () => {
        if (selectedFiles) {
            onConfirm(selectedFiles);
        } else if (selectedDataset) {
            onConfirm(selectedDataset);
        }
    };

    const onDatasetClick = (dataset: number) => {
        setSelectedDataset(dataset);
        setSelectedFiles(null);
        setSelectedButton(dataset);
    };

    return (
        <>
            <div className={popupStyle.overlay} onClick={onCancel} />
            <div className={popupStyle.wrapper}>
                <h1 className={popupStyle.tittle}>Seleccionar DataSet</h1>

                <div className={popupStyle.optionsWrapper}>
                    
                    <div className={popupStyle.segmentPredefined}>
                        <div className={popupStyle.nombreWrap}>
                            <p className={popupStyle.nombre}>Predeterminados</p>
                        </div>
                        <div className={popupStyle.predeterminados}>
                            <button
                              className={`${popupStyle.btn} ${selectedButton === 1 ? popupStyle.clicked : ''}`}
                              onClick={() => onDatasetClick(1)}
                            >DataSet 1</button>
                            <button
                              className={`${popupStyle.btn} ${selectedButton === 2 ? popupStyle.clicked : ''}`}
                              onClick={() => onDatasetClick(2)}
                            >DataSet 2</button>
                            <button
                              className={`${popupStyle.btn} ${selectedButton === 3 ? popupStyle.clicked : ''}`}
                              onClick={() => onDatasetClick(3)}
                            >DataSet 3</button>
                        </div>
                    </div>

                    <div className={popupStyle.segmentUpload}>
                        <div className={popupStyle.nombreWrap}>
                            <p className={popupStyle.nombre}>Subir Archivo</p>
                        </div>
                        <div className={popupStyle.uploadWrap}>
                            <button className={popupStyle.uploadButton}>
                                <label className={popupStyle.explorar} htmlFor="fileUpload">Explorar Archivos</label>
                                <input className={popupStyle.input} id="fileUpload" type="file" onChange={(e) => {
                                    setSelectedFiles(e.target.files);
                                    setSelectedDataset(null);
                                    setSelectedButton(null);
                                }} />
                            </button>
                            <span>{selectedFiles ? `"${selectedFiles[0].name}"` : '""'}</span>
                        </div>
                    </div>
                </div>
                <div className={popupStyle.footer}>
                    <button className={popupStyle.confirm} onClick={handleConfirm} disabled={!selectedDataset && !selectedFiles}>Confirmar</button>
                    <button className={popupStyle.cancel} onClick={onCancel}>Cancelar</button>
                </div>
            </div>
        </>
    );
};

export default Popup;
