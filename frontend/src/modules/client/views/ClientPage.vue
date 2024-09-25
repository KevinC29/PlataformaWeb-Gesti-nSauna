<template>
  <v-data-table :headers="headers" :items="filteredItems" v-model:sort-by="sortBy" :items-per-page="10">
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>CLIENTES</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-text-field v-model="search" density="compact" label="Buscar" prepend-inner-icon="mdi-magnify"
          variant="solo-filled" flat hide-details single-line></v-text-field>
        <v-spacer></v-spacer>
        <v-btn class="mb-2" color="primary" dark @click="navigateToCreate">
          Crear Cliente
        </v-btn>
      </v-toolbar>
    </template>

    <!-- Columna de Usuario -->
    <template v-slot:[`item.user`]="{ item }">
      {{ item.user.name }} {{ item.user.lastName }}
    </template>

    <!-- Columna de Cuenta -->
    <template v-slot:[`item.account`]="{ item }">
      {{ item.account.toFixed(2) }}
    </template>

    <!-- Columna de Estado de Cuenta -->
    <template v-slot:[`item.accountState`]="{ item }">
      <v-chip :color="item.accountState === 'paid' ? 'green' : 'red'" class="text-uppercase" size="small" label>
        {{ item.accountState === 'paid' ? 'Pagada' : 'Pendiente' }}
      </v-chip>
    </template>

    <!-- Columna de Acciones -->
    <template v-slot:[`item.actions`]="{ item }">
      <v-icon class="me-2" size="small" @click="navigateToEdit(item)">
        mdi-pencil
      </v-icon>
      <v-icon size="small" @click="confirmDelete(item)">
        mdi-delete
      </v-icon>
    </template>

    <!-- Sin datos -->
    <template v-slot:no-data>
      <v-btn color="primary" @click="fetchClients">
        Reiniciar
      </v-btn>
    </template>
  </v-data-table>

  <!-- Delete Confirmation Dialog -->
  <v-dialog v-model="dialogDelete" max-width="500px">
    <v-card>
      <v-card-title class="text-h5">
        ¿Estás seguro de querer eliminar este cliente?
      </v-card-title>
      <v-alert v-if="errorMessage" type="error" class="mt-3">
        {{ errorMessage }}
      </v-alert>
      <v-alert v-if="successMessage" type="success" class="mt-3">
        {{ successMessage }}
      </v-alert>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue-darken-1" variant="text" @click="closeDelete">
          Cancelar
        </v-btn>
        <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm">
          Eliminar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  data() {
    return {
      sortBy: [{ key: 'user.name', order: 'asc' }],
      search: '',
      dialogDelete: false,
      editedItem: null,
      errorMessage: '',
      successMessage: '',
    };
  },
  computed: {
    ...mapGetters('client', ['clients', 'error', 'success']),
    headers() {
      return [
        { title: 'Usuario', key: 'user', align: 'start' },
        { title: 'Cuenta', key: 'account' },
        { title: 'Estado de Cuenta', key: 'accountState' },
        { title: 'Acciones', value: 'actions', sortable: false }
      ];
    },
    filteredItems() {
      if (!this.search) return this.clients;
      const searchLower = this.search.toLowerCase();
      return this.clients.filter(client =>
        (client.user.name && client.user.name.toLowerCase().includes(searchLower)) ||
        (client.user.lastName && client.user.lastName.toLowerCase().includes(searchLower)) ||
        client.account.toString().includes(searchLower)
      );
    }
  },
  methods: {
    ...mapActions('client', ['fetchClients', 'deleteClient']),

    navigateToCreate() {
      this.$router.push({ name: 'ClientCreate' });
    },
    navigateToEdit(client) {
      this.$router.push({ name: 'ClientEdit', params: { id: client._id } });
    },
    async confirmDelete(client) {
      this.editedItem = client;
      this.dialogDelete = true;
      this.successMessage = '';
      this.errorMessage = '';
    },
    async deleteItemConfirm() {
      if (this.editedItem) {
        try {
          await this.deleteClient(this.editedItem._id);
          this.successMessage = this.success;
          this.errorMessage = '';
          setTimeout(() => {
            this.dialogDelete = false;
          }, 2000);
          this.fetchClients();
        } catch (error) {
          this.errorMessage = this.error || 'Error desconocido';
          this.successMessage = '';
        }
      }
    },
    closeDelete() {
      this.dialogDelete = false;
      this.successMessage = '';
      this.errorMessage = '';
    }
  },
  created() {
    this.fetchClients();
  }
};
</script>