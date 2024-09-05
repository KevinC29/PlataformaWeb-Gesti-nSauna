<template>
  <v-carousel hide-delimiters>
    <v-carousel-item
      v-for="(item, index) in items"
      :key="index"
      :src="item.src"
      cover
    >
      <!-- ItemType information at the top -->
      <v-sheet class="d-flex flex-column align-center justify-start" height="100%" color="rgba(0, 0, 0, 0.6)">
        <div class="pa-4 text-center white--text">
          <h2>{{ item.itemType.name }}</h2>
          <p>{{ item.itemType.description }}</p>
        </div>
        <!-- Item image and information at the bottom -->
        <v-spacer></v-spacer>
        <v-img :src="item.src" cover width="100%" height="300px" />
        <div class="pa-4 text-center white--text">
          <h3>{{ item.name }}</h3>
          <h4>{{ formatPrice(item.price) }}</h4>
          <p>{{ item.description }}</p>
        </div>
      </v-sheet>
    </v-carousel-item>
  </v-carousel>
</template>

<script>
export default {
  name: 'BaseCarousel',
  props: {
    items: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  methods: {
    formatPrice(price) {
      return `$${price.toFixed(2)}`;
    }
  }
};
</script>

<style scoped>
.pa-4 {
  padding: 16px;
}
.white--text {
  color: white;
}
</style>
