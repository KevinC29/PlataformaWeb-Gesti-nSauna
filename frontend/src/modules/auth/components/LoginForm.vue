<template>
  <form @submit.prevent="handleLogin">
    <div>
      <label for="email">Email:</label>
      <input v-model="email" type="email" id="email" required />
    </div>
    <div>
      <label for="password">Password:</label>
      <input v-model="password" type="password" id="password" required />
    </div>
    <button type="submit">Login</button>
    <p v-if="errorMessage">{{ errorMessage }}</p>
  </form>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      email: '',
      password: '',
      errorMessage: ''
    };
  },
  methods: {
    ...mapActions('auth', ['login']),
    async handleLogin() {
      try {
        await this.login({ email: this.email, password: this.password });
        this.$router.push({ name: 'home' });
      } catch (error) {
        this.errorMessage = 'Login failed. Please check your credentials.';
      }
    }
  }
};
</script>

<style scoped></style>