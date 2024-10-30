<template>
  <v-sheet class="mx-auto custom-form" width="600">
    <!-- Título centrado para el formulario -->
    <h2 class="text-center mb-4">Editar Usuario</h2>
    <v-form @submit.prevent="submitForm">
      <v-row>
        <v-col cols="12">
          <!-- Campo Nombre -->
          <label class="field-label">Nombres</label>
          <v-text-field v-model="state.name" :error-messages="v$.state.name.$errors.map(e => e.$message)" required
            @blur="v$.state.name.$touch" @input="v$.state.name.$touch" bg-color="cyan-lighten-5" color="#388e3c" rounded
            variant="solo-filled"></v-text-field>

          <!-- Campo Apellido -->
          <label class="field-label">Apellidos</label>
          <v-text-field v-model="state.lastName" :error-messages="v$.state.lastName.$errors.map(e => e.$message)"
            required @blur="v$.state.lastName.$touch" @input="v$.state.lastName.$touch" bg-color="cyan-lighten-5"
            color="#388e3c" rounded variant="solo-filled"></v-text-field>

          <!-- Campo Dirección -->
          <label class="field-label">Dirección</label>
          <v-text-field v-model="state.address" :error-messages="v$.state.address.$errors.map(e => e.$message)" required
            @blur="v$.state.address.$touch" @input="v$.state.address.$touch" bg-color="cyan-lighten-5" color="#388e3c"
            rounded variant="solo-filled"></v-text-field>

          <!-- Campo Telefono -->
          <label class="field-label">Teléfono</label>
          <v-text-field v-model="state.phone" :error-messages="v$.state.phone.$errors.map(e => e.$message)"
            @blur="v$.state.phone.$touch" @input="v$.state.phone.$touch" bg-color="cyan-lighten-5" color="#388e3c"
            rounded variant="solo-filled"></v-text-field>

          <!-- Campo DNI -->
          <label class="field-label">DNI</label>
          <v-text-field v-model="state.dni" :error-messages="v$.state.dni.$errors.map(e => e.$message)" required
            @blur="v$.state.dni.$touch" @input="v$.state.dni.$touch" bg-color="cyan-lighten-5" color="#388e3c" rounded
            variant="solo-filled"></v-text-field>

          <!-- Campo Email -->
          <label class="field-label">Correo Electrónico</label>
          <v-text-field v-model="state.email" :error-messages="v$.state.email.$errors.map(e => e.$message)" type="email"
            @blur="v$.state.email.$touch" @input="v$.state.email.$touch" bg-color="cyan-lighten-5" color="#388e3c"
            rounded variant="solo-filled"></v-text-field>

          <!-- Campo Rol (Selector) -->
          <label class="field-label">Rol</label>
          <v-select v-model="state.role" :items="rolesList" item-value="_id" item-title="name" clearable dense
            :error-messages="v$.state.role.$errors.map(e => e.$message)" required @change="v$.state.role.$touch"
            @blur="v$.state.role.$touch" bg-color="cyan-lighten-5" color="#388e3c" rounded
            variant="solo-filled"></v-select>

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
import { editUserValidations } from '@/validators/userValidations.js';
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
        isActive: true,
        role: null,
      },
      rolesList: [],
      errorMessage: '',
      successMessage: '',
    };
  },
  computed: {
    ...mapGetters('user', ['roles', 'user', 'error', 'success']),
  },
  methods: {
    ...mapActions('user', ['updateUser', 'fetchAndSetRoles', 'fetchUser']),
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

        await this.fetchUser(this.$route.params.id);
        const user = this.user;
        this.state = {
          name: user.name,
          lastName: user.lastName,
          address: user.address,
          phone: user.phone,
          dni: user.dni,
          email: user.email,
          isActive: user.isActive,
          role: user.role._id,
        };
      } catch (error) {
        this.formattedError(this.error, "Error al cargar los datos");
      }
    },

    async submitForm() {
      this.v$.$touch();

      if (this.v$.$invalid) {
        return;
      }

      const userData = {
        name: this.state.name,
        lastName: this.state.lastName,
        address: this.state.address,
        phone: this.state.phone,
        dni: this.state.dni,
        email: this.state.email || '',
        isActive: this.state.isActive,
        role: this.state.role,
      };

      try {
        await this.updateUser({ id: this.$route.params.id, userData });
        this.formattedSuccess(this.success, "Usuario actualizado con éxito");
      } catch (error) {
        this.formattedError(this.error, "Error al modificar el usuario");
      }
    },

    cancel() {
      this.$router.push({ name: 'UserList' });
    },
  },
  validations() {
    return editUserValidations();
  },
  setup() {
    const v$ = useVuelidate();
    return { v$ };
  },
  async created() {
    await this.fetchData();
  }
};
</script>
