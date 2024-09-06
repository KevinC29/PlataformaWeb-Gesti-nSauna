<template>
  <v-app>
    <AppHeader :items="headerItems" />
    <v-main>
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
  components: {
    AppHeader,
    SidebarContainer,
  },
  data() {
    return {
      headerItems: [
        {
          title: 'Salir',
          disabled: false,
          onClick: this.handleLogout, // Usa onClick en lugar de href
        },
      ],
    };
  },
  methods: {
    ...mapActions('auth', ['logout']),
    async handleLogout() {
      this.errorMessage = '';
      try {
        await this.logout();
        this.$router.push({ name: 'Login' });
      } catch (error) {
        this.errorMessage = 'Logout Failed.';
      }
    },
  },
};
</script>

<style scoped>
.full-width {
  width: 100%;
}
</style>