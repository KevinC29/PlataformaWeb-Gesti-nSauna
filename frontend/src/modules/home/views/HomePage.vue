<template>
  <v-app>
    <AppHeader :items="headerItems" />

    <v-main>
      <SectionWelcomePage />

      <v-divider></v-divider>

      <SectionBenefitsPage />

      <v-divider></v-divider>

      <SectionServicesPage />

      <v-divider></v-divider>

      <SectionContactsPage />
    </v-main>
    <AppFooter />
  </v-app>
</template>

<script>
import AppHeader from '@/components/layout/Header.vue';
import AppFooter from '@/components/layout/Footer.vue';
import SectionWelcomePage from '@/modules/home/components/sectionWelcomePage.vue';
import SectionServicesPage from '@/modules/home/components/sectionServicesPage.vue';
import SectionBenefitsPage from '@/modules/home/components/sectionBenefitsPage.vue';
import SectionContactsPage from '@/modules/home/components/sectionContactsPage.vue';

export default {
  name: 'HomePage',
  components: {
    AppHeader,
    AppFooter,
    SectionWelcomePage,
    SectionServicesPage,
    SectionBenefitsPage,
    SectionContactsPage
  },
  data() {
    return {
      headerItems: [
        { title: 'Inicio', disabled: false, href: '#welcome' },
        { title: 'Servicios', disabled: false, href: '#services' },
        { title: 'Beneficios', disabled: false, href: '#benefits' },
        { title: 'Contactos', disabled: false, href: '#contacts' }
      ],
    };
  },
};
</script>