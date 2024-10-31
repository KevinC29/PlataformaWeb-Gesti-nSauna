<template>
  <div class="profile-page">
    <!-- Alerta de éxito general -->
    <div class="alert-container">
      <v-alert v-if="successMessage" type="success" class="mt-3" border>
        {{ successMessage }}
      </v-alert>
    </div>

    <!-- Contenedor de perfil -->
    <div class="profile-container">
      <div class="profile-header">Perfil del Usuario</div>
      <v-divider></v-divider>

      <div class="profile-content">
        <div class="profile-item">
          <span class="profile-title">Nombres:</span>
          <span class="profile-subtitle">{{ user.name }}</span>
        </div>
        <div class="profile-item">
          <span class="profile-title">Apellidos:</span>
          <span class="profile-subtitle">{{ user.lastName }}</span>
        </div>
        <div class="profile-item">
          <span class="profile-title">DNI:</span>
          <span class="profile-subtitle">{{ user.dni }}</span>
        </div>
        <div class="profile-item">
          <span class="profile-title">Email:</span>
          <span class="profile-subtitle">{{ user.email || 'N/A' }}</span>
        </div>
      </div>

      <!-- Botón para Editar Perfil -->
      <div class="profile-actions">
        <v-btn class="custom-edit-btn" @click="navigateToEdit">
          Editar Perfil
        </v-btn>
      </div>
    </div>

    <!-- Error de carga -->
    <div class="alert-container">
      <v-alert v-if="errorMessage" type="error" class="mt-3">
        {{ errorMessage }}
      </v-alert>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import '@/assets/styles/buttons.css';
import '@/assets/styles/profile.css';

export default {
  data() {
    return {
      errorMessage: '',
      successMessage: '',
    };
  },
  computed: {
    ...mapGetters('credential', ['user', 'error', 'success']),
  },
  methods: {
    ...mapActions('credential', ['fetchAndSetUser']),
    formattedError(error, message) {
      this.errorMessage = error || message;
      setTimeout(() => {
        this.errorMessage = '';
      }, 2000);
    },
    formattedSuccess(success, message) {
      this.successMessage = success || message;
      setTimeout(() => {
        this.successMessage = '';
      }, 2000);
    },
    navigateToEdit() {
      this.$router.push({ name: 'CredentialEdit', params: { id: this.user.credentialId } });
    },

    async fetchUserProfile() {
      try {
        await this.fetchAndSetUser();
        this.formattedSuccess(`Bienvenido ${this.user.name}`, this.success);
      } catch (error) {
        this.formattedError(this.error, "Error al cargar los datos");
      }
    },
  },
  async created() {
    await this.fetchUserProfile();
  },
};
</script>