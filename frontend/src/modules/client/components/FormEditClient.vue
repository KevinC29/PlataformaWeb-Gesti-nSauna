<template>
  <v-sheet class="mx-auto custom-form" width="600">
    <!-- Título centrado para el formulario -->
    <h2 class="text-center mb-4">Editar Usuario</h2>

    <v-form @submit.prevent="submitForm">
      <!-- Campo Cuenta -->
      <v-row>
        <v-col cols="12">
          <label class="field-label">Cuenta Inicial</label>
          <v-text-field v-model="state.account" :error-messages="v$.state.account.$errors.map(e => e.$message)"
            type="number" required min="0" step="0.01" @blur="v$.state.account.$touch" @input="v$.state.account.$touch"
            @change="formatAccount" prepend-inner-icon="mdi-currency-usd" bg-color="cyan-lighten-5" color="#388e3c"
            rounded variant="solo-filled"></v-text-field>

          <!-- Campo Estado de Cuenta -->
          <label class="field-label">Estado de la Cuenta</label>
          <v-select v-model="state.accountState" :items="accountStateOptions" item-value="value" item-title="text"
            :error-messages="v$.state.accountState.$errors.map(e => e.$message)" required
            @blur="v$.state.accountState.$touch" bg-color="cyan-lighten-5" color="#388e3c" rounded
            variant="solo-filled"></v-select>
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

      <!-- Alerta de errores -->
      <v-alert v-if="errorMessage" type="error" dismissible>
        {{ errorMessage }}
      </v-alert>

      <!-- Alerta de éxito -->
      <v-alert v-if="successMessage" type="success" dismissible>
        {{ successMessage }}
      </v-alert>

    </v-form>
  </v-sheet>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { useVuelidate } from '@vuelidate/core';
import { editClientValidations } from '@/validators/clientValidations.js';
import '@/assets/styles/buttons.css';
import '@/assets/styles/forms.css';

export default {
  data() {
    return {
      state: {
        account: null,
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
        this.$router.push({ name: 'ClientList' });
      }, 2000);
    },
    async fetchData() {
      try {
        await this.fetchClient(this.$route.params.id);
        const client = this.client;
        this.state = {
          account: parseFloat(client.account).toFixed(2),
          accountState: client.accountState,
        };
      } catch (error) {
        this.formattedError(this.error, "Error al cargar los datos");
      }
    },

    formatAccount() {
      if (this.state.account !== null && this.state.account !== '') {
        const formattedValue = Math.max(0, parseFloat(this.state.account)).toFixed(2);
        this.state.account = isNaN(formattedValue) ? '0.00' : formattedValue;
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
      } catch (error) {
        this.formattedError(this.error, "Error al editar el cliente");
      }
    },

    cancel() {
      this.$router.push({ name: 'ClientList' });
    },
  },
  validations() {
    return editClientValidations();
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
