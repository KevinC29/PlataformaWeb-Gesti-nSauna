<template>
  <v-navigation-drawer v-model="drawer" :rail="rail" app permanent width="256" class="sidebar">
    <v-list>
      <!-- Hacer click en la información del usuario para redirigir -->
      <v-list-item @click="handleAvatarClick" class="cursor-pointer" nav>
        <template v-slot:prepend>
          <v-avatar color="info">
            <v-icon icon="mdi-account-circle"></v-icon>
          </v-avatar>
        </template>
        <v-list-item-content>
          <v-list-item-title v-text="userName"></v-list-item-title>
          <v-list-item-subtitle v-text="userEmail"></v-list-item-subtitle>
        </v-list-item-content>
        <template v-slot:append>
          <v-btn icon="mdi-chevron-left" size="small" variant="text" @click.stop="rail = !rail"></v-btn>
        </template>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list :lines="false" density="compact" nav>
      <v-list-item v-for="(item, i) in items" :key="i" :value="item" color="black" @click="handleItemClick(item)">
        <template v-slot:prepend>
          <v-icon :icon="item.icon"></v-icon>
        </template>
        <v-list-item-title v-text="item.text"></v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: 'AppSidebar',
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    userName: {
      type: String,
      default: 'Usuario',
    },
    userEmail: {
      type: String,
      default: 'usuario@google.com',
    },
    userProfileUrl: {
      type: String,
      default: '/dashboard/credentials',
    },
  },
  data() {
    return {
      drawer: true,
      rail: true,
    };
  },
  methods: {
    handleItemClick(item) {
      if (item.href) {
        this.rail = false;
        this.$router.push(item.href);
      }
    },
    handleAvatarClick() {
      this.$router.push(this.userProfileUrl);
    },
  },
};
</script>

<style scoped>
.sidebar {
  height: 100vh;
  background-image: linear-gradient(to bottom, #4caf50, #f5f5f5)
}

.cursor-pointer {
  cursor: pointer;
}
</style>
