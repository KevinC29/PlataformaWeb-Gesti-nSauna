<template>
  <v-sheet class="mx-auto custom-form" width="600">
    <!-- Título centrado para el formulario -->
    <h2 class="text-center mb-4">Crear Sección</h2>
    <v-form @submit.prevent="submitForm">
      <v-row>
        <v-col cols="12">
          <!-- Campo Nombre -->
          <label class="field-label">Nombre</label>
          <v-text-field v-model="state.name" :error-messages="v$.state.name.$errors.map(e => e.$message)" required
            @blur="v$.state.name.$touch" @input="v$.state.name.$touch" bg-color="cyan-lighten-5" color="#388e3c" rounded
            variant="solo-filled"></v-text-field>

          <!-- Campo Estado (Checkbox para 'isActive') -->
          <label class="field-label">Activar Sección</label>
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
import { createSectionValidations } from '@/validators/sectionValidations.js';
import '@/assets/styles/buttons.css';
import '@/assets/styles/forms.css';

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
    ...mapGetters('section', ['error', 'success']),
  },
  methods: {
    ...mapActions('section', ['createSection']),
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
        this.$router.push({ name: 'SectionList' });
      }, 2000);
    },
    async submitForm() {
      this.v$.$touch();

      if (this.v$.$invalid) return;

      const sectionData = {
        name: this.state.name,
        isActive: this.state.isActive,
      };

      try {
        await this.createSection(sectionData);
        this.formattedSuccess(this.success, "Sección creada con éxito");
      } catch (error) {
        this.formattedError(this.error, "Error al crear la sección");
      }
    },

    cancel() {
      this.$router.push({ name: 'SectionList' });
    },
  },
  validations() {
    return createSectionValidations();
  },
  setup() {
    const v$ = useVuelidate();
    return { v$ };
  },
};
</script>
