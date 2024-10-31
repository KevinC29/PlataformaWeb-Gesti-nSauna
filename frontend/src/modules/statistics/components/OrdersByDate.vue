<template>
  <v-container v-if="section" class="container-total">
    <h3 v-if="total" class="text-center">Total Ganado en el Rango de Fechas: $ {{ totalSum.toFixed(2) }}</h3>

    <label v-if="total" class="field-label">Buscar Ítem</label>
    <v-autocomplete v-if="searchItem" v-model="selectedItem" :items="itemNames" item-value="name" clearable bg-color="cyan-lighten-5"
      color="#388e3c" rounded variant="solo-filled" @update:modelValue="filterChartByItem" />

    <apexchart v-if="chartSeries[0].data.length" type="bar" height="350" :options="chartOptions"
      :series="chartSeries" />

    <v-alert v-if="errorMessage" type="error" class="mt-3">{{ errorMessage }}</v-alert>
    <v-alert v-if="successMessage" type="success" class="mt-3">{{ successMessage }}</v-alert>
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
      total: false,
      searchItem: false,
      section: false,
      selectedItem: null,
      itemNames: [],
      chartOptions: {
        chart: {
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
      }, 4000);
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
          await this.fetchOrders({ startDate: this.startDate, endDate: this.endDate });
          if (this.success) {
            if (this.orders.length) {
              this.formattedSuccess(this.success, 'Datos extraidos con éxito');
              this.updateChart();
              this.total = true;
              this.searchItem = true;
              this.section = true;
            } else {
              this.formattedSuccess(this.success, 'No hay datos disponibles para mostrar');
              this.total = false;
              this.section = true;
              this.searchItem = false;
            }

          }
        } catch (error) {
          this.formattedError(this.error, 'Error al obtener las estadísticas');
          this.total = false;
        }
      } else {
        this.formattedError('Por favor selecciona un rango de fechas válido', 'Error al obtener las estadísticas');
      }
    },

    updateChart() {
      if (this.orders.length > 0) {
        const itemData = {};
        this.totalSum = this.orders.reduce((sum, order) => sum + order.total, 0);

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

        this.itemNames = Object.values(itemData).map(item => item.name);

        this.chartSeries[0].data = Object.values(itemData).map(item => item.quantity);
        this.chartSeries[1].data = Object.values(itemData).map(item => item.totalPrice);
        this.chartOptions.xaxis.categories = Object.values(itemData).map(item => item.name);
      } else {
        this.chartSeries[0].data = [];
        this.chartSeries[1].data = [];
        this.totalSum = 0;
        this.itemNames = [];
      }
    },

    filterChartByItem(item) {
      if (item && this.orders.length > 0) {
        const filteredData = {
          quantity: 0,
          totalPrice: 0,
        };

        this.orders.forEach(order => {
          order.detailOrders.forEach(detail => {
            if (detail.itemName === item) {
              filteredData.quantity += detail.cantidad;
              filteredData.totalPrice += detail.price * detail.cantidad;
            }
          });
        });

        this.chartSeries[0].data = [filteredData.quantity];
        this.chartSeries[1].data = [filteredData.totalPrice];
        this.chartOptions = {
          ...this.chartOptions,
          xaxis: {
            ...this.chartOptions.xaxis,
            categories: [item],
          },
        };
      } else {
        this.updateChart();
      }
    },
  },
  mounted() {
    this.fetchOrdersByDate();
  },
};
</script>

<style scoped>
.container-total {
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>