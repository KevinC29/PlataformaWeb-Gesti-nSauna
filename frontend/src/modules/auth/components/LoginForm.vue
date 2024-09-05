<template>
  <v-sheet class="mx-auto" width="300">
    <v-form @submit.prevent="handleLogin" ref="form">
      <v-text-field
        v-model="email"
        :rules="emailRules"
        label="Correo"
        type="email"
        required
      ></v-text-field>

      <v-text-field
        v-model="password"
        :rules="passwordRules"
        label="Contraseña"
        type="password"
        required
      ></v-text-field>

      <v-btn class="mt-2" type="submit" block>Login</v-btn>

      <v-alert
        v-if="errorMessage"
        type="error"
        class="mt-3"
      >
        {{ errorMessage }}
      </v-alert>
    </v-form>
  </v-sheet>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      email: '',
      password: '',
      errorMessage: '',
      emailRules: [
        v => !!v || 'El correo es requerido',
        v => /.+@.+\..+/.test(v) || 'Email must be valid',
      ],
      passwordRules: [
        v => !!v || 'La contraseña es requerida',
        v => v.length >= 6 || 'Password must be at least 6 characters long',
      ]
    };
  },
  methods: {
    ...mapActions('auth', ['login']),
    async handleLogin() {
      this.errorMessage = ''; // Clear previous error message
      try {
        console.log("Attempting to login with:", { email: this.email, password: this.password });
        await this.login({ email: this.email, password: this.password });
        this.$router.push({ name: 'Dashboard' });
      } catch (error) {
        console.error("Login failed:", error); // Añade un log para errores
        this.errorMessage = 'Login failed. Please check your credentials.';
      }
    }
  }

};
</script>

<style scoped>
/* Puedes agregar estilos personalizados aquí */
</style>
