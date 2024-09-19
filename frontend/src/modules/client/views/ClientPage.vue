<template>
    <v-data-table
      :headers="headers"
      :items="filteredItems"
      :sort-by="[{ value: 'user.name', order: 'desc' }]"
      :items-per-page="10"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>CLIENTES</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            density="compact"
            label="Buscar"
            prepend-inner-icon="mdi-magnify"
            variant="solo-filled"
            flat
            hide-details
            single-line
          ></v-text-field>
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
        <v-alert v-if="showErrorAlert" type="error" class="mt-3">
          {{ errorMessage }}
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
        search: '',
        dialogDelete: false,
        editedItem: null,
        showErrorAlert: false,
        errorMessage: '',
      };
    },
    computed: {
      ...mapGetters('client', ['clients', 'error']),
      headers() {
        return [
          { title: 'Usuario', value: 'user', align: 'start' },
          { title: 'Cuenta', value: 'account' },
          { title: 'Estado de Cuenta', value: 'accountState' },
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
      },
      async deleteItemConfirm() {
        if (this.editedItem) {
          const errorMsg = await this.deleteClient(this.editedItem._id);
          if (errorMsg) {
            this.showErrorAlert = true;
            this.errorMessage = errorMsg;
          } else {
            this.dialogDelete = false;
            this.fetchClients();
          }
        }
      },
      closeDelete() {
        this.dialogDelete = false;
        this.showErrorAlert = false;
      }
    },
    created() {
      this.fetchClients();
    }
  };
  </script>
  