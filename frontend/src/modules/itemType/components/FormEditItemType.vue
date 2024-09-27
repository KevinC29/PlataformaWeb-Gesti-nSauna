<template>
  <form @submit.prevent="submitForm">
    <!-- Campo Nombre -->
    <v-text-field v-model="state.name" :error-messages="v$.state.name.$errors.map(e => e.$message)" label="Nombre"
      required @blur="v$.state.name.$touch" @input="v$.state.name.$touch"></v-text-field>

    <!-- Campo Descripción -->
    <v-textarea v-model="state.description" :error-messages="v$.state.description.$errors.map(e => e.$message)"
      label="Descripción" required @blur="v$.state.description.$touch"
      @input="v$.state.description.$touch"></v-textarea>

    <!-- Campo Sección (Selector) -->
    <v-select v-model="state.section" :items="sectionsList" item-value="_id" item-title="name" clearable dense
      :error-messages="v$.state.section.$errors.map(e => e.$message)" label="Sección" required
      @change="v$.state.section.$touch" @blur="v$.state.section.$touch"></v-select>

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
    ...mapGetters('itemType', ['itemType', 'sections', 'error', 'success']),
  },
  methods: {
    ...mapActions('itemType', ['fetchItemType', 'updateItemType', 'fetchAndSetSections']),
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
        await this.fetchAndSetSections();
        this.sectionsList = this.sections
          .filter(section => section.isActive)
          .map(section => ({
            _id: section._id,
            name: section.name,
          }));

        await this.fetchItemType(this.$route.params.id);
        this.state = { ...this.itemType };
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
        section: this.state.section._id,
      };

      try {
        await this.updateItemType({ id: this.$route.params.id, itemTypeData });
        this.formattedSuccess(this.success, "Tipo de Ítem actualizado con éxito");
        this.$router.push({ name: 'ItemTypeList' });
      } catch (error) {
        this.formattedError(this.error, "Error al modificar el Tipo de Ítem");
      }
    },

    cancel() {
      this.$router.push({ name: 'ItemTypeList' });
    },
  },
  validations() {
    return {
      state: {
        name: { required },
        description: { required },
        isActive: { required },
        section: { required },
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
