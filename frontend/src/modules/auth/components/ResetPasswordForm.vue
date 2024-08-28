<template>
  <form @submit.prevent="handleReset">
    <div>
      <label for="email">Email:</label>
      <input v-model="email" type="email" id="email" required />
    </div>
    <button type="submit">Reset Password</button>
    <p v-if="successMessage">{{ successMessage }}</p>
    <p v-if="errorMessage">{{ errorMessage }}</p>
  </form>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      email: '',
      successMessage: '',
      errorMessage: ''
    };
  },
  methods: {
    ...mapActions('auth', ['resetPassword']),
    async handleReset() {
      try {
        await this.resetPassword(this.email);
        this.successMessage = 'Reset password link sent to your email.';
      } catch (error) {
        this.errorMessage = 'Reset password failed. Please check your email.';
      }
    }
  }
};
</script>


<style scoped></style>