<template>
    <v-container fluid class="layout-container">
      <v-navigation-drawer
        app
        permanent
        width="256"
        class="sidebar"
      >
        <v-list>
          <v-list-item
            prepend-avatar="https://cdn.vuetifyjs.com/images/john.png"
            subtitle="john@google.com"
            title="John Leider"
          >
            <template v-slot:append>
              <v-btn
                icon="mdi-menu-down"
                size="small"
                variant="text"
              ></v-btn>
            </template>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list
          :lines="false"
          density="compact"
          nav
        >
          <v-list-item
            v-for="(item, i) in items"
            :key="i"
            :value="item"
            color="primary"
            @click="handleItemClick(item)"
          >
            <template v-slot:prepend>
              <v-icon :icon="item.icon"></v-icon>
            </template>

            <v-list-item-title v-text="item.text"></v-list-item-title>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
    </v-container>
</template>

<script>
export default {
  name: 'AppSidebar',
  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    handleItemClick(item) {
      if (item.href) {
        this.$router.push(item.href); // Navegar a la ruta especificada
      }
    },
  },
};
</script>

<style scoped>
.layout-container {
  display: flex;
  flex-direction: row;
  height: 100vh; /* Ocupa toda la altura de la vista */
}

.sidebar {
  height: 100vh; /* Ocupa toda la altura de la vista */
}
</style>