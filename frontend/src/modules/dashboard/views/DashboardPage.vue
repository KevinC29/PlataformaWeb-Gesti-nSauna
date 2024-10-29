<template>
  <v-app>
    <AppHeader :items="headerItems" />
    <v-main class="custom-main-background">
      <SidebarContainer />
        <router-view />      
    </v-main>
  </v-app>
</template>

<script>
import { mapActions } from 'vuex';
import AppHeader from '@/components/layout/Header.vue';
import SidebarContainer from '@/modules/dashboard/components/SidebarContainer.vue';

export default {
  name: 'DashboardPage',
  mounted() {
    this.updateSidebarItems(); // Actualiza los ítems del sidebar cuando la página se monta
  },
  components: {
    AppHeader,
    SidebarContainer,
  },
  data() {
    return {
      errorMessage: '',
      headerItems: [
        {
          title: 'Salir',
          disabled: false,
          onClick: this.handleLogout,
        },
      ],
    };
  },
  methods: {
    ...mapActions('dashboard', ['updateSidebarItems']),
    ...mapActions('auth', ['logout']),
    async handleLogout() {
      this.errorMessage = '';
      try {
        await this.logout(false);
      } catch (error) {
        this.errorMessage = 'Logout Failed.';
      }
    },
  },
};
</script>

<style>
.full-width {
  width: 100%;
}

.custom-main-background {
  background-image: url('@/assets/img/flat-mountains.svg');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  position: relative; 
}
</style>
