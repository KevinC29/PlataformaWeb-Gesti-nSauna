<template>
  <div class="text-center">
    <v-container>
      <v-row justify="center">
        <v-col cols="8">
          <v-container class="max-width">
            <v-pagination
              v-model="currentPage"
              :length="totalPages"
              class="my-4"
            ></v-pagination>
          </v-container>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'BasePagination',
  props: {
    totalPages: {
      type: Number,
      required: true
    },
    itemsPerPage: {
      type: Number,
      default: 10
    },
    page: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      currentPage: this.page
    };
  },
  watch: {
    page(newPage) {
      this.currentPage = newPage;
    },
    currentPage(newPage) {
      this.$emit('update:page', newPage);
    }
  }
};
</script>