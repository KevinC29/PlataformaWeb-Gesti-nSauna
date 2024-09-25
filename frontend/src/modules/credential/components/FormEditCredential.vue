<template>
  <form @submit.prevent="submitForm">
    <!-- Campo Nombre -->
    <v-text-field v-model="state.name" :error-messages="v$.state.name.$errors.map(e => e.$message)" label="Nombre"
      required @blur="v$.state.name.$touch" @input="v$.state.name.$touch"></v-text-field>

    <!-- Campo Apellido -->
    <v-text-field v-model="state.lastName" :error-messages="v$.state.lastName.$errors.map(e => e.$message)"
      label="Apellido" required @blur="v$.state.lastName.$touch" @input="v$.state.lastName.$touch"></v-text-field>

    <!-- Campo DNI -->
    <v-text-field v-model="state.dni" :error-messages="v$.state.dni.$errors.map(e => e.$message)" label="DNI" required
      @blur="v$.state.dni.$touch" @input="v$.state.dni.$touch"></v-text-field>

    <!-- Campo Email -->
    <v-text-field v-model="state.email" :error-messages="v$.state.email.$errors.map(e => e.$message)" label="Email"
      type="email" @blur="v$.state.email.$touch" @input="v$.state.email.$touch"></v-text-field>

    <v-btn class="me-4" color="warning" @click="openPasswordModal">
      Cambiar Contraseña
    </v-btn>

    <v-dialog v-model="passwordModal" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">Cambiar Contraseña</span>
        </v-card-title>

        <v-card-text>
          <!-- Campo Contraseña Actual -->
          <v-text-field v-model="credential.password"
            :error-messages="v$.credential.password.$errors.map(e => e.$message)" label="Contraseña Actual"
            :type="showCurrentPassword ? 'text' : 'password'" required @blur="v$.credential.password.$touch"
            @input="v$.credential.password.$touch">
            <template v-slot:append>
              <v-icon @click="toggleCurrentPasswordVisibility">
                {{ showCurrentPassword ? 'mdi-eye-off' : 'mdi-eye' }}
              </v-icon>
            </template>
          </v-text-field>

          <!-- Campo Nueva Contraseña -->
          <v-text-field v-model="credential.newPassword"
            :error-messages="v$.credential.newPassword.$errors.map(e => e.$message)" label="Nueva Contraseña"
            :type="showNewPassword ? 'text' : 'password'" required @blur="v$.credential.newPassword.$touch"
            @input="v$.credential.newPassword.$touch">
            <template v-slot:append>
              <v-icon @click="toggleNewPasswordVisibility">
                {{ showNewPassword ? 'mdi-eye-off' : 'mdi-eye' }}
              </v-icon>
            </template>
          </v-text-field>

          <!-- Campo Repetir Nueva Contraseña -->
          <v-text-field v-model="credential.confirmPassword"
            :error-messages="v$.credential.confirmPassword.$errors.map(e => e.$message)"
            label="Repetir Nueva Contraseña" :type="showConfirmPassword ? 'text' : 'password'" required
            @blur="v$.credential.confirmPassword.$touch" @input="v$.credential.confirmPassword.$touch">
            <template v-slot:append>
              <v-icon @click="toggleConfirmPasswordVisibility">
                {{ showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye' }}
              </v-icon>
            </template>
          </v-text-field>
        </v-card-text>

        <!-- Alerta de errores de contraseñas -->
        <v-alert v-if="passwordErrorMessage" type="error" dismissible>
          {{ passwordErrorMessage }}
        </v-alert>

        <!-- Alerta de éxito de contraseñas -->
        <v-alert v-if="passwordSuccessMessage" type="success" dismissible>
          {{ passwordSuccessMessage }}
        </v-alert>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="submitPasswordChange">Guardar</v-btn>
          <v-btn color="secondary" @click="closePasswordModal">Cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Alerta de errores generales -->
    <v-alert v-if="errorMessage" type="error" dismissible>
      {{ errorMessage }}
    </v-alert>

    <!-- Alerta de éxito general -->
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
import { required, minLength, email } from '@vuelidate/validators';

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
      showCurrentPassword: false,
      showNewPassword: false,
      showConfirmPassword: false,
    };
  },
  computed: {
    ...mapGetters('credential', ['user', 'error', 'success']),
  },
  methods: {
    ...mapActions('credential', ['updateUser', 'fetchAndSetUser', 'updatePasswordCredential']),

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
        this.successMessage = this.success;
        this.errorMessage = '';
      } catch (error) {
        this.errorMessage = this.error;
        this.successMessage = '';
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
        this.successMessage = this.success;
        this.errorMessage = '';
        setTimeout(() => {
          this.$router.push({ name: 'CredentialUser' });
        }, 2000);
      } catch (error) {
        this.errorMessage = this.error;
        this.successMessage = '';
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
        this.passwordErrorMessage = 'Las contraseñas no coinciden';
        return;
      }

      const credentialData = {
        password: this.credential.password.trim(),
        newPassword: this.credential.newPassword,
        confirmPassword: this.credential.confirmPassword,
      };

      try {
        await this.updatePasswordCredential({ id: this.$route.params.id, credentialData: credentialData });
        this.passwordSuccessMessage = this.success;
        this.passwordErrorMessage = '';
        setTimeout(() => {
          this.closePasswordModal();
        }, 2000);
      } catch (error) {
        this.passwordErrorMessage = this.error;
        this.passwordSuccessMessage = '';
      }
    },

    toggleCurrentPasswordVisibility() {
      this.showCurrentPassword = !this.showCurrentPassword;
    },
    toggleNewPasswordVisibility() {
      this.showNewPassword = !this.showNewPassword;
    },
    toggleConfirmPasswordVisibility() {
      this.showConfirmPassword = !this.showConfirmPassword;
    },
  },
  validations() {
    return {
      state: {
        name: { required },
        lastName: { required },
        dni: { required, minLength: minLength(10) },
        email: { email },
      },
      credential: {
        password: { required },
        newPassword: { required, minLength: minLength(6) },
        confirmPassword: { required, minLength: minLength(6) },
      },
    };
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
