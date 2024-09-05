<template>
  <v-card
    :disabled="loading"
    :loading="loading"
    class="mx-auto my-12 card-container"
    max-width="374"
  >
    <template v-slot:loader="{ isActive }">
      <v-progress-linear
        :active="isActive"
        color="deep-purple"
        height="4"
        indeterminate
      ></v-progress-linear>
    </template>

    <!-- Imagen ajustada -->
    <v-img
      :src="item.imageUrl"
      class="card-img"
      height="200"
      contain
    ></v-img>

    <v-card-item>
      <v-card-title>{{ item.name }}</v-card-title>
    </v-card-item>

    <v-card-text>  
      <div class="text-subtitle-1">
        $ {{ item.price }}
      </div>

      <div>{{ item.description }}</div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "BaseCard",
  props: {
    item: {
      type: Object,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style scoped>
.card-container {
  /* Asegúrate de que la tarjeta no sea más ancha que el contenedor */
  max-width: 100%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.card-img {
  object-fit: cover; /* Ajusta la imagen para cubrir el área del contenedor */
  width: 100%;
  height: 200px; /* Ajusta según sea necesario */
}
</style>
