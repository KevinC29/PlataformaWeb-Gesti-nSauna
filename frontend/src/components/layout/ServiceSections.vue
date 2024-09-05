<template>
  <v-card>
    <!-- Tabs -->
    <v-tabs v-model="tab" align-tabs="center" bg-color="teal-darken-3"
      slider-color="teal-lighten-3"
      show-arrows>
      <v-tab v-for="section in filteredSections" :key="section._id" :value="section._id">
        {{ section.name }}
      </v-tab>
    </v-tabs>

    <!-- Tabs Content -->
    <v-tabs-items v-model="tab">
      <v-tab-item>
        <v-container fluid>
          <v-row>
            <v-col cols="12">
              <!-- Display BaseCarousel for the selected tab with all items -->
              <BaseCarousel v-if="itemsForCarousel.length" :items="itemsForCarousel" />
            </v-col>
          </v-row>
        </v-container>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
import BaseCarousel from '@/components/common/BaseCarousel.vue';

export default {
  name: 'ServiceSections',
  components: {
    BaseCarousel
  },
  props: {
    sections: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      tab: null // This will hold the selected tab's ID
    };
  },
  computed: {
    filteredSections() {
      return Array.isArray(this.sections) ? this.sections.filter(section =>
        section.isActive && section.itemTypes.some(itemType => itemType.items.length > 0)
      ) : [];
    },
    selectedSection() {
      return this.filteredSections.find(section => section._id === this.tab);
    },
    itemsForCarousel() {
      return this.getAllItemsForSelectedSection();
    }
  },
  methods: {
    getAllItemsForSelectedSection() {
      if (!this.selectedSection) return [];

      // Combine all items from itemTypes into a single list
      return this.selectedSection.itemTypes.flatMap(itemType => itemType.items.map(item => ({
        src: item.imageUrl,
        name: item.name,
        price: item.price,
        description: item.description,
        itemType: {
          name: itemType.name,
          description: itemType.description
        }
      })));
    }
  },
  mounted() {
    // Set the default tab to the first active section
    if (this.filteredSections.length > 0) {
      this.tab = this.filteredSections[0]._id;
    }
  }
};
</script>
