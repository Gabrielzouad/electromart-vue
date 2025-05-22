<template>
  <form @submit.prevent="handleSignup">
    <h2>Sign Up</h2>
    <input v-model="username" placeholder="Username" required />
    <input v-model="password" type="password" placeholder="Password" required />
    <input v-model="email" type="email" placeholder="Email" required />
    <input v-model="firstName" placeholder="First Name" required />
    <input v-model="lastName" placeholder="Last Name" required />
    <button type="submit">Sign Up</button>
    <p v-if="error">{{ error }}</p>
  </form>
</template>

<script>
import { signupUser } from '@/services/api';

export default {
  data() {
    return {
      username: '',
      password: '',
      email: '',
      firstName: '',
      lastName: '',
      error: ''
    };
  },
  methods: {
    async handleSignup() {
      try {
        const user = await signupUser({
          username: this.username,
          password: this.password,
          email: this.email,
          firstName: this.firstName,
          lastName: this.lastName
        });
        localStorage.setItem('user', JSON.stringify(user));
        this.$router.push('/');
      } catch (err) {
        this.error = 'Signup failed';
      }
    }
  }
};
</script>