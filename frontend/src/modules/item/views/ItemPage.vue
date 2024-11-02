<template>
  <v-container class="my-4">
    <v-data-table :headers="headers" :items="filteredItems" v-model:sort-by="sortBy" :items-per-page="10"
      class="bordered-table">
      <template v-slot:top>
        <v-toolbar class="toolbar-container">
          <v-toolbar-title><strong>ÍTEMS</strong></v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-text-field v-model="search" density="compact" label="Buscar" prepend-inner-icon="mdi-magnify"
            variant="solo-filled" hide-details single-line></v-text-field>
          <v-spacer></v-spacer>
          <v-btn class="ml-10 mr-10 custom-create-btn rounded-lg" @click="navigateToCreate">
            Crear Ítem
          </v-btn>
        </v-toolbar>
      </template>

      <!-- Columna de Imagen -->
      <template v-slot:[`item.imageUrl`]="{ item }">
        <v-img :src="item.imageUrl" max-width="100px" max-height="100px" contain @click="openImageModal(item.imageUrl)"
          style="cursor: pointer;"></v-img>
      </template>

      <!-- Columna de Precio con símbolo de dólar -->
      <template v-slot:[`item.price`]="{ item }">
        <span>$ {{ item.price.toFixed(2) }}</span>
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
        <v-btn color="primary" @click="fetchItems">
          Reiniciar
        </v-btn>
      </template>
    </v-data-table>
  </v-container>

  <!-- Delete Confirmation Dialog -->
  <v-dialog v-model="dialogDelete" max-width="500px">
    <v-sheet class="mx-auto custom-dialog">
      <h2 class="text-center mb-4">¿Estás seguro de querer eliminar este ítem?</h2>
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
        <v-btn class="custom-submit-btn" type="submit" @click="deleteItemConfirm">
          Eliminar
        </v-btn>
        <v-btn class="custom-cancel-btn" @click="closeDelete">
          Cancelar
        </v-btn>
      </v-row>
    </v-sheet>
  </v-dialog>

  <!-- Image Modal -->
  <v-dialog v-model="imageDialog" max-width="80%">
    <v-card>
      <v-card-title class="text-h5">
        Imagen del Ítem
      </v-card-title>
      <v-img :src="selectedImage" contain max-height="600px"></v-img>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue-darken-1" variant="text" @click="closeImageModal">
          Cerrar
        </v-btn>
      </v-card-actions>
    </v-card>
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
      imageDialog: false,
      selectedImage: '',
      editedItem: null,
      errorMessage: '',
      successMessage: '',
    };
  },
  computed: {
    ...mapGetters('item', ['items', 'error', 'success']),
    headers() {
      return [
        { title: 'Nombre', key: 'name', headerProps: { class: 'font-weight-bold' } },
        { title: 'Descripción', key: 'description', headerProps: { class: 'font-weight-bold' } },
        { title: 'Precio', key: 'price', headerProps: { class: 'font-weight-bold' } },
        { title: 'Tipo de Ítem', key: 'itemType.name', headerProps: { class: 'font-weight-bold' } },
        { title: 'Imagen', value: 'imageUrl', headerProps: { class: 'font-weight-bold' } },
        { title: 'Estado', key: 'isActive', headerProps: { class: 'font-weight-bold' } },
        { title: 'Acciones', value: 'actions', sortable: false, headerProps: { class: 'font-weight-bold' } }
      ];
    },
    filteredItems() {
      if (!this.search) return this.items;
      const searchLower = this.search.toLowerCase();
      return this.items.filter(item =>
        item.name.toLowerCase().includes(searchLower)
      );
    }
  },
  methods: {
    ...mapActions('item', ['fetchItems', 'deleteItem']),
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
      this.$router.push({ name: 'ItemCreate' });
    },
    navigateToEdit(item) {
      this.$router.push({ name: 'ItemEdit', params: { id: item._id } });
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
          await this.deleteItem(this.editedItem._id);
          this.formattedSuccess(this.success, "Ítem eliminado con éxito");
          this.dialogDelete = false;
          this.fetchItems();
        } catch (error) {
          this.formattedError(this.error, "Error al eliminar el ítem");
        }
      }
    },
    closeDelete() {
      this.dialogDelete = false;
    },
    openImageModal(imageUrl) {
      this.selectedImage = imageUrl;
      this.imageDialog = true;
    },
    closeImageModal() {
      this.imageDialog = false;
    }
  },
  created() {
    this.fetchItems();
  }
};
</script>
