"use client";
import React, { useState, useEffect } from 'react';
import popupStyle from "@styles/popup.module.scss";
import DatasetOption, { DatasetOptionProps } from './dataset';

interface PopupProps {
    onConfirm: (dataset: number, projectName: string) => void;
    onCancel: () => void;
}

const Popup: React.FC<PopupProps> = ({ onConfirm, onCancel }) => {
    const [selectedDataset, setSelectedDataset] = useState<number | null>(null);
    const [selectedButton, setSelectedButton] = useState<number | null>(null);
    const [projectName, setProjectName] = useState<string>("");
    const [datasets, setDatasets] = useState<DatasetOptionProps[]>([]);

    useEffect(() => {
        // Llamada para obtener los datasets
    }, []);
    
    const handleConfirm = () => {
        if (selectedDataset && projectName) {
            onConfirm(selectedDataset, projectName);
        }
    };

    const onDatasetClick = (button: number, dataset: number) => {
        setSelectedDataset(dataset);
        setSelectedButton(button);
    };

    return (
        <>
            <div className={popupStyle.overlay} onClick={onCancel} />
            <div className={popupStyle.wrapper}>
                <h1 className={popupStyle.tittle}>Crear proyecto</h1>
                <label className={popupStyle.label} htmlFor="projectName">Nombre</label>
                <input className={popupStyle.inputName} id="projectName" type="text" value={projectName} placeholder='proyecto inicial' onChange={(e) => setProjectName(e.target.value)}/>

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
                            <p className={popupStyle.nombre}>Ver más Datasets</p>
                        </div>
                        <div className={popupStyle.uploadWrap}>
                        {datasets.map((dataset, index) => ( <DatasetOption key={index} name={dataset.name} link={new URL(dataset.link)}/>))}
                        </div>
                    </div>
                </div>
                <div className={popupStyle.footer}>
                    <button className={popupStyle.confirm} onClick={handleConfirm} disabled={!selectedDataset || !projectName}>Confirmar</button>
                    <button className={popupStyle.cancel} onClick={onCancel}>Cancelar</button>
                </div>
            </div>
        </>
    );
};

export default Popup;
