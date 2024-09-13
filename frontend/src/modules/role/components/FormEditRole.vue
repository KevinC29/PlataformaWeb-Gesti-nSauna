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
  import { required } from '@vuelidate/validators';
  
  export default {
    data() {
      return {
        state: {
          name: '',
          isActive: true,
        },
        errorMessage: '', // Para almacenar el mensaje de error
        successMessage: '', // Para almacenar el mensaje de éxito
      };
    },
    computed: {
      ...mapGetters('role', ['role', 'error']),
    },
    methods: {
      ...mapActions('role', ['fetchRole', 'updateRole']),
  
      async submitForm() {
        this.v$.$touch(); // Marca los campos como "tocados" para activar las validaciones
  
        if (this.v$.$invalid) return; // No enviar si hay errores de validación
  
        const roleData = {
          name: this.state.name,
          isActive: this.state.isActive,
        };
  
        try {
          const errorMsg = await this.updateRole({ id: this.$route.params.id, roleData });
  
          if (errorMsg) {
            this.errorMessage = errorMsg; // Mostrar el mensaje de error
            this.successMessage = ''; // Asegurarse de que no se muestre el mensaje de éxito
          } else {
            this.successMessage = 'Rol actualizado con éxito'; // Mensaje de éxito
            this.errorMessage = ''; // Asegurarse de que no se muestre el mensaje de error
            
            // Redirigir después de 2 segundos
            setTimeout(() => {
              this.$router.push({ name: 'RoleList' });
            }, 2000);
          }
        } catch (error) {
          this.errorMessage = 'Error en el envío del formulario: ' + error.message;
          this.successMessage = '';
        }
      },
  
      cancel() {
        this.$router.push({ name: 'RoleList' });
      },
  
      async loadRole() {
        const errorMsg = await this.fetchRole(this.$route.params.id);
        if (errorMsg) {
          this.errorMessage = errorMsg;
        } else if (this.role) {
          this.state.name = this.role.name;
          this.state.isActive = this.role.isActive;
        }
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
    created() {
      this.loadRole(); // Cargar los datos del rol al montar el componente
    },
    setup() {
      const v$ = useVuelidate();
      return { v$ };
    },
  };
  </script>
  