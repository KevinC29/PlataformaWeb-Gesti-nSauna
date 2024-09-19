<template>
  <v-data-table :headers="headers" :items="filteredItems" :sort-by="[{ value: 'date', order: 'desc' }]"
    :items-per-page="10">
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>COMENTARIOS</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-text-field v-model="search" density="compact" label="Buscar" prepend-inner-icon="mdi-magnify"
          variant="solo-filled" flat hide-details single-line></v-text-field>
        <v-spacer></v-spacer>
        <v-btn class="mb-2" color="primary" dark @click="navigateToCreate">
          Crear Comentario
        </v-btn>
      </v-toolbar>
    </template>

    <!-- Columna de Fecha -->
    <template v-slot:[`item.date`]="{ item }">
      {{ new Date(item.date).toLocaleDateString() }}
    </template>

    <!-- Columna de Mensaje -->
    <template v-slot:[`item.message`]="{ item }">
      {{ item.message }}
    </template>

    <!-- Columna de Estado -->
    <template v-slot:[`item.isActive`]="{ item }">
      <v-btn :color="item.isActive ? 'green' : 'red'" @click="confirmStatusToggle(item)" class="text-uppercase" small>
        {{ item.isActive ? 'Activo' : 'Inactivo' }}
      </v-btn>
    </template>

    <!-- Columna de Cliente -->
    <template v-slot:[`item.client`]="{ item }">
      {{ item.client.user ? `${item.client.user.name} ${item.client.user.lastName}` : 'N/A' }}
    </template>

    <!-- Columna de Acciones -->
    <template v-slot:[`item.actions`]="{ item }">
      <v-icon size="small" @click="confirmDelete(item)">
        mdi-delete
      </v-icon>
    </template>

    <!-- Sin datos -->
    <template v-slot:no-data>
      <v-btn color="primary" @click="fetchComments">
        Reiniciar
      </v-btn>
    </template>
  </v-data-table>

  <!-- Delete Confirmation Dialog -->
  <v-dialog v-model="dialogDelete" max-width="500px">
    <v-card>
      <v-card-title class="text-h5">
        ¿Estás seguro de querer eliminar este comentario?
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

  <!-- Status Update Dialog -->
  <v-dialog v-model="dialogStatusUpdate" max-width="500px">
    <v-card>
      <v-card-title class="text-h5">
        {{ statusUpdateMessage }}
      </v-card-title>
      <v-alert v-if="showStatusUpdateError" type="error" class="mt-3">
        {{ statusUpdateErrorMessage }}
      </v-alert>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue-darken-1" variant="text" @click="closeStatusUpdate">
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
      search: '',
      dialogDelete: false,
      dialogStatusUpdate: false,
      editedItem: null,
      showErrorAlert: false,
      errorMessage: '',
      showStatusUpdateError: false,
      statusUpdateMessage: '',
      statusUpdateErrorMessage: '',
    };
  },
  computed: {
    ...mapGetters('comment', ['comments', 'error']),
    headers() {
      return [
        { title: 'Fecha', value: 'date', align: 'start' },
        { title: 'Cliente', value: 'client' },
        { title: 'Mensaje', value: 'message' },
        { title: 'Estado', value: 'isActive' },
        { title: 'Acciones', value: 'actions', sortable: false }
      ];
    },
    filteredItems() {
      if (!this.search) return this.comments;
      const searchLower = this.search.toLowerCase();
      return this.comments.filter(comment =>
        (comment.message && comment.message.toLowerCase().includes(searchLower)) ||
        (comment.client && comment.client.user && comment.client.user.name.toLowerCase().includes(searchLower))
      );
    }
  },
  methods: {
    ...mapActions('comment', ['fetchComments', 'deleteComment', 'updateCommentStatus']),

    navigateToCreate() {
      this.$router.push({ name: 'CommentCreate' });
    },
    async confirmDelete(comment) {
      this.editedItem = comment;
      this.dialogDelete = true;
    },
    async deleteItemConfirm() {
      if (this.editedItem) {
        const errorMsg = await this.deleteComment(this.editedItem._id);
        if (errorMsg) {
          this.showErrorAlert = true;
          this.errorMessage = errorMsg;
        } else {
          this.dialogDelete = false;
          this.fetchComments();
        }
      }
    },
    closeDelete() {
      this.dialogDelete = false;
      this.showErrorAlert = false;
    },
    async confirmStatusToggle(comment) {
      try {
        const newStatus = !comment.isActive;
        const successMessage = await this.updateCommentStatus({ _id: comment._id, isActive: newStatus });
        this.dialogStatusUpdate = true;
        this.statusUpdateMessage = successMessage;
        comment.isActive = newStatus;
        await this.fetchComments();
      } catch (error) {
        this.statusUpdateErrorMessage = error.response?.data?.error || 'Failed to update comment status';
        this.dialogStatusUpdate = true;
        this.showStatusUpdateError = true;
      }
    },
    closeStatusUpdate() {
      this.dialogStatusUpdate = false;
      this.showStatusUpdateError = false;
    }
  },
  created() {
    this.fetchComments();
  }
};
</script>