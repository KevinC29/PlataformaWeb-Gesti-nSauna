<template>
  <v-sheet class="mx-auto custom-form" width="600">
    <!-- Título centrado para el formulario -->
    <h2 class="text-center mb-4">Crear Orden</h2>
    <v-form @submit.prevent="submitForm">
      <v-row>
        <v-col cols="12">
          <!-- Número de Orden -->
          <label class="field-label">Número de Orden</label>
          <v-text-field v-model="state.numberOrder" type="number" dense required readonly bg-color="cyan-lighten-5"
            color="#388e3c" rounded variant="solo-filled"></v-text-field>

          <!-- Campo Balance -->
          <label class="field-label">Saldo Inicial del Cliente</label>
          <v-text-field v-model="state.balance" :error-messages="v$.state.balance.$errors.map(e => e.$message)"
            type="number" required min="0" step="0.01" @blur="v$.state.balance.$touch" @input="v$.state.balance.$touch"
            @change="formatBalance" prepend-inner-icon="mdi-currency-usd" bg-color="cyan-lighten-5" color="#388e3c"
            rounded variant="solo-filled"></v-text-field>

          <!-- Buscador de Cliente -->
          <label class="field-label">Buscar y Seleccionar Cliente</label>
          <v-autocomplete v-model="state.client" :error-messages="v$.state.client.$errors.map(e => e.$message)" :items="filteredClientsList" item-value="_id" item-title="fullName"
            v-model:search-input="searchTerm" clearable dense :items-per-page="5" @update:search-input="filterClients" @blur="v$.state.client.$touch" @input="v$.state.client.$touch"
            bg-color="cyan-lighten-5" color="#388e3c" rounded variant="solo-filled"></v-autocomplete>
        </v-col>
      </v-row>
      <!-- Botones -->
      <v-row justify="end" class="mb-4">
        <v-btn class="custom-submit-btn" type="submit">
          Guardar
        </v-btn>
        <v-btn class="custom-cancel-btn" @click="cancel">
          Cancelar
        </v-btn>
      </v-row>

      <!-- Alerta de errores generales -->
      <v-alert v-if="errorMessage" type="error" class="mt-3" border>
        {{ errorMessage }}
      </v-alert>

      <!-- Alerta de éxito general -->
      <v-alert v-if="successMessage" type="success" class="mt-3" border>
        {{ successMessage }}
      </v-alert>
    </v-form>
  </v-sheet>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { useVuelidate } from '@vuelidate/core';
import { createOrderValidations } from '@/validators/orderValidations.js';
import '@/assets/styles/buttons.css';
import '@/assets/styles/forms.css';

export default {
  data() {
    return {
      state: {
        numberOrder: null,
        balance: 0,
        client: null,
      },
      clientsList: [],
      filteredClientsList: [],
      searchTerm: '',
      errorMessage: '',
      successMessage: '',
    };
  },
  computed: {
    ...mapGetters('order', ['clients', 'error', 'success', 'numberOrder']),
  },
  methods: {
    ...mapActions('order', ['createOrder', 'fetchAndSetClients', 'fetchAndSetNumberOrder']),

    formatBalance() {
      if (this.state.balance !== null && this.state.balance !== '') {
        const formattedValue = Math.max(0, parseFloat(this.state.balance)).toFixed(2);
        this.state.balance = isNaN(formattedValue) ? '0.00' : formattedValue;
      }
    },
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
        this.$router.push({ name: 'OrderList' });
      }, 2000);
    },
    async fetchData() {
      try {
        await this.fetchAndSetClients();
        this.clientsList = this.clients
          .filter(client => client.user.isActive)
          .map(client => ({
            _id: client._id,
            fullName: `${client.user.name} ${client.user.lastName} (${client.user.dni})`,
          }));
        this.filteredClientsList = this.clientsList;

        await this.fetchAndSetNumberOrder();
        this.state.numberOrder = this.numberOrder;
      } catch (error) {
        this.formattedError(this.error, "Error al cargar los datos");
      }
    },

    filterClients(search) {
      const searchTerm = search.toLowerCase();
      this.filteredClientsList = this.clientsList.filter(client =>
        client.fullName.toLowerCase().includes(searchTerm)
      );
    },

    async submitForm() {
      this.v$.$touch();

      if (this.v$.$invalid) return;

      const orderData = {
        numberOrder: Number(this.state.numberOrder),
        balance: Number(this.state.balance),
        client: this.state.client,
      };

      try {
        await this.createOrder(orderData);
        this.formattedSuccess(this.success, "Orden creada con éxito");
      } catch (error) {
        this.formattedError(this.error, "Error al crear la orden");
      }
    },

    cancel() {
      this.$router.push({ name: 'OrderList' });
    },
  },
  validations() {
    return createOrderValidations();
  },

  setup() {
    const v$ = useVuelidate();
    return { v$ };
  },
  async created() {
    await this.fetchData();
  },
};
</script>
