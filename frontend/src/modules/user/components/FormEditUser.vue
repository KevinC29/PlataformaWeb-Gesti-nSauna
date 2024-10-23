<template>
  <form @submit.prevent="submitForm">
    <!-- Campo Nombre -->
    <v-text-field v-model="state.name" :error-messages="v$.state.name.$errors.map(e => e.$message)" label="Nombre"
      required @blur="v$.state.name.$touch" @input="v$.state.name.$touch"></v-text-field>

    <!-- Campo Apellido -->
    <v-text-field v-model="state.lastName" :error-messages="v$.state.lastName.$errors.map(e => e.$message)"
      label="Apellido" required @blur="v$.state.lastName.$touch" @input="v$.state.lastName.$touch"></v-text-field>

    <!-- Campo Dirección -->
    <v-text-field v-model="state.address" :error-messages="v$.state.address.$errors.map(e => e.$message)"
      label="Dirección" required @blur="v$.state.address.$touch" @input="v$.state.address.$touch"></v-text-field>
      
    <!-- Campo Telefono -->
    <v-text-field v-model="state.phone" :error-messages="v$.state.phone.$errors.map(e => e.$message)"
      label="Teléfono" @blur="v$.state.phone.$touch" @input="v$.state.phone.$touch"></v-text-field>

    <!-- Campo DNI -->
    <v-text-field v-model="state.dni" :error-messages="v$.state.dni.$errors.map(e => e.$message)" label="DNI" required
      @blur="v$.state.dni.$touch" @input="v$.state.dni.$touch"></v-text-field>

    <!-- Campo Email -->
    <v-text-field v-model="state.email" :error-messages="v$.state.email.$errors.map(e => e.$message)" label="Email"
      type="email" @blur="v$.state.email.$touch" @input="v$.state.email.$touch"></v-text-field>

    <!-- Campo Rol (Selector) -->
    <v-select v-model="state.role" :items="rolesList" item-value="_id" item-title="name" clearable dense
      :error-messages="v$.state.role.$errors.map(e => e.$message)" label="Rol" required @change="v$.state.role.$touch"
      @blur="v$.state.role.$touch"></v-select>

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
    <v-btn class="me-4" color="primary" type="submit">
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
import { editUserValidations } from '@/validators/userValidations.js';

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
        this.$router.push({ name: 'UserList' });
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
