<template>
  <v-app>
    <AppHeader :items="headerItems" />

    <v-main>
      <v-container fluid class="background-container d-flex align-center justify-center">
        <v-alert v-if="sessionExpired" type="warning" class="mb-4">
          Su sesión ha expirado. Por favor, vuelva a iniciar sesión.
        </v-alert>

        <v-sheet class="pa-4 form-container" elevation="2">
          <LoginForm />
        </v-sheet>
      </v-container>
    </v-main>

    <AppFooter />
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
      errorMessage: '',
      headerItems: [
        {
          title: 'Inicio',
          disabled: false,
          onClick: this.handleHome,
        },
      ],
      sessionExpired: false,
    };
  },
  methods: {
    async handleHome() {
      try {
        this.errorMessage = '';
        this.$router.push({ name: 'Home' });
      } catch (error) {
        this.errorMessage = 'Home Failed.';
      }
    }
  },
  created() {
    if (this.$route.query.sessionExpired) {
      this.sessionExpired = true;
    }
  },
};
</script>

<style scoped>
.full-width {
  width: 100%;
}

.background-container {
  background-image: url('@/assets/img/subtle-prism.svg');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.form-container {
  max-width: 400px;
  max-height: 400px;
  background: linear-gradient(135deg, #388e3c, #5fe6da);
  border-radius: 12px;
  margin-bottom: 40px;
}

.v-main {
  flex-grow: 1;
}
</style>
