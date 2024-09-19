<template>
  <form @submit.prevent="submitForm">
    <!-- Campo Cuenta -->
    <v-text-field
      v-model="state.account"
      :error-messages="v$.state.account.$errors.map(e => e.$message)"
      label="Cuenta"
      type="number"
      required
      min="0"
      step="0.01"
      @blur="v$.state.account.$touch"
      @input="v$.state.account.$touch"
      @change="formatAccount"
      prepend-icon="mdi-currency-usd"
    ></v-text-field>

    <!-- Campo Estado de Cuenta -->
    <v-select
      v-model="state.accountState"
      :items="accountStateOptions"
      item-value="value"
      item-title="text"
      :error-messages="v$.state.accountState.$errors.map(e => e.$message)"
      label="Estado de la Cuenta"
      required
      @blur="v$.state.accountState.$touch"
    ></v-select>

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
    ...mapGetters('client', ['client', 'error']),
  },
  methods: {
    ...mapActions('client', ['updateClient', 'fetchClient']),

    async fetchData() {
      try {
        const errorMsg = await this.fetchClient(this.$route.params.id);
        if (errorMsg) {
          this.errorMessage = errorMsg;
        } else {
          const client = this.client;
          this.state = {
            account: client.account,
            accountState: client.accountState,
          };
        }
      } catch (error) {
        this.errorMessage = 'Error al cargar los datos: ' + (error.message || 'Desconocido');
      }
    },
 
    formatAccount() {
      if (this.state.account !== null && this.state.account !== '') {
        this.state.account = parseFloat(this.state.account).toFixed(2);
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
        const errorMsg = await this.updateClient({ id: this.$route.params.id, clientData });

        if (errorMsg) {
          this.errorMessage = errorMsg;
          this.successMessage = '';
        } else {
          this.successMessage = 'Cliente actualizado con éxito';
          this.errorMessage = '';

          setTimeout(() => {
            this.$router.push({ name: 'ClientList' });
          }, 2000);
        }
      } catch (error) {
        this.errorMessage = 'Error en el envío del formulario: ' + (error.message || 'Desconocido');
        this.successMessage = '';
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
