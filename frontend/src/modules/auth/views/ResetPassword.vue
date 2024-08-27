<!-- modules/auth/views/ResetPassword.vue -->

<template>
  <div class="reset-password">
    <h1>Restablecer Contraseña</h1>
    <form @submit.prevent="handleResetPassword">
      <div class="form-group">
        <label for="email">Email:</label>
        <input v-model="email" type="email" id="email" required />
      </div>
      <button type="submit" :disabled="loading">Restablecer Contraseña</button>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
    <router-link to="/auth/login">Volver al inicio de sesión</router-link>
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
.reset-password {
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
