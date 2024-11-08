<template>
  <!-- Sección Inicio -->
  <section id="welcome" class="section-welcome">
    <!-- Contenedor Izquierdo -->
    <v-container class="contenedor-izquierdo">
      <h1 class="titulo">Bienvenido</h1>
      <p class="descripcion">El vapor de la molienda abre sus puertas a todo publico,
        donde podras disfrutar de diferentes servicios,
        como alimentación, deporte y su principal actividad, disfrutar de sus baños naturales a vapor.</p>
    </v-container>

    <!-- Contenedor Derecho (Video) -->
    <v-container class="contenedor-video">
      <video class="video" controls>
        <source type="video/mp4" src="/video.mp4">
      </video>
    </v-container>

    <!-- Burbujas -->
    <div v-for="n in 10" :key="n" :class="`burbuja burbuja-${n}`"></div>
  </section>
</template>


<script>
import '@/assets/styles/sectionWelcome.css';

export default {
  name: 'SectionWelcomePage',
};
</script>