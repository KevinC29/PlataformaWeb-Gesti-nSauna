<template>
  <v-container>
    <v-row>
      <v-col>
        <v-row>
          <v-col>
            <h3>Total: $ {{ totalSum.toFixed(2) }}</h3>
          </v-col>
        </v-row>
        <apexchart v-if="chartSeries[0].data.length" type="bar" height="350" :options="chartOptions"
          :series="chartSeries" />

        <v-alert v-if="errorMessage" type="error" class="mt-3">
          {{ errorMessage }}
        </v-alert>
        <v-alert v-if="successMessage" type="success" class="mt-3">
          {{ successMessage }}
        </v-alert>

      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import VueApexCharts from 'vue3-apexcharts';
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'OrdersByDate',
  components: {
    apexchart: VueApexCharts,
  },
  props: {
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      totalSum: 0,
      errorMessage: '',
      successMessage: '',
      chartOptions: {
        chart: {
          id: 'vuechart-example',
          toolbar: {
            show: false,
          },
        },
        xaxis: {
          categories: [],
        },
        plotOptions: {
          bar: {
            borderRadius: 4,
            horizontal: false,
          },
        },
        dataLabels: {
          enabled: false,
        },
        title: {
          text: 'Ventas por Ítem',
          align: 'center',
        },
      },
      chartSeries: [
        {
          name: 'Cantidad',
          data: [],
        },
        {
          name: 'Total Ganado',
          data: [],
        },
      ],
    };
  },
  computed: {
    ...mapGetters('statistics', ['orders', 'error', 'success']),
  },
  watch: {
    orders: 'updateChart',
  },
  methods: {
    ...mapActions('statistics', ['fetchOrders']),
    formattedError(error, message) {
      this.errorMessage = error || message;
      setTimeout(() => {
        this.errorMessage = '';
      }, 2000);
    },
    formattedSuccess(success, message) {
      this.successMessage = success || message;
      setTimeout(() => {
        this.successMessage = '';
      }, 2000);
    },
    async fetchOrdersByDate() {
      if (this.startDate && this.endDate) {
        try {
          await this.fetchOrders({ startDate: this.startDate, endDate: this.endDate })
          if (this.success) {
            this.formattedSuccess(this.success, "No hay datos disponibles para mostrar");
            this.updateChart();
          }
        } catch (error) {
          this.formattedError(this.error, "Error al obtener las estadísticas");
        }
      } else {
        this.formattedError('Por favor selecciona un rango de fechas válido', "Error al obtener las estadísticas");
      }
    },

    updateChart() {
      if (this.orders.length > 0) {
        const itemData = {};

        // Calcular el total de las órdenes
        this.totalSum = this.orders.reduce((sum, order) => sum + order.total, 0);

        // Procesar los detalles de cada orden
        this.orders.forEach(order => {
          order.detailOrders.forEach(detail => {
            if (!itemData[detail.itemId]) {
              itemData[detail.itemId] = {
                name: detail.itemName,
                quantity: 0,
                totalPrice: 0,
              };
            }
            itemData[detail.itemId].quantity += detail.cantidad;
            itemData[detail.itemId].totalPrice += detail.price * detail.cantidad;
          });
        });

        // Preparar las series para el gráfico
        this.chartSeries[0].data = Object.values(itemData).map(item => item.quantity);
        this.chartSeries[1].data = Object.values(itemData).map(item => item.totalPrice);
        this.chartOptions.xaxis.categories = Object.values(itemData).map(item => item.name);
      } else {
        // Limpiar los datos si no hay órdenes
        this.chartSeries[0].data = [];
        this.chartSeries[1].data = [];
        this.totalSum = 0;
      }
    },
  },
  mounted() {
    this.fetchOrdersByDate();
  },
};
</script>
