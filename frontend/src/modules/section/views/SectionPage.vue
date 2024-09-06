<template>
  <v-data-table :headers="headers" :items="filteredSections" :sort-by="[{ value: 'name', order: 'desc' }]" :items-per-page="10">
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
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ props }">
            <v-btn class="mb-2" color="primary" dark v-bind="props">
              Crear Sección
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" md="6" sm="6">
                    <v-text-field v-model="editedItem.name" label="Nombre" :rules="nameRules" required></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6" sm="6">
                    <v-select v-model="editedItem.isActive" :items="statusOptions" label="Estado" item-value="value"
                      item-text="title" required></v-select>
                  </v-col>
                </v-row>
              </v-container>
              <!-- Error Alert inside the modal -->
              <v-alert v-if="showErrorAlert" type="error" class="mt-3">
                {{ errorMessage }}
              </v-alert>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="close">
                Cancelar
              </v-btn>
              <v-btn color="blue-darken-1" variant="text" @click="save">
                Guardar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- Delete Confirmation Dialog -->
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">
              ¿Estás seguro de querer eliminar este item?
            </v-card-title>
            <!-- Error Alert inside the modal -->
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
      </v-toolbar>
    </template>

    <!-- Columnas de acciones -->
    <template v-slot:[`item.actions`]="{ item }">
      <v-icon class="me-2" size="small" @click="editItem(item)">
        mdi-pencil
      </v-icon>
      <v-icon size="small" @click="deleteItem(item)">
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
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { nameRules } from '@/utils/validateSection';

export default {
  data() {
    return {
      dialog: false,
      dialogDelete: false,
      search: '',
      editedIndex: -1,
      editedItem: {
        name: '',
        isActive: true
      },
      defaultItem: {
        name: '',
        isActive: true
      },
      statusOptions: [
        { title: 'Active', value: true },
        { title: 'Inactive', value: false }
      ],
      nameRules,
      showErrorAlert: false
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
    formTitle() {
      return this.editedIndex === -1 ? 'Nuevo Item' : 'Editar Item';
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
    ...mapActions('section', ['createSection', 'updateSection', 'deleteSection', 'fetchSections']),
    editItem(item) {
      this.editedIndex = this.sections.indexOf(item);
      this.editedItem = { ...item };
      this.dialog = true;
    },
    async deleteItem(item) {
      this.editedItem = item;
      this.dialogDelete = true;
    },
    async deleteItemConfirm() {
      const errorMsg = await this.deleteSection(this.editedItem._id);
      if (errorMsg) {
        this.showErrorAlert = true;
        this.errorMessage = errorMsg;
      } else {
        this.dialogDelete = false;
      }
    },
    close() {
      this.dialog = false;
      this.editedItem = { ...this.defaultItem };
      this.editedIndex = -1;
      this.showErrorAlert = false;
    },
    closeDelete() {
      this.dialogDelete = false;
      this.showErrorAlert = false;
    },
    async save() {
      this.showErrorAlert = false;
      let errorMsg = null;
      if (this.editedIndex > -1) {
        errorMsg = await this.updateSection({
          id: this.editedItem._id,
          sectionData: this.editedItem
        });
      } else {
        errorMsg = await this.createSection(this.editedItem);
      }
      if (errorMsg) {
        this.showErrorAlert = true;
        this.errorMessage = errorMsg;
      } else {
        this.close();
      }
    }
  },
  async created() {
    await this.fetchSections();
  }
};
</script>
