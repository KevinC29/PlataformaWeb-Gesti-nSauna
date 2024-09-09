<template>
  <v-data-table
    :headers="headers"
    :items="filteredSections"
    :sort-by="[{ value: 'name', order: 'desc' }]"
    :items-per-page="10"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>SECCIONES</v-toolbar-title>
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
          Crear Sección
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
      <v-btn color="primary" @click="fetchSections">
        Reiniciar
      </v-btn>
    </template>
  </v-data-table>

  <!-- Delete Confirmation Dialog -->
  <v-dialog v-model="dialogDelete" max-width="500px">
    <v-card>
      <v-card-title class="text-h5">
        ¿Estás seguro de querer eliminar este item?
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
    ...mapGetters('section', ['sections', 'error']),
    headers() {
      return [
        { title: 'Nombre', value: 'name', align: 'start' },
        { title: 'Estado', value: 'isActive' },
        { title: 'Acciones', value: 'actions', sortable: false }
      ];
    },
    filteredSections() {
      if (!this.search) return this.sections;
      const searchLower = this.search.toLowerCase();
      return this.sections.filter(section =>
        section.name.toLowerCase().includes(searchLower)
      );
    }
  },
  methods: {
    ...mapActions('section', ['fetchSections', 'deleteSection']),

    navigateToCreate() {
      this.$router.push({ name: 'SectionCreate' });
    },
    navigateToEdit(item) {
      this.$router.push({ name: 'SectionEdit', params: { id: item._id } });
    },
    async confirmDelete(item) {
      this.editedItem = item;
      this.dialogDelete = true;
    },
    async deleteItemConfirm() {
      if (this.editedItem) {
        const errorMsg = await this.deleteSection(this.editedItem._id);
        if (errorMsg) {
          this.showErrorAlert = true;
          this.errorMessage = errorMsg;
        } else {
          this.dialogDelete = false;
          this.fetchSections();
        }
      }
    },
    closeDelete() {
      this.dialogDelete = false;
      this.showErrorAlert = false;
    }
  },
  created() {
    this.fetchSections();
  }
};
</script>
