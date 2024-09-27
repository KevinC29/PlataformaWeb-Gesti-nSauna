<template>
  <form @submit.prevent="submitForm">
    <!-- Número de Orden -->
    <v-text-field v-model="state.numberOrder" label="Número de Orden" type="number" dense required
      readonly></v-text-field>

    <!-- Campo Balance -->
    <v-text-field v-model="state.balance" :error-messages="v$.state.balance.$errors.map(e => e.$message)" label="Saldo"
      type="number" required min="0" step="0.01" @blur="v$.state.balance.$touch" @input="v$.state.balance.$touch"
      @change="formatBalance" prepend-icon="mdi-currency-usd"></v-text-field>

    <!-- Buscador de Cliente -->
    <v-autocomplete v-model="state.client" :items="filteredClientsList" item-value="_id" item-title="fullName"
      v-model:search-input="searchTerm" label="Buscar y Seleccionar Cliente" clearable dense :items-per-page="5"
      @update:search-input="filterClients"></v-autocomplete>

    <!-- Alerta de errores -->
    <v-alert v-if="errorMessage" type="error" dismissible>
      {{ errorMessage }}
    </v-alert>

    <!-- Alerta de éxito -->
    <v-alert v-if="successMessage" type="success" dismissible>
      {{ successMessage }}
    </v-alert>

    <!-- Botones -->
    <v-btn class="me-4" color="primary" type="submit">
      Guardar
    </v-btn>
    <v-btn color="secondary" @click="cancel">
      Cancelar
    </v-btn>
  </form>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { useVuelidate } from '@vuelidate/core';
import { required, minValue } from '@vuelidate/validators';

export default {
  data() {
    return {
      state: {
        numberOrder: null,
        balance: 0.00,
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
        this.state.balance = Math.max(0, parseFloat(this.state.balance).toFixed(2));
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
        this.$router.push({ name: 'OrderList' });
      } catch (error) {
        this.formattedError(this.error, "Error al crear la orden");
      }
    },

    cancel() {
      this.$router.push({ name: 'OrderList' });
    },
  },
  validations() {
    return {
      state: {
        numberOrder: { required },
        balance: { required, minValue: minValue(0) },
        client: { required },
      },
    };
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
