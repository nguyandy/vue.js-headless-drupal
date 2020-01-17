<template>
  <div class="col-md-3 py-3">
    <h1 class="display-4 mb-5 text-center">Login</h1>

    <div
      v-if="authenticationErrorCode > 0"
      class="alert alert-danger"
      role="alert"
    >{{authenticationError}}</div>

    <form @submit.prevent="handleSubmit" class="text-center">
      <div class="form-group">
        <input type="text" v-model="username" class="form-control" placeholder="Username" required />
      </div>
      <div class="form-group">
        <input
          type="password"
          v-model="password"
          class="form-control"
          placeholder="Password"
          required
        />
      </div>
      <button type="submit" class="btn btn-primary">Login</button>
    </form>
  </div>
</template>

<script>
// Map variables and methods from auth store.
import { mapGetters, mapActions } from "vuex";

export default {
  name: "login",

  data() {
    return {
      username: "",
      password: ""
    };
  },

  computed: {
    ...mapGetters("auth", [
      "authenticating",
      "authenticationError",
      "authenticationErrorCode"
    ])
  },

  methods: {
    ...mapActions("auth", ["login"]),

    handleSubmit() {
      this.login({ username: this.username, password: this.password });
      this.password = "";
    }
  }
};
</script>