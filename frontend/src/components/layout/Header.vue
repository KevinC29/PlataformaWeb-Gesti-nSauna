<template>
  <v-app-bar class="custom-app-bar" title="El VAPOR DE LA MOLIENDA">
    <v-breadcrumbs :items="items" @click:breadcrumb="handleItemClick">
      <template v-slot:divider>
        <v-icon icon="mdi-chevron-right"></v-icon>
      </template>

      <template v-slot:item="{ item }">
        <v-btn
          :to="item.href ? item.href : undefined"
          text
          class="custom-breadcrumb-btn rounded-lg"
          @click.prevent="item.onClick ? item.onClick() : handleItemClick(item)"
        >
          {{ item.title }}
        </v-btn>
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
        this.$router.push(item.href);
      } else if (item.selector) {
        const element = document.querySelector(item.selector);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    },
  },
};
</script>

<style scoped>
.custom-app-bar {
  background: linear-gradient(to right, #388e3c, #66bb6a);
}

.custom-breadcrumb-btn {
  background-color: rgba(0, 0, 0, 0.1);
  padding: 8px 16px;
  text-transform: none;
  transition: background-color 0.3s ease;
}

.custom-breadcrumb-btn:hover {
  background-color: #66bb6a;
  color: white;
}
</style>
