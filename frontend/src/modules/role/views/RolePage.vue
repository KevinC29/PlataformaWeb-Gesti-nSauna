<template>
  <v-container class="my-4">
    <v-data-table :headers="headers" :items="filteredRoles" v-model:sort-by="sortBy" :items-per-page="10"
      class="bordered-table">
      <template v-slot:top>
        <v-toolbar class="toolbar-container">
          <v-toolbar-title><strong>ROLES</strong></v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-text-field v-model="search" density="compact" label="Buscar" prepend-inner-icon="mdi-magnify"
            variant="solo-filled" hide-details single-line></v-text-field>
          <v-spacer></v-spacer>
          <v-btn class="ml-10 mr-10 custom-create-btn rounded-lg" @click="navigateToCreate">
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
        <v-chip :color="item.isActive ? 'green' : 'red'" class="text-uppercase" label>
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
  </v-container>

  <!-- Delete Confirmation Dialog -->
  <v-dialog v-model="dialogDelete" max-width="500px">
    <v-sheet class="mx-auto custom-dialog">
      <h2 class="text-center mb-4">¿Estás seguro de querer eliminar este rol?</h2>
      <v-row>
        <v-col cols="12">
          <v-alert v-if="errorMessage" type="error" class="mt-3" border>
            {{ errorMessage }}
          </v-alert>
          <v-alert v-if="successMessage" type="success" class="mt-3" border>
            {{ successMessage }}
          </v-alert>
        </v-col>
      </v-row>
      <v-row justify="end">
        <v-btn class="custom-submit-btn" type="submit" @click="deleteRoleConfirm">
          Eliminar
        </v-btn>
        <v-btn class="custom-cancel-btn" @click="closeDelete">
          Cancelar
        </v-btn>
      </v-row>
    </v-sheet>
  </v-dialog>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import '@/assets/styles/dataTable.css';
import '@/assets/styles/buttons.css';
import '@/assets/styles/dialog.css';

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
        { title: 'Nombre', key: 'name', headerProps: { class: 'font-weight-bold' } },
        { title: 'Estado', key: 'isActive', headerProps: { class: 'font-weight-bold' } },
        { title: 'Acciones', value: 'actions', sortable: false, headerProps: { class: 'font-weight-bold' } }
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
    async deleteRoleConfirm() {
      if (this.editedItem) {
        try {
          await this.deleteRole(this.editedItem._id);
          this.formattedSuccess(this.success, "Rol eliminado con éxito");
          this.dialogDelete = false;
          this.fetchRoles();
        } catch (error) {
          this.formattedError(this.error, "Error al eliminar el rol");
        }
      }
    },
    closeDelete() {
      this.dialogDelete = false;
    }
  },
  created() {
    this.fetchRoles();
  }
};
</script>