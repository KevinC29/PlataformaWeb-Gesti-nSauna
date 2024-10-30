<template>
  <v-sheet class="mx-auto custom-form" width="600">
    <!-- Título centrado para el formulario -->
    <h2 class="text-center mb-4">Crear Usuario</h2>

    <v-form @submit.prevent="submitForm">
      <!-- Buscador de Usuario -->
      <v-row>
        <v-col cols="12">
          <label class="field-label">Buscar y Seleccionar Usuario</label>
          <v-autocomplete id="user" v-model="state.user" :items="filteredUsersList" item-value="_id"
            item-title="fullName" v-model:search-input="searchTerm" clearable dense :items-per-page="5"
            @update:search-input="filterUsers" :error-messages="v$.state.user.$errors.map(e => e.$message)"
            @blur="v$.state.user.$touch" @input="v$.state.user.$touch" bg-color="cyan-lighten-5" color="#388e3c" rounded
            variant="solo-filled">
          </v-autocomplete>
        </v-col>
      </v-row>

      <!-- Contenedor para los botones alineados a la derecha -->
      <v-row justify="end" class="mb-4">
        <v-btn class="custom-submit-btn" type="submit">
          Guardar
        </v-btn>
        <v-btn class="custom-cancel-btn" @click="cancel">
          Cancelar
        </v-btn>
      </v-row>

      <!-- Alerta de errores -->
      <v-alert v-if="errorMessage" type="error" class="mt-3" border>
        {{ errorMessage }}
      </v-alert>

      <!-- Alerta de éxito -->
      <v-alert v-if="successMessage" type="success" class="mt-3" border>
        {{ successMessage }}
      </v-alert>
    </v-form>
  </v-sheet>
</template>


<script>
import { mapActions, mapGetters } from 'vuex';
import { useVuelidate } from '@vuelidate/core';
import { createClientValidations } from '@/validators/clientValidations.js';
import '@/assets/styles/buttons.css';
import '@/assets/styles/forms.css';


export default {
  data() {
    return {
      state: {
        user: null,
      },
      usersList: [],
      filteredUsersList: [],
      searchTerm: '',
      errorMessage: '',
      successMessage: '',
    };
  },
  computed: {
    ...mapGetters('client', ['users', 'error', 'success']),
  },
  methods: {
    ...mapActions('client', ['createClient', 'fetchAndSetUsers']),
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
        await this.fetchAndSetUsers();
        this.usersList = this.users
          .filter(user => user.isActive)
          .map(user => ({
            _id: user._id,
            fullName: `${user.name} ${user.lastName} (${user.dni})`,
          }));
        this.filteredUsersList = this.usersList;
      } catch (error) {
        this.formattedError(this.error, "Error al cargar los datos");
      }
    },

    filterUsers(search) {
      const searchTerm = search.toLowerCase();
      this.filteredUsersList = this.usersList.filter(user =>
        user.fullName.toLowerCase().includes(searchTerm)
      );
    },

    async submitForm() {
      this.v$.$touch();

      if (this.v$.$invalid) return;

      const clientData = {
        user: this.state.user,
      };

      try {
        await this.createClient(clientData);
        this.formattedSuccess(this.success, "Cliente creado con éxito");
      } catch (error) {
        this.formattedError(this.error, "Error al crear el cliente");
      }
    },

    cancel() {
      this.$router.push({ name: 'ClientList' });
    },
  },
  validations() {
    return createClientValidations();
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