<template>
  <form @submit.prevent="submitForm">
    <!-- Campos de usuario -->
    <v-text-field v-model="state.name" :error-messages="v$.state.name.$errors.map(e => e.$message)" label="Nombre"
      required @blur="v$.state.name.$touch" @input="v$.state.name.$touch"></v-text-field>

    <v-text-field v-model="state.lastName" :error-messages="v$.state.lastName.$errors.map(e => e.$message)"
      label="Apellido" required @blur="v$.state.lastName.$touch" @input="v$.state.lastName.$touch"></v-text-field>

    <v-text-field v-model="state.dni" :error-messages="v$.state.dni.$errors.map(e => e.$message)" label="DNI" required
      @blur="v$.state.dni.$touch" @input="v$.state.dni.$touch"></v-text-field>

    <!-- Elimina el atributo 'required' del campo de correo -->
    <v-text-field v-model="state.email" :error-messages="v$.state.email.$errors.map(e => e.$message)"
      label="Correo Electrónico" @blur="v$.state.email.$touch" @input="v$.state.email.$touch"></v-text-field>

    <!-- Campo Rol (Selector) -->
    <v-select v-model="state.role" :items="rolesList" item-value="_id" item-title="name" clearable dense
      :error-messages="v$.state.role.$errors.map(e => e.$message)" label="Rol" required
      @update:modelValue="onRoleChange" @blur="v$.state.role.$touch"></v-select>

    <!-- Campos Contraseña y Confirmar Contraseña (Solo si el rol es ADMIN o CASHIER) -->
    <v-text-field v-if="showPasswordFields" v-model="state.password"
      :error-messages="v$.state.password.$errors.map(e => e.$message)" label="Contraseña" :type="passwordFieldType"
      required @blur="v$.state.password.$touch" @input="v$.state.password.$touch"
      :append-icon="passwordFieldType === 'password' ? 'mdi-eye-off' : 'mdi-eye'"
      @click:append="togglePasswordVisibility">
    </v-text-field>

    <v-text-field v-if="showPasswordFields" v-model="state.confirmPassword"
      :error-messages="v$.state.confirmPassword.$errors.map(e => e.$message)" label="Confirmar Contraseña"
      :type="confirmPasswordFieldType" required @blur="v$.state.confirmPassword.$touch"
      @input="v$.state.confirmPassword.$touch"
      :append-icon="confirmPasswordFieldType === 'password' ? 'mdi-eye-off' : 'mdi-eye'"
      @click:append="toggleConfirmPasswordVisibility">
    </v-text-field>

    <!-- Campo Estado (Checkbox para 'isActive') -->
    <v-checkbox v-model="state.isActive" :error-messages="v$.state.isActive.$errors.map(e => e.$message)" label="Activo"
      @change="v$.state.isActive.$touch"></v-checkbox>

    <!-- Alerta de errores -->
    <v-alert v-if="errorMessage" type="error" dismissible>
      {{ errorMessage }}
    </v-alert>

    <!-- Alerta de éxito -->
    <v-alert v-if="successMessage" type="success" dismissible>
      {{ successMessage }}
    </v-alert>

    <!-- Botones -->
    <v-btn class="me-4" color="primary" @click="submitForm">
      Guardar
    </v-btn>
    <v-btn color="secondary" @click="cancel">
      Cancelar
    </v-btn>
  </form>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { useVuelidate } from '@vuelidate/core';
import { required, email as emailValidator } from '@vuelidate/validators';

export default {
  data() {
    return {
      state: {
        name: '',
        lastName: '',
        dni: '',
        email: '',
        role: null,
        password: '',
        confirmPassword: '',
        isActive: true,
      },
      rolesList: [], // Lista de roles
      errorMessage: '',
      successMessage: '',
      showPasswordFields: false, // Flag para mostrar campos de contraseña
      passwordFieldType: 'password', // Tipo de campo de contraseña
      confirmPasswordFieldType: 'password' // Tipo de campo de confirmar contraseña
    };
  },
  computed: {
    ...mapGetters('user', ['roles', 'error']),
  },
  methods: {
    ...mapActions('user', ['fetchAndSetRoles', 'createUser']),

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
        this.errorMessage = 'Error al cargar los roles: ' + (error.message || 'Desconocido');
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
        const errorMsg = await this.createUser(userData);

        if (errorMsg) {
          this.errorMessage = errorMsg;
          this.successMessage = '';
        } else {
          this.successMessage = 'Usuario creado con éxito';
          this.errorMessage = '';

          setTimeout(() => {
            this.$router.push({ name: 'UserList' });
          }, 2000);
        }
      } catch (error) {
        this.errorMessage = 'Error en el envío del formulario: ' + (error.message || 'Desconocido');
        this.successMessage = '';
      }
    },

    cancel() {
      this.$router.push({ name: 'UserList' });
    },
  },
  validations() {
    return {
      state: {
        name: { required },
        lastName: { required },
        dni: { required },
        email: { emailValidator }, // Validación de email si no está vacío
        role: { required },
        password: {
          required: this.showPasswordFields,
          $lte: this.state.confirmPassword
        },
        confirmPassword: {
          required: this.showPasswordFields,
          $lte: this.state.password
        },
        isActive: { required },
      },
    };
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
