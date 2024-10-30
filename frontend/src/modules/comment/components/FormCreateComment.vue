<template>
  <v-sheet class="mx-auto custom-form" width="600">
    <!-- Título centrado para el formulario -->
    <h2 class="text-center mb-4">Crear Comentario</h2>
    <v-form @submit.prevent="submitForm">
      <v-row>
        <v-col cols="12">
          <!-- Campo Mensaje (Textarea) -->
          <label class="field-label">Ingrese el comentario</label>
          <v-textarea v-model="state.message" :error-messages="v$.state.message.$errors.map(e => e.$message)"
            label="Mensaje" rows="3" required @blur="v$.state.message.$touch"
            @input="v$.state.message.$touch" bg-color="cyan-lighten-5" color="#388e3c" rounded
            variant="solo-filled"></v-textarea>
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

      <!-- Alerta de errores -->
      <v-alert v-if="errorMessage" type="error" class="mt-3" border>
        {{ errorMessage }}
      </v-alert>

      <!-- Alerta de éxito -->
      <v-alert v-if="successMessage" type="success" class="mt-3" border>
        {{ successMessage }}
      </v-alert>
    </v-form>
  </v-sheet>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { useVuelidate } from '@vuelidate/core';
import { createCommentValidations } from '@/validators/commentValidations.js';
import '@/assets/styles/buttons.css';
import '@/assets/styles/forms.css';

export default {
  data() {
    return {
      state: {
        message: '',
        client: null,
      },
      errorMessage: '',
      successMessage: '',
    };
  },
  computed: {
    ...mapGetters('comment', ['client', 'error', 'success']),
  },
  methods: {
    ...mapActions('comment', ['createComment', 'fetchAndSetClient']),
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
        this.$router.push({ name: 'CommentList' });
      }, 2000);
    },
    async fetchData() {
      try {
        await this.fetchAndSetClient();
        this.state.client = this.client._id;
      } catch (error) {
        this.formattedError(this.error, "Usted aún no esta registrado como cliente");
      }
    },
    async submitForm() {
      this.v$.$touch();

      if (this.v$.$invalid) return;

      const commentData = {
        message: this.state.message,
        client: this.state.client,
      };

      try {
        await this.createComment(commentData);
        this.formattedSuccess(this.success, "Comentario creado con éxito");
      } catch (error) {
        this.formattedError(this.error, "Error al crear el comentario");
      }
    },

    cancel() {
      this.$router.push({ name: 'CommentList' });
    },
  },
  validations() {
    return createCommentValidations();
  },

  setup() {
    const v$ = useVuelidate();
    return { v$ };
  },
  async created() {
    await this.fetchData();
  },
};
</script>