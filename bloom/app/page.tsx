import React from 'react';
import { signIn } from "../auth";
import '../styles/landing.css';
import style from "../styles/landing.module.scss"
import logo from "../public/bigLogo.svg"
import Image from 'next/image';
import bloquecitos from "../public/bloquecitos.svg"
import arrow from "../public/arrow.svg"
import aprendizaje from "../public/aprendizaje.svg"
import enseñanza from "../public/enseñanza.svg"
import educacion from "../public/educacion.svg"
import codigo from "../public/Codigo.svg"
import estadistica1 from "../public/87,5.svg"
import estadistica2 from "../public/83.svg"
import estadistica3 from "../public/54.svg"

export default function App() {
  return (
    <div className={style.wrapper}>
    <section className={style.sectionOne}>
      <aside className={style.columnOne}>
        <Image src={logo} alt='BLOOM logo' />
        <p>Lorem ipsum dolor sit amet Egestas consectetur volutpat iaculis proin.</p>
        <form action={async () => {
          "use server"
          await signIn("google", {redirectTo: "/dashboard"});
        }}>
          <button type="submit">
            Ingresa ahora
            <Image src={arrow} alt='flecha'/>
          </button>
        </form>
      </aside>
      <aside className={style.columnTwo}>
        <Image src={bloquecitos} alt='graficos pagina' width={550}/>
      </aside>
    </section>

    <section className={style.sectionTwo}>
      <h1 >Objetivos de BLOOM</h1>
      <div className={style.objetivosWrap}>
        <div className={style.objetivo}>
          <Image src={aprendizaje} alt='aprendizaje'/>
          <h1>Aprendizaje amigable</h1>
          <p>Presentamos un editor gráfico amigable para quienes no se encuentran familiarizados con el campo de la programación.</p>
        </div>
        <div className={style.objetivo}>
          <Image src={enseñanza} alt='enseñanza'/>
          <h1>Enseñanza facilitada</h1>
          <p>Buscamos facilitar al usuario, profesores y estudiantes, una manera más amigable para adentrarse en este concepto.</p>
        </div>
        <div className={style.objetivo}>
          <Image src={educacion} alt='educación'/>
          <h1>Educación agilizada</h1>
          <p>Proporcionamos un espacio donde el profesor podrá asignar tareas a los alumnos y estos puedan resolverlas.</p>
        </div>
      </div>
    </section>

    <section className={style.sectionThree}>
      <div className={style.columnThree}>
        <Image src={codigo} alt='codigo' width={700}/>
      </div>
      <div className={style.columnThree}>
        <h1>Una herramienta mas comoda para el mundo de la Inteligencia Artificial</h1>
        <p>Lorem ipsum dolor sit amet consectetur. Sit orci ornare eget mattis vel elit. Dictum at pharetra nibh sem enim vitae id integer felis.<br/><br/>Sem tristique felis consectetur sociis in. Arcu viverra mattis rhoncus mollis consequat sed lacus eu tincidunt.</p>
      </div>
    </section>

    <section className={style.sectionFour}>
        <h1>Estadisticas</h1>
        <p>Encuestas realizadas por jóvenes y profesores de la escuela secundaria y nivel universitario</p>
        <div className={style.estadisticas}>
          <div className={style.estadistica}>
            <Image src={estadistica1} alt='87,5%'/>
            <p>No saben sobre Machine Learning y prefieren aprender con la ayuda de una app educativa.</p>
          </div>
          <div className={style.estadistica}>
            <Image src={estadistica2} alt='83%'/>
            <p>Piensa que scratch es una buena herramienta para entrar al mundo de la programación.</p>
          </div>
          <div className={style.estadistica}>
            <Image src={estadistica3} alt='54%'/>
            <p>Comodidad ante una interfaz gráfica para el aprendizaje de  Inteligencia Artificial.</p>
          </div>
        </div>
    </section>
    </div>
)
  ;
};

