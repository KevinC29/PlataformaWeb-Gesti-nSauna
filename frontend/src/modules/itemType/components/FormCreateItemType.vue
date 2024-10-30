<template>
  <v-sheet class="mx-auto custom-form" width="600">
    <!-- Título centrado para el formulario -->
    <h2 class="text-center mb-4">Crear Tipo de Ítem</h2>
    <v-form @submit.prevent="submitForm">
      <v-row>
        <v-col cols="12">
          <!-- Campo Nombre -->
          <label class="field-label">Nombre</label>
          <v-text-field v-model="state.name" :error-messages="v$.state.name.$errors.map(e => e.$message)" required
            @blur="v$.state.name.$touch" @input="v$.state.name.$touch" bg-color="cyan-lighten-5" color="#388e3c" rounded
            variant="solo-filled"></v-text-field>

          <!-- Campo Descripción -->
          <label class="field-label">Descripción</label>
          <v-textarea v-model="state.description" :error-messages="v$.state.description.$errors.map(e => e.$message)"
            required @blur="v$.state.description.$touch" @input="v$.state.description.$touch" bg-color="cyan-lighten-5"
            color="#388e3c" rounded variant="solo-filled"></v-textarea>

          <!-- Campo Sección (Selector) -->
          <label class="field-label">Sección</label>
          <v-select v-model="state.section" :items="sectionsList" item-value="_id" item-title="name" clearable dense
            :error-messages="v$.state.section.$errors.map(e => e.$message)" required @change="v$.state.section.$touch"
            @blur="v$.state.section.$touch" bg-color="cyan-lighten-5" color="#388e3c" rounded
            variant="solo-filled"></v-select>

          <!-- Campo Estado (Checkbox para 'isActive') -->
          <label class="field-label">Activar Tipo de Ítem</label>
          <v-checkbox v-model="state.isActive" :error-messages="v$.state.isActive.$errors.map(e => e.$message)"
            label="Activo" @change="v$.state.isActive.$touch"></v-checkbox>
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
import { createItemTypeValidations } from '@/validators/itemTypeValidations.js';
import '@/assets/styles/buttons.css';
import '@/assets/styles/forms.css';

export default {
  data() {
    return {
      state: {
        name: '',
        description: '',
        isActive: true,
        section: null,
      },
      sectionsList: [],
      errorMessage: '',
      successMessage: '',
    };
  },
  computed: {
    ...mapGetters('itemType', ['sections', 'error', 'success']),
  },
  methods: {
    ...mapActions('itemType', ['createItemType', 'fetchAndSetSections']),
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
        this.$router.push({ name: 'ItemTypeList' });
      }, 2000);
    },
    async fetchData() {
      try {
        await this.fetchAndSetSections();
        this.sectionsList = this.sections
          .filter(section => section.isActive)
          .map(section => ({
            _id: section._id,
            name: section.name,
          }));
      } catch (error) {
        this.formattedError(this.error, "Error al cargar los datos");
      }
    },
    async submitForm() {
      this.v$.$touch();

      if (this.v$.$invalid) return;

      const itemTypeData = {
        name: this.state.name,
        description: this.state.description,
        isActive: this.state.isActive,
        section: this.state.section,
      };

      try {
        await this.createItemType(itemTypeData);
        this.formattedSuccess(this.success, "Tipo de Ítem creado con éxito");
      } catch (error) {
        this.formattedError(this.error, "Error al crear el Tipo de Ítem");
      }
    },

    cancel() {
      this.$router.push({ name: 'ItemTypeList' });
    },
  },
  validations() {
    return createItemTypeValidations();
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
