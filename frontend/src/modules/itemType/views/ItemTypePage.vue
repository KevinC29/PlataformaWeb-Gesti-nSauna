<template>
  <v-container class="my-4">
  <v-data-table :headers="headers" :items="filteredItemTypes" v-model:sort-by="sortBy" :items-per-page="10" class="bordered-table">
    <template v-slot:top>
      <v-toolbar class="toolbar-container">
        <v-toolbar-title><strong>TIPOS DE ÍTEM</strong></v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-text-field v-model="search" density="compact" label="Buscar" prepend-inner-icon="mdi-magnify"
          variant="solo-filled" hide-details single-line></v-text-field>
        <v-spacer></v-spacer>
        <v-btn class="ml-10 mr-10 custom-create-btn rounded-lg" @click="navigateToCreate">
          Crear Tipo de Ítem
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
      <v-btn color="primary" @click="fetchItemTypes">
        Reiniciar
      </v-btn>
    </template>
  </v-data-table>
</v-container>

  <!-- Delete Confirmation Dialog -->
  <v-dialog v-model="dialogDelete" max-width="500px">
    <v-card>
      <v-card-title class="text-h5">
        ¿Estás seguro de querer eliminar este ítem?
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
        <v-btn color="blue-darken-1" variant="text" @click="deleteItemTypeConfirm">
          Eliminar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import '@/assets/styles/dataTable.css';
import '@/assets/styles/buttons.css';

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
    ...mapGetters('itemType', ['itemTypes', 'error', 'success']),
    headers() {
      return [
        { title: 'Nombre', key: 'name', align: 'start' },
        { title: 'Descripción', key: 'description' },
        { title: 'Sección', key: 'section.name' },
        { title: 'Estado', key: 'isActive' },
        { title: 'Acciones', value: 'actions', sortable: false }
      ];
    },
    filteredItemTypes() {
      if (!this.search) return this.itemTypes;
      const searchLower = this.search.toLowerCase();
      return this.itemTypes.filter(itemType =>
        itemType.name.toLowerCase().includes(searchLower)
      );
    }
  },
  methods: {
    ...mapActions('itemType', ['fetchItemTypes', 'deleteItemType']),
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
      this.$router.push({ name: 'ItemTypeCreate' });
    },
    navigateToEdit(item) {
      this.$router.push({ name: 'ItemTypeEdit', params: { id: item._id } });
    },
    async confirmDelete(item) {
      this.editedItem = item;
      this.dialogDelete = true;
      this.successMessage = '';
      this.errorMessage = '';
    },
    async deleteItemTypeConfirm() {
      if (this.editedItem) {
        try {
          await this.deleteItemType(this.editedItem._id);
          this.formattedSuccess(this.success, "Tipo de Ítem eliminado con éxito");
          this.dialogDelete = false;
          this.fetchItemTypes();
        } catch (error) {
          this.formattedError(this.error, "Error al eliminar el Tipo de Ítem");
        }
      }
    },
    closeDelete() {
      this.dialogDelete = false;
    },
  },
  created() {
    this.fetchItemTypes();
  }
};
</script>
