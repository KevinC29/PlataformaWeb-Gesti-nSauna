<template>
  <v-data-table :headers="headers" :items="filteredItems" v-model:sort-by="sortBy" :items-per-page="10">
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>USUARIOS</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-text-field v-model="search" density="compact" label="Buscar" prepend-inner-icon="mdi-magnify"
          variant="solo-filled" flat hide-details single-line></v-text-field>
        <v-spacer></v-spacer>
        <v-btn class="mb-2" color="primary" dark @click="navigateToCreate">
          Crear Usuario
        </v-btn>
      </v-toolbar>
    </template>

    <!-- Columna de Nombre -->
    <template v-slot:[`item.name`]="{ item }">
      {{ item.name }}
    </template>

    <!-- Columna de Apellido -->
    <template v-slot:[`item.lastName`]="{ item }">
      {{ item.lastName }}
    </template>

    <!-- Columna de DNI -->
    <template v-slot:[`item.dni`]="{ item }">
      {{ item.dni }}
    </template>

    <!-- Columna de Correo Electrónico -->
    <template v-slot:[`item.email`]="{ item }">
      {{ item.email ? item.email : 'N/A' }}
    </template>

    <!-- Columna de Rol -->
    <template v-slot:[`item.role`]="{ item }">
      {{ item.role.name }} <!-- Asumiendo que 'role' es un objeto con una propiedad 'name' -->
    </template>

    <!-- Columna de Estado -->
    <template v-slot:[`item.isActive`]="{ item }">
      <v-chip :color="item.isActive ? 'green' : 'red'" class="text-uppercase" size="small" label>
        {{ item.isActive ? 'Activo' : 'Inactivo' }}
      </v-chip>
    </template>

    <!-- Columna de Estado de Credencial -->
    <template v-slot:[`item.credentialStatus`]="{ item }">
      <v-btn @click="toggleCredentialStatus(item)" :color="item.credentialStatus ? 'green' : 'red'"
        class="text-uppercase" small>
        {{ item.credentialStatus ? 'Activo' : 'Inactivo' }}
      </v-btn>
    </template>

    <!-- Columna de Resetear Contraseña -->
    <template v-slot:[`item.resetPassword`]="{ item }">
      <v-btn @click="resetPassword(item)" color="primary" small>
        Resetear
      </v-btn>
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

    <!-- Sin datos -->
    <template v-slot:no-data>
      <v-btn color="primary" @click="fetchUsers">
        Reiniciar
      </v-btn>
    </template>
  </v-data-table>

  <!-- Delete Confirmation Dialog -->
  <v-dialog v-model="dialogDelete" max-width="500px">
    <v-card>
      <v-card-title class="text-h5">
        ¿Estás seguro de querer eliminar este usuario?
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

  <!-- Status Update Dialog -->
  <v-dialog v-model="dialogStatusUpdate" max-width="500px">
    <v-card>
      <v-card-title class="text-h5">
        {{ statusUpdateSuccessMessage }}
      </v-card-title>
      <v-alert v-if="statusUpdateErrorMessage" type="error" class="mt-3">
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

  <!-- Password Reset Dialog -->
  <v-dialog v-model="dialogResetPassword" max-width="500px">
    <v-card>
      <v-card-title class="text-h5">
        {{ passwordResetSuccessMessage }}
      </v-card-title>
      <v-alert v-if="passwordResetErrorMessage" type="error" class="mt-3">
        {{ passwordResetErrorMessage }}
      </v-alert>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue-darken-1" variant="text" @click="closePasswordReset">
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
      dialogStatusUpdate: false,
      dialogResetPassword: false,
      editedItem: null,
      errorMessage: '',
      successMessage: '',
      statusUpdateSuccessMessage: '',
      statusUpdateErrorMessage: '',
      passwordResetSuccessMessage: '',
      passwordResetErrorMessage: '',
    };
  },
  computed: {
    ...mapGetters('user', ['users', 'error', 'success']),
    headers() {
      return [
        { title: 'Nombre', key: 'name', align: 'start' },
        { title: 'Apellido', key: 'lastName' },
        { title: 'DNI', key: 'dni' },
        { title: 'Correo Electrónico', key: 'email' },
        { title: 'Rol', key: 'role.name' },
        { title: 'Estado Usuario', key: 'isActive' },
        { title: 'Estado Credencial', key: 'credentialStatus' },
        { title: 'Resetear Contraseña', value: 'resetPassword', sortable: false },
        { title: 'Acciones', value: 'actions', sortable: false }
      ];
    },
    filteredItems() {
      if (!this.search) return this.users;
      const searchLower = this.search.toLowerCase();
      return this.users.filter(user =>
        user.name.toLowerCase().includes(searchLower) ||
        user.lastName.toLowerCase().includes(searchLower) ||
        user.dni.toLowerCase().includes(searchLower) ||
        (user.email && user.email.toLowerCase().includes(searchLower))
      );
    }
  },
  methods: {
    ...mapActions('user', ['fetchUsers', 'deleteUser', 'updateCredentialStatus', 'resetPasswordCredential']),
    formattedError(option, error, message) {
      if (option === 0) {
        this.errorMessage = error || message;
        setTimeout(() => {
          this.errorMessage = '';
        }, 2000);
      } else if (option === 1) {
        this.statusUpdateErrorMessage = error || message;
        setTimeout(() => {
          this.statusUpdateErrorMessage = '';
        }, 2000);
      } else {
        this.passwordResetErrorMessage = error || message;
        setTimeout(() => {
          this.passwordResetErrorMessage = '';
        }, 2000);
      }
    },
    formattedSuccess(option, success, message) {
      if (option === 0) {
        this.successMessage = success || message;
        setTimeout(() => {
          this.successMessage = '';
        }, 2000);
      } else if (option === 1) {
        this.statusUpdateSuccessMessage = success || message;
        setTimeout(() => {
          this.statusUpdateSuccessMessage = '';
        }, 2000);
      } else {
        this.passwordResetSuccessMessage = success || message;
        setTimeout(() => {
          this.passwordResetSuccessMessage = '';
        }, 2000);
      }
    },
    navigateToCreate() {
      this.$router.push({ name: 'UserCreate' });
    },
    navigateToEdit(user) {
      this.$router.push({ name: 'UserEdit', params: { id: user._id } });
    },
    async confirmDelete(user) {
      this.editedItem = user;
      this.dialogDelete = true;
      this.successMessage = '';
      this.errorMessage = '';
    },
    async deleteItemConfirm() {
      if (this.editedItem) {
        try {
          await this.deleteUser(this.editedItem._id);
          this.formattedSuccess(0, this.success, "Usuario eliminado con éxito");
          this.dialogDelete = false;
          this.fetchUsers();
        } catch (error) {
          this.formattedError(0, this.error, "Error al eliminar el usuario");
        }
      }
    },
    closeDelete() {
      this.dialogDelete = false;
    },
    async toggleCredentialStatus(user) {
      try {
        const newStatus = !user.credentialStatus;
        await this.updateCredentialStatus({ _id: user._id, isActive: newStatus });
        this.formattedSuccess(1, this.success, "Status actualizado con éxito");
        this.dialogStatusUpdate = true;
        user.credentialStatus = newStatus;
      } catch (error) {
        this.formattedError(1, this.error, "Error al modificar el status");
        this.dialogStatusUpdate = true;
      }
    },
    closeStatusUpdate() {
      this.dialogStatusUpdate = false;
    },
    async resetPassword(user) {
      try {
        const email = user.email || user.dni;
        await this.resetPasswordCredential({ email });
        this.formattedSuccess(2, this.success, "Contraseña reseteada con éxito");
        this.dialogResetPassword = true;
      } catch (error) {
        this.formattedSuccess(2, this.success, "Error al resetear la contraseña");
        this.dialogResetPassword = true;
      }
    },
    closePasswordReset() {
      this.dialogResetPassword = false;
    }
  },
  created() {
    this.fetchUsers();
  }
};
</script>
