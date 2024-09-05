<template>
  <AppSidebar :items="sidebarItems" />
</template>

<script>
import { mapGetters } from 'vuex';
import AppSidebar from '@/components/layout/Sidebar.vue';

export default {
  name: 'SidebarContainer',
  components: {
    AppSidebar,
  },
  computed: {
    ...mapGetters('dashboard', ['filteredSidebarItems']),
    sidebarItems() {
      return this.filteredSidebarItems; 
    },
  }  
};
</script>
