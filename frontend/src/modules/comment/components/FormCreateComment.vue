<template>
  <form @submit.prevent="submitForm">
    <!-- Campo Mensaje (Textarea) -->
    <v-textarea v-model="state.message" :error-messages="v$.state.message.$errors.map(e => e.$message)" label="Mensaje"
      rows="3" required @blur="v$.state.message.$touch" @input="v$.state.message.$touch"></v-textarea>

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
import { mapGetters, mapActions } from 'vuex';
import { useVuelidate } from '@vuelidate/core';
import { createCommentValidations } from '@/validators/commentValidations.js';

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
        this.$router.push({ name: 'CommentList' });
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