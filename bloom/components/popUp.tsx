"use client";
import React, { useState } from 'react';
import popupStyle from "@styles/popup.module.scss";

interface PopupProps {
    onConfirm: (dataset: number) => void;
    onCancel: () => void;
}

const Popup: React.FC<PopupProps> = ({ onConfirm, onCancel }) => {
    const [selectedDataset, setSelectedDataset] = useState<number | null>(null);
    const [selectedButton, setSelectedButton] = useState<number | null>(null);

    const handleConfirm = () => {
        onConfirm(selectedDataset!);
    };

    const onDatasetClick = (button: number, dataset: number) => {
        setSelectedDataset(dataset);
        setSelectedButton(button);
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
                              onClick={() => onDatasetClick(1, 53)}
                            >Iris</button>
                            <button
                              className={`${popupStyle.btn} ${selectedButton === 2 ? popupStyle.clicked : ''}`}
                              onClick={() => onDatasetClick(2, 109)}
                            >Wine</button>
                            <button
                              className={`${popupStyle.btn} ${selectedButton === 3 ? popupStyle.clicked : ''}`}
                              onClick={() => onDatasetClick(3, 602)}
                            >Dry Bean</button>
                        </div>
                    </div>

                    <div className={popupStyle.segmentUpload}>
                        <div className={popupStyle.nombreWrap}>
                            <p className={popupStyle.nombre}>Subir Archivo</p>
                        </div>
                        <div className={popupStyle.uploadWrap}>
                            <button className={popupStyle.uploadButton}>
                                <label className={popupStyle.explorar} htmlFor="fileUpload">Explorar Archivos</label>
                                <input className={popupStyle.input} id="fileUpload" type="file" />
                            </button>
                            <span>""</span>
                        </div>
                    </div>
                </div>
                <div className={popupStyle.footer}>
                    <button className={popupStyle.confirm} onClick={handleConfirm} disabled={!selectedDataset}>Confirmar</button>
                    <button className={popupStyle.cancel} onClick={onCancel}>Cancelar</button>
                </div>
            </div>
        </>
    );
};

export default Popup;
