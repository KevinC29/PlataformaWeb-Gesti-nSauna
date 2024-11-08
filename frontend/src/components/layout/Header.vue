<template>
  <v-app-bar class="custom-app-bar">
    <div class="logo-header" @click="scrollToWelcome"></div>
    <span class="app-title">El VAPOR DE LA MOLIENDA</span>
    <v-spacer></v-spacer>
    <v-breadcrumbs :items="items" @click:breadcrumb="handleItemClick">
      <template v-slot:divider>
        <v-icon icon="mdi-chevron-right"></v-icon>
      </template>
      <template v-slot:item="{ item }">
        <v-btn :to="item.href ? item.href : undefined" text class="custom-breadcrumb-btn rounded-lg"
          @click.prevent="item.onClick ? item.onClick() : handleItemClick(item)">
          {{ item.title }}
        </v-btn>
      </template>
    </v-breadcrumbs>
  </v-app-bar>
</template>

<script>
import '@/assets/styles/header.css';

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
      if (item.href && item.href.startsWith('#')) {
        const element = document.querySelector(item.href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
      else if (item.href) {
        this.$router.push(item.href);
      }
    },
    scrollToWelcome() {
      const welcomeSection = document.querySelector('#welcome');
      if (welcomeSection) {
        welcomeSection.scrollIntoView({ behavior: 'smooth' });
      }
    },
  },
};
</script>