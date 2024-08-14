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

    const handleConfirm = () => {
        if (selectedFiles) {
            onConfirm(selectedFiles);
        } else if (selectedDataset) {
            onConfirm(selectedDataset);
        }
    };

    return (
        <>
            <div className={popupStyle.overlay} onClick={onCancel} />
            <div className={popupStyle.wrapper}>
                <h1 className={popupStyle.title}>Seleccionar DataSet</h1>

                <div className={popupStyle.optionsWrapper}>
                    <div className={popupStyle.segmentPredefined}>
                        <h1 className={popupStyle.nombre}>Predeterminados</h1>
                        <button className={popupStyle.btn} onClick={() => {
                            setSelectedDataset(1);
                            setSelectedFiles(null);
                        }}>DataSet 1</button>
                        <button className={popupStyle.btn} onClick={() => {
                            setSelectedDataset(2);
                            setSelectedFiles(null);
                        }}>DataSet 2</button>
                        <button className={popupStyle.btn} onClick={() => {
                            setSelectedDataset(3);
                            setSelectedFiles(null);
                        }}>DataSet 3</button>
                    </div>

                    <div className={popupStyle.segmentUpload}>
                        <h1 className={popupStyle.nombre}>Subir Archivo</h1>
                        <button className={popupStyle.uploadButton}>
                            <label className={popupStyle.explorar} htmlFor="fileUpload">Explorar Archivos</label>
                            <input className={popupStyle.input} id="fileUpload" type="file" onChange={(e) => {
                                setSelectedFiles(e.target.files);
                                setSelectedDataset(null);
                            }} />
                        </button>
                        <span>{selectedFiles ? `"${selectedFiles[0].name}"` : '""'}</span>
                    </div>
                </div>
                <div className={popupStyle.footer}>
                    <button className={popupStyle.cancel} onClick={onCancel}>Cancelar</button>
                    <button className={popupStyle.confirm} onClick={handleConfirm} disabled={!selectedDataset && !selectedFiles}>Confirmar</button>
                </div>
            </div>
        </>
    );
};

export default Popup;
