<template>
  <div class="vue-app">
    <div class="d-flex flex-row align-items-center p-3 px-4 mb-3 border-bottom shadow-sm">
      <h3 class="my-0 mr-auto font-weight-normal">App</h3>
      <button class="btn btn-sm btn-warning" v-if="loggedIn" @click.prevent="logout">Log out</button>
    </div>
    <div class="container">
      <div class="row justify-content-md-center">
        <router-view class="view"></router-view>
      </div>
    </div>
  </div>
</template>

<script>
// Map variables and methods from auth store.
import { mapGetters, mapActions } from "vuex";

export default {
  name: "app",

  computed: {
    ...mapGetters("auth", ["loggedIn"])
  },

  methods: {
    ...mapActions("auth", ["logout"])
  }
};
</script>
