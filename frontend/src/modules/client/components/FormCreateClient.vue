<template>
  <form @submit.prevent="submitForm">
    <!-- Buscador de Usuario -->
    <v-autocomplete v-model="state.user" :items="filteredUsersList" item-value="_id" item-title="fullName"
      v-model:search-input="searchTerm" label="Buscar y Seleccionar Usuario" clearable dense :items-per-page="5"
      @update:search-input="filterUsers"></v-autocomplete>

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
import { required } from '@vuelidate/validators';

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
        this.successMessage = this.success;
        this.errorMessage = '';
      } catch (error) {
        this.errorMessage = this.error;
        this.successMessage = '';
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
        this.successMessage = this.success;
        this.errorMessage = '';
        setTimeout(() => {
          this.$router.push({ name: 'ClientList' });
        }, 2000);
      } catch (error) {
        this.errorMessage = this.error;
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
        user: { required },
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
