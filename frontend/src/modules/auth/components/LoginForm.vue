<!-- modules/auth/components/LoginForm.vue -->

<template>
    <div class="login-form">
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">Email:</label>
          <input v-model="email" type="email" id="email" required />
        </div>
        <div class="form-group">
          <label for="password">Contraseña:</label>
          <input v-model="password" type="password" id="password" required />
        </div>
        <button type="submit" :disabled="loading">Iniciar Sesión</button>
        <p v-if="error" class="error">{{ error }}</p>
      </form>
    </div>
  </template>
  
  <script>
  import { mapActions, mapGetters } from 'vuex';
  
  export default {
    data() {
      return {
        email: '',
        password: ''
      };
    },
    computed: {
      ...mapGetters('auth', ['isLoading', 'authError']),
      loading() {
        return this.isLoading;
      },
      error() {
        return this.authError;
      }
    },
    methods: {
      ...mapActions('auth', ['login']),
      async handleLogin() {
        try {
          await this.login({ email: this.email, password: this.password });
          this.$router.push('/dashboard');
        } catch (error) {
          console.error("Error en el login:", error);
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .login-form {
    max-width: 400px;
    margin: auto;
    padding: 20px;
  }
  .form-group {
    margin-bottom: 15px;
  }
  .error {
    color: red;
  }
  </style>
  