<!-- modules/auth/components/ResetPasswordForm.vue -->

<template>
    <div class="reset-password-form">
      <form @submit.prevent="handleResetPassword">
        <div class="form-group">
          <label for="email">Email:</label>
          <input v-model="email" type="email" id="email" required />
        </div>
        <button type="submit" :disabled="loading">Restablecer Contraseña</button>
        <p v-if="error" class="error">{{ error }}</p>
      </form>
    </div>
  </template>
  
  <script>
  import { mapActions, mapGetters } from 'vuex';
  
  export default {
    data() {
      return {
        email: ''
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
      ...mapActions('auth', ['resetPassword']),
      async handleResetPassword() {
        try {
          await this.resetPassword(this.email);
          this.$router.push('/auth/login');
        } catch (error) {
          console.error("Error al restablecer la contraseña:", error);
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .reset-password-form {
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
  