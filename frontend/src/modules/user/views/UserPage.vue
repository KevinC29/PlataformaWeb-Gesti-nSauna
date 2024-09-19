<template>
  <v-data-table
    :headers="headers"
    :items="filteredItems"
    :sort-by="[{ value: 'name', order: 'desc' }] "
    :items-per-page="10"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>USUARIOS</v-toolbar-title>
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
      {{ item.email ? item.email : 'N/A'}}
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
      <v-btn @click="toggleCredentialStatus(item)" :color="item.credentialStatus ? 'green' : 'red'" class="text-uppercase" small>
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

  <!-- Password Reset Dialog -->
  <v-dialog v-model="dialogResetPassword" max-width="500px">
    <v-card>
      <v-card-title class="text-h5">
        {{ passwordResetMessage }}
      </v-card-title>
      <v-alert v-if="showPasswordResetError" type="error" class="mt-3">
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
      search: '',
      dialogDelete: false,
      dialogStatusUpdate: false,
      dialogResetPassword: false,
      editedItem: null,
      showErrorAlert: false,
      errorMessage: '',
      showStatusUpdateError: false,
      statusUpdateMessage: '',
      statusUpdateErrorMessage: '',
      showPasswordResetError: false,
      passwordResetMessage: '',
      passwordResetErrorMessage: '',
    };
  },
  computed: {
    ...mapGetters('user', ['users', 'error']),
    headers() {
      return [
        { title: 'Nombre', value: 'name', align: 'start' },
        { title: 'Apellido', value: 'lastName' },
        { title: 'DNI', value: 'dni' },
        { title: 'Correo Electrónico', value: 'email' },
        { title: 'Rol', value: 'role.name' },
        { title: 'Estado Usuario', value: 'isActive' },
        { title: 'Estado Credencial', value: 'credentialStatus' },
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
    
    navigateToCreate() {
      this.$router.push({ name: 'UserCreate' });
    },
    navigateToEdit(user) {
      this.$router.push({ name: 'UserEdit', params: { id: user._id } });
    },
    async confirmDelete(user) {
      this.editedItem = user;
      this.dialogDelete = true;
    },
    async deleteItemConfirm() {
      if (this.editedItem) {
        const errorMsg = await this.deleteUser(this.editedItem._id);
        if (errorMsg) {
          this.showErrorAlert = true;
          this.errorMessage = errorMsg;
        } else {
          this.dialogDelete = false;
          this.fetchUsers();
        }
      }
    },
    closeDelete() {
      this.dialogDelete = false;
      this.showErrorAlert = false;
    },
    async toggleCredentialStatus(user) {
      try {
        const newStatus = !user.credentialStatus;
        const successMessage = await this.updateCredentialStatus({ _id: user._id, isActive: newStatus });
        this.statusUpdateMessage = successMessage;
        this.dialogStatusUpdate = true;
        user.credentialStatus = newStatus;
      } catch (error) {
        this.statusUpdateErrorMessage = error.response?.data?.error || 'Failed to update credential status';
        this.dialogStatusUpdate = true;
        this.showStatusUpdateError = true;
      }
    },
    closeStatusUpdate() {
      this.dialogStatusUpdate = false;
      this.showStatusUpdateError = false;
    },
    async resetPassword(user) {
    try {
      const email = user.email || user.dni;
      const successMessage = await this.resetPasswordCredential({ email });
      this.passwordResetMessage = successMessage;
      this.dialogResetPassword = true;
      this.showPasswordResetError = false;
    } catch (error) {
      this.passwordResetErrorMessage = error.response?.data?.error || 'Failed to reset password';
      this.dialogResetPassword = true;
      this.showPasswordResetError = true;
    }
  },
  closePasswordReset() {
    this.dialogResetPassword = false;
    this.showPasswordResetError = false;
  }
  },
  created() {
    this.fetchUsers();
  }
};
</script>
