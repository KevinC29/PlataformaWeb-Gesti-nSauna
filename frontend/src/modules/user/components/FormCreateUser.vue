<template>
  <v-sheet class="mx-auto custom-form" width="600">
    <!-- Título centrado para el formulario -->
    <h2 class="text-center mb-4">Crear Usuario</h2>
    <v-form @submit.prevent="submitForm">
      <v-row>
        <v-col cols="12">
          <!-- Campos de usuario -->
          <label class="field-label">Nombres</label>
          <v-text-field v-model="state.name" :error-messages="v$.state.name.$errors.map(e => e.$message)" required
            @blur="v$.state.name.$touch" @input="v$.state.name.$touch" bg-color="cyan-lighten-5" color="#388e3c" rounded
            variant="solo-filled"></v-text-field>

          <label class="field-label">Apellidos</label>
          <v-text-field v-model="state.lastName" :error-messages="v$.state.lastName.$errors.map(e => e.$message)"
            required @blur="v$.state.lastName.$touch" @input="v$.state.lastName.$touch" bg-color="cyan-lighten-5"
            color="#388e3c" rounded variant="solo-filled"></v-text-field>

          <label class="field-label">Dirección</label>
          <v-text-field v-model="state.address" :error-messages="v$.state.address.$errors.map(e => e.$message)" required
            @blur="v$.state.address.$touch" @input="v$.state.address.$touch" bg-color="cyan-lighten-5" color="#388e3c"
            rounded variant="solo-filled"></v-text-field>

          <label class="field-label">Teléfono</label>
          <v-text-field v-model="state.phone" :error-messages="v$.state.phone.$errors.map(e => e.$message)"
            @blur="v$.state.phone.$touch" @input="v$.state.phone.$touch" bg-color="cyan-lighten-5" color="#388e3c"
            rounded variant="solo-filled"></v-text-field>

          <label class="field-label">DNI</label>
          <v-text-field v-model="state.dni" :error-messages="v$.state.dni.$errors.map(e => e.$message)" required
            @blur="v$.state.dni.$touch" @input="v$.state.dni.$touch" bg-color="cyan-lighten-5" color="#388e3c" rounded
            variant="solo-filled"></v-text-field>

          <label class="field-label">Correo Electrónico</label>
          <v-text-field v-model="state.email" :error-messages="v$.state.email.$errors.map(e => e.$message)"
            @blur="v$.state.email.$touch" @input="v$.state.email.$touch" bg-color="cyan-lighten-5" color="#388e3c"
            rounded variant="solo-filled"></v-text-field>

          <label class="field-label">Rol</label>
          <v-select v-model="state.role" :items="rolesList" item-value="_id" item-title="name" clearable dense
            :error-messages="v$.state.role.$errors.map(e => e.$message)" required @update:modelValue="onRoleChange"
            @blur="v$.state.role.$touch" bg-color="cyan-lighten-5" color="#388e3c" rounded
            variant="solo-filled"></v-select>

          <v-col v-if="showPasswordFields" cols="12">
            <!-- Campos Contraseña y Confirmar Contraseña (Solo si el rol es ADMIN o CASHIER) -->
            <label class="field-label">Contraseña</label>
            <v-text-field v-model="state.password" :error-messages="v$.state.password.$errors.map(e => e.$message)"
              :type="passwordFieldType" required @blur="v$.state.password.$touch" @input="v$.state.password.$touch"
              :append-inner-icon="passwordFieldType === 'password' ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append-inner="togglePasswordVisibility" bg-color="cyan-lighten-5" color="#388e3c" rounded
              variant="solo-filled">
            </v-text-field>

            <label class="field-label">Confirmar Contraseña</label>
            <v-text-field v-model="state.confirmPassword"
              :error-messages="v$.state.confirmPassword.$errors.map(e => e.$message)" :type="confirmPasswordFieldType"
              required @blur="v$.state.confirmPassword.$touch" @input="v$.state.confirmPassword.$touch"
              :append-inner-icon="confirmPasswordFieldType === 'password' ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append-inner="toggleConfirmPasswordVisibility" bg-color="cyan-lighten-5" color="#388e3c" rounded
              variant="solo-filled">
            </v-text-field>
          </v-col>

          <!-- Campo Estado (Checkbox para 'isActive') -->
          <label class="field-label">Activar Usuario</label>
          <v-checkbox v-model="state.isActive" :error-messages="v$.state.isActive.$errors.map(e => e.$message)"
            @change="v$.state.isActive.$touch"></v-checkbox>
        </v-col>
      </v-row>

      <!-- Botones -->
      <v-row justify="end" class="mb-4">
        <v-btn class="custom-submit-btn" type="submit">
          Guardar
        </v-btn>
        <v-btn class="custom-cancel-btn" @click="cancel">
          Cancelar
        </v-btn>
      </v-row>

      <!-- Alerta de errores generales -->
      <v-alert v-if="errorMessage" type="error" class="mt-3" border>
        {{ errorMessage }}
      </v-alert>

      <!-- Alerta de éxito general -->
      <v-alert v-if="successMessage" type="success" class="mt-3" border>
        {{ successMessage }}
      </v-alert>
    </v-form>
  </v-sheet>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { useVuelidate } from '@vuelidate/core';
import { createUserValidations } from '@/validators/userValidations.js';
import '@/assets/styles/buttons.css';
import '@/assets/styles/forms.css';

export default {
  data() {
    return {
      state: {
        name: '',
        lastName: '',
        address: '',
        phone: '',
        dni: '',
        email: '',
        role: null,
        password: '',
        confirmPassword: '',
        isActive: true,
      },
      rolesList: [],
      errorMessage: '',
      successMessage: '',
      showPasswordFields: false,
      passwordFieldType: 'password',
      confirmPasswordFieldType: 'password',
    };
  },
  computed: {
    ...mapGetters('user', ['roles', 'error', 'success']),
  },
  methods: {
    ...mapActions('user', ['fetchAndSetRoles', 'createUser']),
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
        this.$router.push({ name: 'UserList' });
      }, 2000);
    },
    async fetchData() {
      try {
        await this.fetchAndSetRoles();
        this.rolesList = this.roles
          .filter(role => role.isActive)
          .map(role => ({
            _id: role._id,
            name: role.name,
          }));
      } catch (error) {
        this.formattedError(this.error, "Error al cargar los datos");
      }
    },

    onRoleChange(newRole) {
      const adminOrCashierRoles = ['ADMIN', 'CASHIER'];
      const selectedRole = this.rolesList.find(role => role._id === newRole);
      this.showPasswordFields = selectedRole && adminOrCashierRoles.includes(selectedRole.name);
    },

    togglePasswordVisibility() {
      this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
    },

    toggleConfirmPasswordVisibility() {
      this.confirmPasswordFieldType = this.confirmPasswordFieldType === 'password' ? 'text' : 'password';
    },

    async submitForm() {
      this.v$.$touch();

      if (this.v$.$invalid) return;

      const userData = {
        name: this.state.name,
        lastName: this.state.lastName,
        address: this.state.address,
        phone: this.state.phone,
        dni: this.state.dni,
        email: this.state.email || '',
        role: this.state.role,
        isActive: this.state.isActive,
      };

      if (this.showPasswordFields) {
        userData.password = this.state.password;
        userData.confirmPassword = this.state.confirmPassword;
      }

      try {
        await this.createUser(userData);
        this.formattedSuccess(this.success, "Usuario creado con éxito");
      } catch (error) {
        this.formattedError(this.error, "Error al crear el usuario");
      }
    },

    cancel() {
      this.$router.push({ name: 'UserList' });
    },
  },
  validations() {
    return createUserValidations(this.showPasswordFields);
  },

  setup() {
    const v$ = useVuelidate();
    return { v$ };
  },
  async created() {
    await this.fetchData();
  },
};
</script>
