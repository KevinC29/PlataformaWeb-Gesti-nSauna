<template>
    <!-- Sección Servicios -->
    <section id="services" class="section-services">
        <v-container>
            <h1>Servicios</h1>
            <ServiceSections :sections="sections" />
        </v-container>
    </section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import ServiceSections from '@/components/layout/ServiceSections.vue';
import '@/assets/styles/sectionServices.css';

export default {
    name: 'SectionServicesPage',
    components: {
        ServiceSections,
    },
    computed: {
        ...mapGetters('home', ['sections'])
    },
    methods: {
        ...mapActions('home', ['fetchSections']),
    },
    mounted() {
        this.fetchSections();
    },
};
</script>