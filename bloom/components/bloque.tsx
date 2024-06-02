"use client"
import React from "react"
import { motion } from 'framer-motion';
import style from '../styles/bloque.module.scss'

interface BloqueProps {
    name: string
    exp: string
}

const Bloque: React.FC<BloqueProps> = (props) => {
    return (
        <div className={style.container}>    
            <motion.div drag className={style.bloque} >
                <p className={style.name}>{props.name}</p>
            </motion.div>
            <span className={style.span}>{props.exp}</span>
        </div>
    )
}

export default Bloque