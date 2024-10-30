<template>
  <v-sheet class="mx-auto custom-form" width="600">
    <!-- Título centrado para el formulario -->
    <h2 class="text-center mb-4">Crear Ítem</h2>
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

          <!-- Campo Precio -->
          <label class="field-label">Precio</label>
          <v-text-field v-model="state.price" :error-messages="v$.state.price.$errors.map(e => e.$message)"
            type="number" required min="0" step="0.01" @blur="v$.state.price.$touch" @input="v$.state.price.$touch"
            @change="formatPrice" prepend-inner-icon="mdi-currency-usd" bg-color="cyan-lighten-5" color="#388e3c"
            rounded variant="solo-filled"></v-text-field>

          <!-- Campo URL de Imagen -->
          <label class="field-label">URL de Imagen</label>
          <v-text-field v-model="state.imageUrl" :error-messages="v$.state.imageUrl.$errors.map(e => e.$message)"
            required @blur="v$.state.imageUrl.$touch" @input="v$.state.imageUrl.$touch" bg-color="cyan-lighten-5"
            color="#388e3c" rounded variant="solo-filled"></v-text-field>

          <!-- Campo Tipo de Ítem (Selector) -->
          <label class="field-label">Tipo de Ítem</label>
          <v-select v-model="state.itemType" :items="itemTypesList" item-value="_id" item-title="name" clearable dense
            :error-messages="v$.state.itemType.$errors.map(e => e.$message)" required @change="v$.state.itemType.$touch"
            @blur="v$.state.itemType.$touch" bg-color="cyan-lighten-5" color="#388e3c" rounded
            variant="solo-filled"></v-select>

          <!-- Campo Estado (Checkbox para 'isActive') -->
          <label class="field-label">Activar Ítem</label>
          <v-checkbox v-model="state.isActive" :error-messages="v$.state.isActive.$errors.map(e => e.$message)"
            @change="v$.state.isActive.$touch" ></v-checkbox>
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
import { createItemValidations } from '@/validators/itemValidations.js';
import '@/assets/styles/buttons.css';
import '@/assets/styles/forms.css';

export default {
  data() {
    return {
      state: {
        name: '',
        description: '',
        price: 0,
        imageUrl: '',
        isActive: true,
        itemType: null,
      },
      itemTypesList: [],
      errorMessage: '',
      successMessage: '',
    };
  },
  computed: {
    ...mapGetters('item', ['itemTypes', 'error', 'success']),
  },
  methods: {
    ...mapActions('item', ['createItem', 'fetchAndSetItemTypes']),
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
        this.$router.push({ name: 'ItemList' });
      }, 2000);
    },
    formatPrice() {
      if (this.state.price !== null && this.state.price !== '') {
        const formattedValue = Math.max(0, parseFloat(this.state.price)).toFixed(2);
        this.state.price = isNaN(formattedValue) ? '0.00' : formattedValue;
      }
    },
    async fetchData() {
      try {
        await this.fetchAndSetItemTypes();
        this.itemTypesList = this.itemTypes
          .filter(itemType => itemType.isActive)
          .map(itemType => ({
            _id: itemType._id,
            name: itemType.name,
          }));
      } catch (error) {
        this.formattedError(this.error, "Error al cargar los datos");
      }
    },
    async submitForm() {
      this.v$.$touch();

      if (this.v$.$invalid) return;

      this.formatPrice();

      const itemData = {
        name: this.state.name,
        description: this.state.description,
        price: Number(this.state.price),
        imageUrl: this.state.imageUrl,
        isActive: this.state.isActive,
        itemType: this.state.itemType,
      };

      try {
        await this.createItem(itemData);
        this.formattedSuccess(this.success, "Ítem creado con éxito");
      } catch (error) {
        this.formattedError(this.error, "Error al crear el ítem");
      }
    },

    cancel() {
      this.$router.push({ name: 'ItemList' });
    },
  },
  validations() {
    return createItemValidations();
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
