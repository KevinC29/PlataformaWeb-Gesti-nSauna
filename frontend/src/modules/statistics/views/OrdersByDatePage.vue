<template>
  <v-toolbar flat>
    <v-toolbar-title>Órdenes por Fecha</v-toolbar-title>
    <v-divider class="mx-4" inset vertical></v-divider>
    <v-spacer></v-spacer>
  </v-toolbar>

  <!-- Input para la fecha de inicio -->
  <v-dialog v-model="startDateDialog" width="auto" persistent scrollable @click:outside="startDateDialog = false">
    <template v-slot:activator="{ props }">
      <v-text-field v-model="startDateFormatted" label="Fecha Inicio" prepend-icon="mdi-calendar" readonly
        v-bind="props"></v-text-field>
    </template>
    <v-date-picker v-model="startDate" color="primary" title="Selecciona la fecha" header=""
      @update:modelValue="startDateDialog = false" first-day-of-week="1" />
  </v-dialog>

  <!-- Input para la fecha de fin -->
  <v-dialog v-model="endDateDialog" width="auto" persistent scrollable @click:outside="endDateDialog = false">
    <template v-slot:activator="{ props }">
      <v-text-field v-model="endDateFormatted" label="Fecha Fin" prepend-icon="mdi-calendar" readonly
        v-bind="props"></v-text-field>
    </template>
    <v-date-picker v-model="endDate" color="primary" title="Selecciona la fecha" header=""
      @update:modelValue="endDateDialog = false" first-day-of-week="1" />
  </v-dialog>

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
      startDateDialog: false,
      endDateDialog: false,
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
    cancelStartDate() {
      this.startDateDialog = false;
      this.startDate = null;
    },
    cancelEndDate() {
      this.endDateDialog = false;
      this.endDate = null;
    },
  },
};
</script>
