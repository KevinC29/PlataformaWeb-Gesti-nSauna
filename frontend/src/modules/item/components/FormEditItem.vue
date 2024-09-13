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
  
      <!-- Campo Precio -->
      <v-text-field
      v-model="state.price"
      :error-messages="v$.state.price.$errors.map(e => e.$message)"
      label="Precio"
      type="number"
      required
      min="0"
      step="0.01"
      @blur="v$.state.price.$touch"
      @input="v$.state.price.$touch"
      @change="formatPrice"
      prepend-icon="mdi-currency-usd"
    ></v-text-field>
  
      <!-- Campo URL de Imagen -->
      <v-text-field
        v-model="state.imageUrl"
        :error-messages="v$.state.imageUrl.$errors.map(e => e.$message)"
        label="URL de Imagen"
        required
        @blur="v$.state.imageUrl.$touch"
        @input="v$.state.imageUrl.$touch"
      ></v-text-field>
  
      <!-- Campo Tipo de Ítem (Selector) -->
      <v-select
        v-model="state.itemType"
        :items="itemTypesList"
        item-value="_id"
        item-title="name"
        clearable
        dense
        :error-messages="v$.state.itemType.$errors.map(e => e.$message)"
        label="Tipo de Ítem"
        required
        @change="v$.state.itemType.$touch"
        @blur="v$.state.itemType.$touch"
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
  import { required, minValue } from '@vuelidate/validators';
  
  export default {
    data() {
      return {
        state: {
          name: '',
          description: '',
          price: null,
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
      ...mapGetters('item', ['itemTypes', 'item', 'error']),
    },
    methods: {
      ...mapActions('item', ['updateItem', 'fetchAndSetItemTypes', 'fetchItem']),
      
      async fetchData() {
        try {
          await this.fetchAndSetItemTypes(); // Carga los tipos de ítem
          this.itemTypesList = this.itemTypes
            .filter(itemType => itemType.isActive) // Filtra los tipos de ítem activos
            .map(itemType => ({
              _id: itemType._id,
              name: itemType.name,
            }));
  
          const errorMsg = await this.fetchItem(this.$route.params.id);
          if (errorMsg) {
            this.errorMessage = errorMsg;
          } else {
            const item = this.item;
            this.state = {
              name: item.name,
              description: item.description,
              price: item.price,
              imageUrl: item.imageUrl,
              isActive: item.isActive,
              itemType: item.itemType._id,
            };
          }
        } catch (error) {
          this.errorMessage = 'Error al cargar los datos: ' + (error.message || 'Desconocido');
        }
      },

      formatPrice() {
      if (this.state.price !== null && this.state.price !== '') {
        this.state.price = parseFloat(this.state.price).toFixed(2);
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
          const errorMsg = await this.updateItem({ id: this.$route.params.id, itemData });
  
          if (errorMsg) {
            this.errorMessage = errorMsg;
            this.successMessage = '';
          } else {
            this.successMessage = 'Ítem actualizado con éxito';
            this.errorMessage = '';
  
            setTimeout(() => {
              this.$router.push({ name: 'ItemList' });
            }, 2000);
          }
        } catch (error) {
          this.errorMessage = 'Error en el envío del formulario: ' + (error.message || 'Desconocido');
          this.successMessage = '';
        }
      },
  
      cancel() {
        this.$router.push({ name: 'ItemList' });
      },
    },
    validations() {
      return {
        state: {
          name: { required },
          description: { required },
          price: { required, minValue: minValue(0) },
          imageUrl: { required },
          isActive: { required },
          itemType: { required },
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
  