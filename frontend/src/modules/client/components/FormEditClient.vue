<template>
  <form @submit.prevent="submitForm">
    <!-- Campo Cuenta -->
    <v-text-field v-model="state.account" :error-messages="v$.state.account.$errors.map(e => e.$message)" label="Cuenta"
      type="number" required min="0" step="0.01" @blur="v$.state.account.$touch" @input="v$.state.account.$touch"
      @change="formatAccount" prepend-icon="mdi-currency-usd"></v-text-field>

    <!-- Campo Estado de Cuenta -->
    <v-select v-model="state.accountState" :items="accountStateOptions" item-value="value" item-title="text"
      :error-messages="v$.state.accountState.$errors.map(e => e.$message)" label="Estado de la Cuenta" required
      @blur="v$.state.accountState.$touch"></v-select>

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
        account: 0,
        accountState: 'paid',
      },
      accountStateOptions: [
        { value: 'paid', text: 'Pagada' },
        { value: 'pending', text: 'Pendiente' },
      ],
      errorMessage: '',
      successMessage: '',
    };
  },
  computed: {
    ...mapGetters('client', ['client', 'error', 'success']),
  },
  methods: {
    ...mapActions('client', ['updateClient', 'fetchClient']),
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
        await this.fetchClient(this.$route.params.id);
        const client = this.client;
        this.state = {
          account: client.account,
          accountState: client.accountState,
        };
      } catch (error) {
        this.formattedError(this.error, "Error al cargar los datos");
      }
    },

    formatAccount() {
      if (this.state.account !== null && this.state.account !== '') {
        this.state.account = Math.max(0, parseFloat(this.state.account).toFixed(2));
      }
    },

    async submitForm() {
      this.v$.$touch();

      if (this.v$.$invalid) return;

      this.formatAccount();

      const clientData = {
        account: Number(this.state.account),
        accountState: this.state.accountState,
      };

      try {
        await this.updateClient({ id: this.$route.params.id, clientData });
        this.formattedSuccess(this.success, "Cliente creado con éxito");
        this.$router.push({ name: 'ClientList' });
      } catch (error) {
        this.formattedError(this.error, "Error al editar el cliente");
      }
    },

    cancel() {
      this.$router.push({ name: 'ClientList' });
    },
  },
  validations() {
    return {
      state: {
        account: { required, minValue: minValue(0) },
        accountState: { required },
      },
    };
  },
  setup() {
    const v$ = useVuelidate();
    return { v$ };
  },
  async created() {
    await this.fetchData();
  }
};
</script>
