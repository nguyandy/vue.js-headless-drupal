import Vue from "vue";
import ApiService from "./services/api.service";
import { TokenService } from "./services/token.service";
import router from "./router";
import store from "./store";
import App from "./App.vue";

/**
 * This is where all starts.
 */

// Initialize ApiService with url pointing to REST API.
ApiService.init(process.env.VUE_APP_API_URL);

// If there is an access token, then set it in the header.
if (TokenService.getToken()) {
  ApiService.setHeader();
}

// It is important to use the routes and store here.
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
