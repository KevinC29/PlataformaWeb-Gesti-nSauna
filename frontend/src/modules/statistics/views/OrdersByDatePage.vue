<template>
  <v-sheet class="mx-auto custom-form" width="600">
    <h2 class="text-center mb-4">ORDENES POR FECHA</h2>
    <v-row>
      <v-col cols="12">
        <!-- Input para la fecha de inicio -->
        <label class="field-label">Fecha de Inicio</label>
        <v-dialog v-model="startDateDialog" width="auto" persistent scrollable @click:outside="startDateDialog = false">
          <template v-slot:activator="{ props }">
            <v-text-field v-model="startDateFormatted" prepend-inner-icon="mdi-calendar" readonly v-bind="props"
              bg-color="cyan-lighten-5" color="#388e3c" rounded variant="solo-filled"></v-text-field>
          </template>
          <v-date-picker v-model="startDate" color="primary" title="Selecciona la fecha" header=""
            @update:modelValue="startDateDialog = false" first-day-of-week="1" />
        </v-dialog>

        <!-- Input para la fecha de fin -->
        <label class="field-label">Fecha de Fin</label>
        <v-dialog v-model="endDateDialog" width="auto" persistent scrollable @click:outside="endDateDialog = false">
          <template v-slot:activator="{ props }">
            <v-text-field v-model="endDateFormatted" prepend-inner-icon="mdi-calendar" readonly v-bind="props"
              bg-color="cyan-lighten-5" color="#388e3c" rounded variant="solo-filled"></v-text-field>
          </template>
          <v-date-picker v-model="endDate" color="primary" title="Selecciona la fecha" header=""
            @update:modelValue="endDateDialog = false" first-day-of-week="1" />
        </v-dialog>
      </v-col>
    </v-row>

    <!-- Boton -->
    <v-row justify="end" class="mb-4">
      <v-btn class="custom-submit-btn" @click="sendDates">
        Buscar Órdenes
      </v-btn>
    </v-row>
    <OrdersByDate v-if="isOrdersVisible" :key="ordersKey" :startDate="startDateISO" :endDate="endDateISO" />
  </v-sheet>

</template>

<script>
import OrdersByDate from '@/modules/statistics/components/OrdersByDate.vue';
import '@/assets/styles/buttons.css';
import '@/assets/styles/forms.css';

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
