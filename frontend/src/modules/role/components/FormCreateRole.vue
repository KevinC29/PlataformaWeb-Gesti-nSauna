<template>
  <form @submit.prevent="submitForm">
    <!-- Campo Nombre -->
    <v-text-field v-model="state.name" :error-messages="v$.state.name.$errors.map(e => e.$message)" label="Nombre"
      required @blur="v$.state.name.$touch" @input="v$.state.name.$touch"></v-text-field>

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
import { required } from '@vuelidate/validators';

export default {
  data() {
    return {
      state: {
        name: '',
        isActive: true,
      },
      errorMessage: '',
      successMessage: '',
    };
  },
  computed: {
    ...mapGetters('role', ['error', 'success']),
  },
  methods: {
    ...mapActions('role', ['createRole']),
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
    async submitForm() {
      this.v$.$touch();

      if (this.v$.$invalid) return;

      const roleData = {
        name: this.state.name,
        isActive: this.state.isActive,
      };

      try {
        await this.createRole(roleData);
        this.formattedSuccess(this.success, "Rol creado con éxito");
        this.$router.push({ name: 'RoleList' });
      } catch (error) {
        this.formattedError(this.error, "Error al crear el rol");
      }
    },

    cancel() {
      this.$router.push({ name: 'RoleList' });
    },
  },
  validations() {
    return {
      state: {
        name: { required },
        isActive: { required },
      },
    };
  },
  setup() {
    const v$ = useVuelidate();
    return { v$ };
  },
};
</script>