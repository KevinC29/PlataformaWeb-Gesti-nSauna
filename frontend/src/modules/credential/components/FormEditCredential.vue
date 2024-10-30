<template>
  <v-sheet class="mx-auto custom-form" width="600">
    <!-- Título centrado para el formulario -->
    <h2 class="text-center mb-4">Editar Credencial</h2>
    <v-form @submit.prevent="submitForm">
      <v-row>
        <v-col cols="12">
          <!-- Campo Nombre -->
          <label class="field-label">Nombres</label>
          <v-text-field v-model="state.name" :error-messages="v$.state.name.$errors.map(e => e.$message)"
            required @blur="v$.state.name.$touch" @input="v$.state.name.$touch" bg-color="cyan-lighten-5"
            color="#388e3c" rounded variant="solo-filled"></v-text-field>

          <!-- Campo Apellido -->
          <label class="field-label">Apellidos</label>
          <v-text-field v-model="state.lastName" :error-messages="v$.state.lastName.$errors.map(e => e.$message)"
            required @blur="v$.state.lastName.$touch" @input="v$.state.lastName.$touch"
            bg-color="cyan-lighten-5" color="#388e3c" rounded variant="solo-filled"></v-text-field>

          <!-- Campo DNI -->
          <label class="field-label">DNI</label>
          <v-text-field v-model="state.dni" :error-messages="v$.state.dni.$errors.map(e => e.$message)"
            required @blur="v$.state.dni.$touch" @input="v$.state.dni.$touch" bg-color="cyan-lighten-5" color="#388e3c"
            rounded variant="solo-filled"></v-text-field>

          <!-- Campo Email -->
          <label class="field-label">Email</label>
          <v-text-field v-model="state.email" :error-messages="v$.state.email.$errors.map(e => e.$message)"
            type="email" @blur="v$.state.email.$touch" @input="v$.state.email.$touch"
            bg-color="cyan-lighten-5" color="#388e3c" rounded variant="solo-filled"></v-text-field>

          <v-btn class="me-4 custom-warning-btn" @click="openPasswordModal">
            Cambiar Contraseña
          </v-btn>
        </v-col>
      </v-row>
      <v-dialog v-model="passwordModal" max-width="500px">
        <v-sheet class="mx-auto custom-form" width="600">
          <v-form>
            <v-row>
              <v-col cols="12">
                <h2 class="text-center mb-4 headline">Cambiar Contraseña</h2>
                <label class="field-label">Contraseña Actual</label>
                <v-text-field v-model="credential.password"
                  :error-messages="v$.credential.password.$errors.map(e => e.$message)"
                  :type="showCurrentPassword" required @blur="v$.credential.password.$touch"
                  @input="v$.credential.password.$touch" bg-color="cyan-lighten-5" color="#388e3c" rounded
                  variant="solo-filled" :append-inner-icon="showCurrentPassword === 'password' ? 'mdi-eye-off' : 'mdi-eye'"
                  @click:append-inner="togglePasswordVisibilityCurrent">
                </v-text-field>

                <!-- Campo Nueva Contraseña -->
                <label class="field-label">Nueva Contraseña</label>
                <v-text-field v-model="credential.newPassword"
                  :error-messages="v$.credential.newPassword.$errors.map(e => e.$message)"
                  :type="showNewPassword" required @blur="v$.credential.newPassword.$touch"
                  @input="v$.credential.newPassword.$touch" bg-color="cyan-lighten-5" color="#388e3c" rounded
                  variant="solo-filled" :append-inner-icon="showNewPassword === 'password' ? 'mdi-eye-off' : 'mdi-eye'"
                  @click:append-inner="togglePasswordVisibilityNew">
                </v-text-field>

                <!-- Campo Repetir Nueva Contraseña -->
                <label class="field-label">Repetir Nueva Contraseña</label>
                <v-text-field v-model="credential.confirmPassword"
                  :error-messages="v$.credential.confirmPassword.$errors.map(e => e.$message)"
                  :type="showConfirmPassword" required
                  @blur="v$.credential.confirmPassword.$touch" @input="v$.credential.confirmPassword.$touch"
                  bg-color="cyan-lighten-5" color="#388e3c" rounded variant="solo-filled" :append-inner-icon="showConfirmPassword === 'password' ? 'mdi-eye-off' : 'mdi-eye'"
                  @click:append="togglePasswordVisibilityConfirm">
                </v-text-field>
              </v-col>
            </v-row>
            <v-row justify="end" class="mb-4">
              <v-btn class="custom-submit-btn" @click="submitPasswordChange">
                Guardar
              </v-btn>
              <v-btn class="custom-cancel-btn" @click="closePasswordModal">
                Cancelar
              </v-btn>
            </v-row>

            <!-- Alerta de errores de contraseñas -->
            <v-alert v-if="passwordErrorMessage" type="error" class="mt-3" border>
              {{ passwordErrorMessage }}
            </v-alert>

            <!-- Alerta de éxito de contraseñas -->
            <v-alert v-if="passwordSuccessMessage" type="success" class="mt-3" border>
              {{ passwordSuccessMessage }}
            </v-alert>
          </v-form>
        </v-sheet>
      </v-dialog>

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
import { editCredentialValidations } from '@/validators/credentialValidations.js';
import '@/assets/styles/buttons.css';
import '@/assets/styles/forms.css';

export default {
  data() {
    return {
      state: {
        name: '',
        lastName: '',
        dni: '',
        email: '',
      },
      credential: {
        password: '',
        newPassword: '',
        confirmPassword: '',
      },
      userID: null,
      errorMessage: '',
      successMessage: '',
      passwordErrorMessage: '',
      passwordSuccessMessage: '',
      passwordModal: false,
      showCurrentPassword: 'password',
      showNewPassword: 'password',
      showConfirmPassword: 'password',
    };
  },
  computed: {
    ...mapGetters('credential', ['user', 'error', 'success']),
  },
  methods: {
    ...mapActions('credential', ['updateUser', 'fetchAndSetUser', 'updatePasswordCredential']),
    formattedError(option, error, message) {
      if (option === 1) {
        this.errorMessage = error || message;
        setTimeout(() => {
          this.errorMessage = '';
        }, 2000);
      } else {
        this.passwordErrorMessage = error || message;
        setTimeout(() => {
          this.passwordErrorMessage = '';
        }, 2000);
      }
    },
    formattedSuccess(option, success, message) {
      if (option === 1) {
        this.successMessage = success || message;
        setTimeout(() => {
          this.successMessage = '';
          this.$router.push({ name: 'CredentialUser' });
        }, 2000);
      } else {
        this.passwordSuccessMessage = success || message;
        setTimeout(() => {
          this.passwordSuccessMessage = '';
          this.closePasswordModal();
        }, 2000);
      }
    },
    async fetchData() {
      try {
        await this.fetchAndSetUser();
        const user = this.user;
        this.state = {
          name: user.name,
          lastName: user.lastName,
          dni: user.dni,
          email: user.email,
        };
        this.userID = user._id;
      } catch (error) {
        this.formattedError(1, this.error, "Error al cargar los datos");
      }
    },

    async submitForm() {
      this.v$.state.$touch();
      if (this.v$.state.$invalid) return;

      const userData = {
        name: this.state.name,
        lastName: this.state.lastName,
        dni: this.state.dni,
        email: this.state.email || '',
      };

      try {
        await this.updateUser({ id: this.userID, userData });
        this.formattedSuccess(1, this.success, "Usuario actualizado con éxito");
      } catch (error) {
        this.formattedError(1, this.error, "Error al modificar el usuario");
      }
    },
    cancel() {
      this.$router.push({ name: 'CredentialUser' });
    },

    openPasswordModal() {
      this.passwordModal = true;
    },

    closePasswordModal() {
      this.passwordModal = false;
      this.credential.password = '';
      this.credential.newPassword = '';
      this.credential.confirmPassword = '';
      this.passwordErrorMessage = '';
      this.passwordSuccessMessage = '';
    },

    async submitPasswordChange() {
      this.v$.credential.$touch();
      this.passwordErrorMessage = '';
      this.passwordSuccessMessage = '';

      if (this.v$.credential.$invalid) {
        return;
      }

      const newPassword = this.credential.newPassword.trim();
      const confirmPassword = this.credential.confirmPassword.trim();

      if (newPassword !== confirmPassword) {
        this.formattedError(0, "Las contraseñas no coinciden", "Revise las contraseñas ingresadas");
        return;
      }

      const credentialData = {
        password: this.credential.password.trim(),
        newPassword: this.credential.newPassword,
        confirmPassword: this.credential.confirmPassword,
      };

      try {
        await this.updatePasswordCredential({ id: this.$route.params.id, credentialData: credentialData });
        this.formattedSuccess(0, this.success, "Contraseña actualizada con éxito");
      } catch (error) {
        this.formattedError(0, this.error, "Revise las contraseñas ingresadas");
      }
    },

    togglePasswordVisibilityCurrent() {
      this.showCurrentPassword = this.showCurrentPassword === 'password' ? 'text' : 'password';
    },
    togglePasswordVisibilityNew() {
      this.showNewPassword = this.showNewPassword === 'password' ? 'text' : 'password';
    },
    togglePasswordVisibilityConfirm() {
      this.showConfirmPassword = this.showConfirmPassword === 'password' ? 'text' : 'password';
    },
  },
  validations() {
    return editCredentialValidations();
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
