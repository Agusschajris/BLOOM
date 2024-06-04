"use client";
import React, { useState } from 'react';
import popupStyle from "../styles/popup.module.scss";

interface PopupProps {
    onConfirm: (dataset: FileList | string) => void;
    onCancel: () => void;
}

const Popup: React.FC<PopupProps> = ({ onConfirm, onCancel }) => {
    const [selectedDataset, setSelectedDataset] = useState<string | null>(null);
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
                <h1 className={popupStyle.tittle}>Seleccionar Dataset</h1>
                <div className={popupStyle.optionsWrapper}>
                    <div className={popupStyle.segmentPredefined}>
                        <h1>Predeterminados</h1>
                        <label>
                            Dataset 1
                            <input type="radio" name="dataset" value="dataset1" onChange={() => {
                                setSelectedDataset('dataset1');
                                setSelectedFiles(null);
                            }} />
                        </label>
                        <label>
                            Dataset 2
                            <input type="radio" name="dataset" value="dataset2" onChange={() => {
                                setSelectedDataset('dataset2');
                                setSelectedFiles(null);
                            }} />
                        </label>
                    </div>
                    <div className={popupStyle.segmentUpload}>
                        <h1>Subir Archivo</h1>
                        <input type="file" onChange={(e) => {
                            setSelectedFiles(e.target.files);
                            setSelectedDataset(null);
                        }} />
                    </div>
                </div>
                <div className={popupStyle.footer}>
                    <button className={popupStyle.cancel} onClick={onCancel}>Cancelar</button>
                    <button className={popupStyle.confirm} onClick={handleConfirm}>Confirmar</button>
                </div>
            </div>
        </>
    );
};

export default Popup;
