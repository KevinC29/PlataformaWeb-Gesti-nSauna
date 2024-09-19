<template>
  <form @submit.prevent="submitForm">
    <!-- Campo Nombre -->
    <v-text-field
      v-model="state.name"
      :error-messages="v$.state.name.$errors.map(e => e.$message)"
      label="Nombre"
      required
      @blur="v$.state.name.$touch"
      @input="v$.state.name.$touch"
    ></v-text-field>

    <!-- Campo Apellido -->
    <v-text-field
      v-model="state.lastName"
      :error-messages="v$.state.lastName.$errors.map(e => e.$message)"
      label="Apellido"
      required
      @blur="v$.state.lastName.$touch"
      @input="v$.state.lastName.$touch"
    ></v-text-field>

    <!-- Campo DNI -->
    <v-text-field
      v-model="state.dni"
      :error-messages="v$.state.dni.$errors.map(e => e.$message)"
      label="DNI"
      required
      @blur="v$.state.dni.$touch"
      @input="v$.state.dni.$touch"
    ></v-text-field>

    <!-- Campo Email -->
    <v-text-field
      v-model="state.email"
      :error-messages="v$.state.email.$errors.map(e => e.$message)"
      label="Email"
      type="email"
      @blur="v$.state.email.$touch"
      @input="v$.state.email.$touch"
    ></v-text-field>

    <!-- Campo Rol (Selector) -->
    <v-select
      v-model="state.role"
      :items="rolesList"
      item-value="_id"
      item-title="name"
      clearable
      dense
      :error-messages="v$.state.role.$errors.map(e => e.$message)"
      label="Rol"
      required
      @change="v$.state.role.$touch"
      @blur="v$.state.role.$touch"
    ></v-select>

    <!-- Campo Estado (Checkbox para 'isActive') -->
    <v-checkbox
      v-model="state.isActive"
      :error-messages="v$.state.isActive.$errors.map(e => e.$message)"
      label="Activo"
      @change="v$.state.isActive.$touch"
    ></v-checkbox>

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
import { required, minLength, email } from '@vuelidate/validators';

export default {
  data() {
    return {
      state: {
        name: '',
        lastName: '',
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
    ...mapGetters('user', ['roles', 'user', 'error']),
  },
  methods: {
    ...mapActions('user', ['updateUser', 'fetchAndSetRoles', 'fetchUser']),

    async fetchData() {
      try {
        await this.fetchAndSetRoles(); // Carga los roles
        this.rolesList = this.roles
          .filter(role => role.isActive) // Filtra los roles activos
          .map(role => ({
            _id: role._id,
            name: role.name,
          }));

        const errorMsg = await this.fetchUser(this.$route.params.id);
        if (errorMsg) {
          this.errorMessage = errorMsg;
        } else {
          const user = this.user;
          this.state = {
            name: user.name,
            lastName: user.lastName,
            dni: user.dni,
            email: user.email,
            isActive: user.isActive,
            role: user.role._id,
          };
        }
      } catch (error) {
        this.errorMessage = 'Error al cargar los datos: ' + (error.message || 'Desconocido');
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
        dni: this.state.dni,
        email: this.state.email || '',
        isActive: this.state.isActive,
        role: this.state.role,
      };

      try {
        const errorMsg = await this.updateUser({ id: this.$route.params.id, userData });

        if (errorMsg) {
          this.errorMessage = errorMsg;
          this.successMessage = '';
        } else {
          this.successMessage = 'Usuario actualizado con éxito';
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
        dni: { required, minLength: minLength(10) },
        email: { email },
        isActive: { required },
        role: { required },
      },
    };
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
