<template>
  <v-app-bar title="VAPORES LA MOLIENDA">
    <v-breadcrumbs :items="items" @click:breadcrumb="handleItemClick">
      <template v-slot:divider>
        <v-icon icon="mdi-chevron-right"></v-icon>
      </template>
    </v-breadcrumbs>
  </v-app-bar>
</template>

<script>
export default {
  name: 'AppHeader',
  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    handleItemClick(item) {
      if (item.href) {
        const element = document.querySelector(item.href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    },
  },
};
</script>

