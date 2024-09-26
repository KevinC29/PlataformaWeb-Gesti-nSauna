<template>
  <v-data-table :headers="headers" :items="filteredRoles" v-model:sort-by="sortBy" :items-per-page="10">
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>ROLES</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-text-field v-model="search" density="compact" label="Buscar" prepend-inner-icon="mdi-magnify"
          variant="solo-filled" flat hide-details single-line></v-text-field>
        <v-spacer></v-spacer>
        <v-btn class="mb-2" color="primary" dark @click="navigateToCreate">
          Crear Rol
        </v-btn>
      </v-toolbar>
    </template>

    <!-- Columnas de acciones -->
    <template v-slot:[`item.actions`]="{ item }">
      <v-icon class="me-2" size="small" @click="navigateToEdit(item)">
        mdi-pencil
      </v-icon>
      <v-icon size="small" @click="confirmDelete(item)">
        mdi-delete
      </v-icon>
    </template>

    <!-- Columna de Estado -->
    <template v-slot:[`item.isActive`]="{ item }">
      <v-chip :color="item.isActive ? 'green' : 'red'" class="text-uppercase" size="small" label>
        {{ item.isActive ? 'Activo' : 'Inactivo' }}
      </v-chip>
    </template>

    <!-- Sin datos -->
    <template v-slot:no-data>
      <v-btn color="primary" @click="fetchRoles">
        Reiniciar
      </v-btn>
    </template>
  </v-data-table>

  <!-- Delete Confirmation Dialog -->
  <v-dialog v-model="dialogDelete" max-width="500px">
    <v-card>
      <v-card-title class="text-h5">
        ¿Estás seguro de querer eliminar este rol?
      </v-card-title>
      <v-alert v-if="errorMessage" type="error" class="mt-3">
        {{ errorMessage }}
      </v-alert>
      <v-alert v-if="successMessage" type="success" dismissible>
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
      sortBy: [{ key: 'name', order: 'asc' }],
      search: '',
      dialogDelete: false,
      editedItem: null,
      errorMessage: '',
      successMessage: '',
    };
  },
  computed: {
    ...mapGetters('role', ['roles', 'error', 'success']),
    headers() { 
      return [
        { title: 'Nombre', key: 'name', align: 'start' },
        { title: 'Estado', key: 'isActive' },
        { title: 'Acciones', value: 'actions', sortable: false }
      ];
    },
    filteredRoles() {
      if (!this.search) return this.roles;
      const searchLower = this.search.toLowerCase();
      return this.roles.filter(role =>
        role.name.toLowerCase().includes(searchLower)
      );
    }
  },
  methods: {
    ...mapActions('role', ['fetchRoles', 'deleteRole']),

    navigateToCreate() {
      this.$router.push({ name: 'RoleCreate' });
    },
    navigateToEdit(item) {
      this.$router.push({ name: 'RoleEdit', params: { id: item._id } });
    },
    async confirmDelete(item) {
      this.editedItem = item;
      this.dialogDelete = true;
      this.successMessage = '';
      this.errorMessage = '';
    },
    async deleteItemConfirm() {
      if (this.editedItem) {
        try {
          await this.deleteRole(this.editedItem._id);
          this.successMessage = this.success;
          this.errorMessage = '';
          setTimeout(() => {
            this.dialogDelete = false;
          }, 2000);
          this.fetchRoles();
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
    this.fetchRoles();
  }
};
</script>