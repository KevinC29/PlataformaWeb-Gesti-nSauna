<template>
  <AppSidebar :items="filteredSidebarItems" :userName="userFullName" :userEmail="user.email" />
  <!-- Alerta de errores -->
  <v-alert v-if="errorMessage" type="error" dismissible>
      {{ errorMessage }}
    </v-alert>

    <!-- Alerta de éxito -->
    <v-alert v-if="successMessage" type="success" dismissible>
      {{ successMessage }}
    </v-alert>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import AppSidebar from '@/components/layout/Sidebar.vue';

export default {
  name: 'SidebarContainer',
  components: {
    AppSidebar,
  },
  computed: {
    ...mapGetters('dashboard', ['filteredSidebarItems', 'user', 'error']),

    userFullName() {
      return `${this.user.name} ${this.user.lastName}`;
    },
  },
  methods: {
    ...mapActions('dashboard', ['fetchAndSetUser']),
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
    async fetchData() {
      try {
        await this.fetchAndSetUser();
      } catch (error) {
        this.formattedError(this.error, "Error al cargar los datos del usuario");
      }
    },
  },
  async created() {
    await this.fetchData();
  }
};
</script>
