<template>
  <v-toolbar flat>
    <v-toolbar-title>Órdenes por Fecha</v-toolbar-title>
    <v-divider class="mx-4" inset vertical></v-divider>
    <v-spacer></v-spacer>
  </v-toolbar>

  <v-menu v-model="startDateMenu" :close-on-content-click="false" transition="scale-transition"
    >
    <template v-slot:activator="{ props }">
      <v-text-field v-model="startDateFormatted" label="Fecha Inicio" prepend-icon="mdi-calendar" readonly
        v-bind="props" @click="startDateMenu = true"></v-text-field>
    </template>
    <v-date-picker v-model="startDate" color="primary" title="Selecciona la fecha" header=""
    @update:modelValue="startDateMenu = false" first-day-of-week="1" />
  </v-menu>

  <v-menu v-model="endDateMenu" :close-on-content-click="false" transition="scale-transition"
    >
    <template v-slot:activator="{ props }">
      <v-text-field v-model="endDateFormatted" label="Fecha Fin" prepend-icon="mdi-calendar" readonly v-bind="props"
       @click="endDateMenu = true"></v-text-field>
    </template>
    <v-date-picker v-model="endDate" color="primary" title="Selecciona la fecha" header="" @update:modelValue="endDateMenu = false"
      first-day-of-week="1" />
  </v-menu>

  <!-- Botón de búsqueda -->
  <v-btn color="primary" @click="sendDates">
    Buscar Órdenes
  </v-btn>

  <OrdersByDate v-if="isOrdersVisible" :key="ordersKey" :startDate="startDateISO" :endDate="endDateISO" />
</template>

<script>
import OrdersByDate from '@/modules/statistics/components/OrdersByDate.vue';

export default {
  components: {
    OrdersByDate,
  },
  data() {
    return {
      startDate: null,
      endDate: null,
      startDateMenu: false,
      endDateMenu: false,
      isOrdersVisible: false,
      ordersKey: 0,
    };
  },
  computed: {
    startDateFormatted() {
      return this.startDate
        ? new Date(this.startDate).toLocaleDateString('es-ES', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
        : '';
    },
    endDateFormatted() {
      return this.endDate
        ? new Date(this.endDate).toLocaleDateString('es-ES', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
        : '';
    },
    startDateISO() {
      return this.startDate ? new Date(this.startDate).toISOString() : null;
    },
    endDateISO() {
      return this.endDate ? new Date(this.endDate).toISOString() : null;
    },
  },
  methods: {
    sendDates() {
      this.isOrdersVisible = true;
      this.ordersKey += 1;
    },
  },
};
</script>
