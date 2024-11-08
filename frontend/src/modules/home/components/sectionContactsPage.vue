<template>
    <!-- Sección Contactos -->
    <section id="contacts" class="section-contacts">
        <!-- Contenedor de Ubicación -->
        <v-container class="section-left">
            <div class="content">
                <h1>Ubicación</h1>
                <div class="map-container">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1717.9630279671683!2d-79.38637014345001!3d-4.004543397611247!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9034cb8c51ffbf8d%3A0xbd544988ceb7b7d5!2sEl%20Vapor%20de%20La%20Molienda!5e1!3m2!1sen!2sau!4v1731003110063!5m2!1sen!2sau"
                        width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy"
                        referrerpolicy="no-referrer-when-downgrade"></iframe>
                </div>
            </div>
        </v-container>

        <!-- Contenedor de Contactos y Horarios -->
        <v-container class="section-right">
            <div class="content">
                <h1>Contactos</h1>
                <ul class="contact-list">
                    <li><v-icon left class="mr-2" icon="mdi-email"></v-icon>Email: xavi.greengreen@gmail.com</li>
                    <li><v-icon left class="mr-2" icon="mdi-phone"></v-icon>Teléfono: 0985430929 - 0999474537</li>
                    <li><v-icon left class="mr-2" icon="mdi-map-marker"></v-icon>Dirección: Catamayo, La vega - Vía al
                        tingo.</li>
                </ul>

                <h1>Horarios de Atención</h1>
                <ul class="hours-list">
                    <li><v-icon left class="mr-2" icon="mdi-calendar-clock"></v-icon>Miércoles: 15:00 AM - 8:30 PM</li>
                    <li><v-icon left class="mr-2" icon="mdi-calendar-clock"></v-icon>Viernes: 15:00 AM - 8:30 PM</li>
                    <li><v-icon left class="mr-2" icon="mdi-calendar-clock"></v-icon>Sábado: 12:00 AM - 8:30 PM</li>
                    <li><v-icon left class="mr-2" icon="mdi-calendar-clock"></v-icon>Domingo: 10:00 AM - 8:30 PM</li>
                </ul>
            </div>
        </v-container>
    </section>
</template>

<script>
import '@/assets/styles/sectionContacts.css';

export default {
    name: 'SectionContactsPage',
}
</script>