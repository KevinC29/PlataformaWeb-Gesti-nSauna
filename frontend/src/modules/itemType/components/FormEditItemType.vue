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

    <!-- Campo Descripción -->
    <v-textarea
      v-model="state.description"
      :error-messages="v$.state.description.$errors.map(e => e.$message)"
      label="Descripción"
      required
      @blur="v$.state.description.$touch"
      @input="v$.state.description.$touch"
    ></v-textarea>

    <!-- Campo Sección (Selector) -->
    <v-select
      v-model="state.section"
      :items="sectionsList"
      item-value="_id"
      item-title="name"
      clearable
      dense
      :error-messages="v$.state.section.$errors.map(e => e.$message)"
      label="Sección"
      required
      @change="v$.state.section.$touch"
      @blur="v$.state.section.$touch"
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
        description: '',
        isActive: true,
        section: null, // Inicializar como null
      },
      sectionsList: [],
      errorMessage: '',
      successMessage: '',
    };
  },
  computed: {
    ...mapGetters('itemType', ['itemType', 'sections', 'error']),
  },
  methods: {
    ...mapActions('itemType', ['fetchItemType', 'updateItemType', 'fetchAndSetSections']),

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
        console.log(itemTypeData)
        const errorMsg = await this.updateItemType({ id: this.$route.params.id, itemTypeData });

        if (errorMsg) {
          this.errorMessage = errorMsg;
          this.successMessage = '';
        } else {
          this.successMessage = 'Tipo de ítem actualizado con éxito';
          this.errorMessage = '';

          setTimeout(() => {
            this.$router.push({ name: 'ItemTypesList' });
          }, 2000);
        }
      } catch (error) {
        this.errorMessage = 'Error en el envío del formulario: ' + (error.message || 'Desconocido');
        this.successMessage = '';
      }
    },

    cancel() {
      this.$router.push({ name: 'ItemTypesList' });
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
    try {
      await this.fetchAndSetSections(); // Carga las secciones
      this.sectionsList = this.sections
        .filter(section => section.isActive) // Filtra las secciones activas
        .map(section => ({
          _id: section._id,
          name: section.name,
        }));

      const errorMsg = await this.fetchItemType(this.$route.params.id);
      if (!errorMsg) {
        this.state = { ...this.itemType };
      } else {
        this.errorMessage = errorMsg;
      }
    } catch (error) {
      this.errorMessage = 'Error al cargar los datos del ítem: ' + (error.message || 'Desconocido');
    }
  }
};
</script>
