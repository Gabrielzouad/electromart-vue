<template>
  <form @submit.prevent="handleLogin">
    <h2>Login</h2>
    <input v-model="username" placeholder="Username" required />
    <input v-model="password" type="password" placeholder="Password" required />
    <button type="submit">Login</button>
    <p v-if="error">{{ error }}</p>
  </form>
</template>

<script>
import { loginUser } from '@/services/api';

export default {
  data() {
    return {
      username: '',
      password: '',
      error: ''
    };
  },
  methods: {
    async handleLogin() {
      try {
        const user = await loginUser({
          username: this.username,
          password: this.password
        });
        localStorage.setItem('user', JSON.stringify(user));
        this.$router.push('/'); // or wherever you want to go
      } catch (err) {
        this.error = 'Invalid login';
      }
    }
  }
};
</script>