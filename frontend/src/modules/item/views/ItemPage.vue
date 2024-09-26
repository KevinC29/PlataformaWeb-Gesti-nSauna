<template>
  <v-data-table :headers="headers" :items="filteredItems" v-model:sort-by="sortBy" :items-per-page="10">
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>ÍTEMS</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-text-field v-model="search" density="compact" label="Buscar" prepend-inner-icon="mdi-magnify"
          variant="solo-filled" flat hide-details single-line></v-text-field>
        <v-spacer></v-spacer>
        <v-btn class="mb-2" color="primary" dark @click="navigateToCreate">
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
      <v-chip :color="item.isActive ? 'green' : 'red'" class="text-uppercase" size="small" label>
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
      <v-card-actions></v-card-actions>
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
        { title: 'Nombre', key: 'name', align: 'start' },
        { title: 'Descripción', key: 'description' },
        { title: 'Precio', key: 'price' },
        { title: 'Tipo de Ítem', key: 'itemType.name' },
        { title: 'Imagen', value: 'imageUrl' },
        { title: 'Estado', key: 'isActive' },
        { title: 'Acciones', value: 'actions', sortable: false }
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
          this.successMessage = this.success;
          this.errorMessage = '';
          setTimeout(() => {
            this.dialogDelete = false;
          }, 2000);
          this.fetchItems();
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
