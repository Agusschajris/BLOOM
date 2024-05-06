# BLOOM

## Introducción

Bloom es una herramienta que facilita la enseñanza y aprendizaje de un concepto tán complicado como el de Machine Learning. Queremos facilitarle, tanto a profesores como a estudiantes, una manera más amigable para adentrarse en este concepto. Para ello, hacemos uso de recursos visuales para simplificar el entendimiento de los conceptos abstractos del tema.

## Problematica

A la hora de aprender a programar, lanzarse directo a aprender líneas de código puede resultar confuso para quienes carecen de conocimiento en el área, por eso es útil Scratch. Esta herramienta resulta una excelente introducción a la lógica de la programación, porque deja comprender los fundamentos de la programación de forma visual, eliminando la complejidad del código. Esto está probado por la Universidad de Harvard en su curso introductorio a la programación CS50.

Esta misma situación se replica en el área de Machine Learning, a las personas les resulta difícil comprender su funcionamiento cuando se lanzan directamente a líneas de código, independientemente de que dichas personas sepan programar o no.

Hicimos algunas encuestas a jóvenes y profesores de la escuela secundaria y nivel universitario que recibieron más de 50 respuestas, por lo que podemos afirmar:

- El 87,5% no sabe sobre Machine Learning y prefiere aprender con la ayuda de una app educativa.
- El 83,3% piensa que Scratch es una buena herramienta para entrar al mundo de la programación.
- El 54,5% se sentiría más cómodo ante una interfaz gráfica para el aprendizaje de Inteligencia Artificial.

## Objetivos

- Enseñanza facilitada
- Aprendizaje amigable
- Educación simplificada

## Solución

Proponemos crear una aplicación web al estilo de Tinkercad y Scratch, pero dirigida a Machine Learning, con un editor gráfico que permita replicar la funcionalidad de algunas librerías más usadas para hacer modelos predictivos o redes neuronales, tales como Scikit-Learn y Tensor Flow.

Cada usuario podrá crear varios proyectos, para los que podrá elegir uno de varios datasets predeterminados (o uno propio) en el cual se podrá basar para desarrollar su modelo. Una vez dentro del proyecto, el usuario podrá armar su modelo con una suerte de “bloques” que va a poder encontrar en un catálogo, funcionando como líneas de código (el formato de bloques podría variar). En una solapa  al costado, el usuario tendrá una “doble visualización” de los “bloques” y el código generado al que estos hacen referencia. Una vez terminado el modelo, el usuario podrá exportar el código en formato de Jupyter notebook a Google Colab, o descargarlo para correrlo de forma local.

Además, cada profesor podrá crear clases para sus alumnos. Allí podrá redactar explicaciones y dar consignas para tareas que los alumnos podrán entregar. Esta sección tendrá un sistema de auto corrección donde el profesor limitará los bloques que podrán usar los alumnos y definirá la/las respuestas correctas.

## Usuarios

- Estudiantes secundarios y universitarios interesados en el área de tecnología, independientemente de sus conocimientos previos sobre programación.
- Profesores de los niveles  secundario o universitario en el área de la tecnología que quieren presentar y enseñar el concepto de Machine Learning.
