<template>
  <div class="profile-page">
    <!-- Alerta de éxito general -->
    <div class="alert-container">
      <v-alert v-if="successMessage" type="success" dismissible>
        {{ successMessage }}
      </v-alert>
    </div>

    <v-card class="mx-auto" max-width="600">
      <v-card-title class="headline">Perfil del Usuario</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title><strong>Nombre:</strong></v-list-item-title>
            <v-list-item-subtitle>{{ user.name }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title><strong>Apellido:</strong></v-list-item-title>
            <v-list-item-subtitle>{{ user.lastName }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title><strong>DNI:</strong></v-list-item-title>
            <v-list-item-subtitle>{{ user.dni }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title><strong>Email:</strong></v-list-item-title>
            <v-list-item-subtitle>{{ user.email || 'N/A' }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-card-text>

      <!-- Botón para Editar Perfil -->
      <v-card-actions>
        <v-btn color="primary" @click="navigateToEdit">
          Editar Perfil
        </v-btn>
      </v-card-actions>
    </v-card>

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

<style scoped>
.profile-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.alert-container {
  width: 50%;
  display: flex;
  justify-content: center;
  margin-bottom: 50px;
}
</style>
