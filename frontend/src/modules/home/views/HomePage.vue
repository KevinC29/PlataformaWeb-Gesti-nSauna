<template>
  <v-app>
    <AppHeader :items="headerItems" />

    <v-main>
      <v-container fluid>
        <!-- Sección Inicio -->
        <section id="inicio">
          <v-container class="d-flex flex-column align-center justify-center text-center" style="min-height: 100vh;">
            <h1>Inicio</h1>
            <p>Bienvenido a la sección de Inicio.</p>
          </v-container>
        </section>

        <v-divider></v-divider>

        <!-- Sección Servicios -->
        <section id="servicios">
          <v-container fluid class="d-flex flex-column align-center justify-center text-center">
            <h2>Servicios</h2>
            <p>Información sobre nuestros servicios.</p>
            <v-container fluid class="pa-0">
              <v-row>
                <v-col cols="12">
                  <ServiceSections :sections="sections" class="full-width" />
                </v-col>
              </v-row>
            </v-container>
          </v-container>
        </section>

        <v-divider></v-divider>

        <!-- Sección Quienes Somos -->
        <section id="quienes-somos">
          <v-container class="d-flex flex-column align-center justify-center text-center" style="min-height: 100vh;">
            <h2>Quienes Somos</h2>
            <p>Conoce más sobre nosotros.</p>
          </v-container>
        </section>

        <v-divider></v-divider>

        <!-- Sección Contactos -->
        <section id="contactos">
          <v-container class="d-flex flex-column align-center justify-center text-center" style="min-height: 100vh;">
            <h2>Contactos</h2>
            <p>Información de contacto.</p>
          </v-container>
        </section>
      </v-container>
    </v-main>

    <AppFooter /> <!-- Uso del componente Footer -->
  </v-app>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import AppHeader from '@/components/layout/Header.vue';
import AppFooter from '@/components/layout/Footer.vue';
import ServiceSections from '@/components/layout/ServiceSections.vue'; // Asegúrate de que la ruta sea correcta

export default {
  name: 'HomePage',
  components: {
    AppHeader,
    AppFooter,
    ServiceSections
  },
  computed: {
    ...mapGetters('home', ['sections']) // Mapear getter del store
  },
  methods: {
    ...mapActions('home', ['fetchSections']) // Mapear acción del store
  },
  mounted() {
    this.fetchSections(); // Obtener datos cuando el componente se monte
  },
  data() {
    return {
      headerItems: [
        {
          title: 'Inicio',
          disabled: false,
          href: '#inicio',
        },
        {
          title: 'Servicios',
          disabled: false,
          href: '#servicios',
        },
        {
          title: 'Quienes Somos',
          disabled: false,
          href: '#quienes-somos',
        },
        {
          title: 'Contactos',
          disabled: false,
          href: '#contactos',
        },
      ],
    };
  },
};
</script>

<style scoped>
.full-width {
  width: 100%;
}
</style>
