<template>
  <v-app>
    <AppHeader :items="headerItems" />

    <v-main>
      <v-container fluid>
        <section id="inicio">
          <v-container class="d-flex flex-column align-center justify-center text-center" style="min-height: 50vh;">
            <v-sheet class="pa-4" elevation="2" max-width="400">
              <LoginForm />
            </v-sheet>
          </v-container>
        </section>

      </v-container>
    </v-main>

    <AppFooter /> <!-- Uso del componente Footer -->
  </v-app>
</template>
<script>
import LoginForm from '@/modules/auth/components/LoginForm.vue';
import AppHeader from '@/components/layout/Header.vue';
import AppFooter from '@/components/layout/Footer.vue';

export default {
  name: 'AuthLogin',
  components: {
    LoginForm,
    AppHeader,
    AppFooter,
  },
  data() {
    return {
      headerItems: [
        {
          title: 'Inicio',
          disabled: false,
          href: '/home',
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
