<template>
  <v-sheet class="mx-auto custom-form" width="400">
    <!-- Título centrado para el formulario -->
    <h2 class="text-center mb-4">Inicio de Sesión</h2>

    <v-form @submit.prevent="handleLogin" ref="form">
      <!-- Título referente al correo -->
      <v-row>
        <v-col cols="12">
          <label for="email" class="field-label">Usuario</label>
          <v-text-field id="email" v-model="email" :rules="emailRules" type="email" variant="outlined" required
            autocomplete="off" rounded append-inner-icon="''" prepend-inner-icon="mdi-account" bg-color="cyan-lighten-5"
            color="#388e3c"></v-text-field>
        </v-col>
      </v-row>

      <!-- Título referente a la contraseña -->
      <v-row>
        <v-col cols="12">
          <label for="password" class="field-label">Contraseña</label>
          <v-text-field id="password" v-model="password" :rules="passwordRules" :type="passwordFieldType"
            variant="outlined" required rounded autocomplete="off" prepend-inner-icon="mdi-lock"
            bg-color="cyan-lighten-5" color="#388e3c"
            :append-inner-icon="passwordFieldType === 'password' ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="togglePasswordVisibility"></v-text-field>
        </v-col>
      </v-row>

      <!-- Botón de login -->
      <v-btn class="mt-4 custom-login-btn" type="submit" block rounded="lg">
        <v-icon left class="mr-2" icon="mdi-login"></v-icon>
        Iniciar Sesión
      </v-btn>

      <!-- Mensaje de error -->
      <v-alert v-if="errorMessage" type="error" class="mt-3">
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
      passwordFieldType: 'password',
      emailRules: [
        v => !!v || 'El correo es requerido',
        v => /.+@.+\..+/.test(v) || 'Email debe ser válido',
      ],
      passwordRules: [
        v => !!v || 'La contraseña es requerida',
        v => v.length >= 6 || 'La contraseña debe tener al menos 6 caracteres',
      ]
    };
  },
  methods: {
    ...mapActions('auth', ['login']),
    async handleLogin() {
      this.errorMessage = ''; // Clear previous error message
      try {
        await this.login({ email: this.email, password: this.password });
        this.$router.push({ name: 'Dashboard' });
      } catch (error) {
        this.errorMessage = 'Error al iniciar sesión, revise sus credenciales';
      }
    },
    togglePasswordVisibility() {
      this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
    },
  }
};
</script>

<style scoped>
.custom-form {
  padding: 30px;
  background: linear-gradient(135deg, #5fe6da, #388e3c);
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  min-height: 400px;
}

.text-center {
  text-align: center;
}

.field-label {
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 5px;
  display: block;
  color: #555;
  text-align: left
}

.custom-login-btn {
  background-color: #388e3c;
  color: white;
  border-radius: 12px;
  padding: 12px;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

.custom-login-btn:hover {
  background-color: #2e7d32;
}

.v-alert {
  font-size: 14px;
}
</style>
