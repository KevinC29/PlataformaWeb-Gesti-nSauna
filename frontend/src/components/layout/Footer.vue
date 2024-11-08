<template>
  <v-footer class="custom-footer text-center d-flex flex-column">
    <div class="icon-container rounded-pill mx-auto">
      <v-btn class="mx-4 facebook-btn" variant="text" icon="mdi-facebook"></v-btn>
      <v-btn class="mx-4 twitter-btn" variant="text" icon="mdi-twitter"></v-btn>
      <v-btn class="mx-4 whatsapp-btn" variant="text" icon="mdi-whatsapp"></v-btn>
      <v-btn class="mx-4 instagram-btn" variant="text" icon="mdi-instagram"></v-btn>
    </div>

    <div class="d-flex flex-wrap justify-between flex-grow-1 pt-2">
      <div class="services-container">
        <h4>Servicios</h4>
        <ul>
          <li><v-icon left class="mr-2" icon="mdi-smoke"></v-icon>Baños a Vapor</li>
          <li><v-icon left class="mr-2" icon="mdi-shower"></v-icon>Terapias de Hielo</li>
          <li><v-icon left class="mr-2" icon="mdi-hand-clap"></v-icon>Masajes</li>
          <li><v-icon left class="mr-2" icon="mdi-food"></v-icon>Alimentación</li>
          <li><v-icon left class="mr-2" icon="mdi-volleyball"></v-icon>Cancha de Voli</li>
          <li><v-icon left class="mr-2" icon="mdi-swim"></v-icon>Piscina Infantil</li>
        </ul>
      </div>

      <div class="contact-container">
        <h4>Contáctanos</h4>
        <ul>
          <li><v-icon left class="mr-2" icon="mdi-email"></v-icon>Email: xavi.greengreen@gmail.com</li>
          <li><v-icon left class="mr-2" icon="mdi-phone"></v-icon>Teléfono: 0985430929 - 0999474537</li>
          <li><v-icon left class="mr-2" icon="mdi-map-marker"></v-icon>Dirección: La vega - Vía al tingo.</li>
        </ul>
      </div>

      <div class="hours-container">
        <h4>Horarios de Atención</h4>
        <ul>
          <li><v-icon left class="mr-2" icon="mdi-calendar-clock"></v-icon>Miércoles: 15:00 AM - 8:30 PM</li>
          <li><v-icon left class="mr-2" icon="mdi-calendar-clock"></v-icon>Viernes: 15:00 AM - 8:30 PM</li>
          <li><v-icon left class="mr-2" icon="mdi-calendar-clock"></v-icon>Sábado: 12:00 AM - 8:30 PM</li>
          <li><v-icon left class="mr-2" icon="mdi-calendar-clock"></v-icon>Domingo: 10:00 AM - 8:30 PM</li>
        </ul>
      </div>
    </div>

    <v-divider></v-divider>

    <div>
      <strong>© El Vapor de la Molienda — {{ currentYear }}.</strong>
    </div>
  </v-footer>
</template>

<script>
import '@/assets/styles/footer.css';

export default {
  name: 'AppFooter',
  data() {
    return {
      currentYear: new Date().getFullYear(),
    };
  },
};
</script>