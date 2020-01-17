import axios from "axios";
import { TokenService } from "../services/token.service";
import store from "../store";

// Api service is meant to be used by other services to perform REST requests.
const ApiService = {
  _401interceptor: null,

  // Base REST API website url.
  init(baseURL) {
    axios.defaults.baseURL = baseURL;
  },

  // Add or remove access token header.
  setHeader() {
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${TokenService.getToken()}`;
  },
  removeHeader() {
    axios.defaults.headers.common = {};
  },

  // Request types.
  get(resource) {
    return axios.get(resource);
  },
  post(resource, data) {
    return axios.post(resource, data);
  },
  put(resource, data) {
    return axios.put(resource, data);
  },
  delete(resource) {
    return axios.delete(resource);
  },
  customRequest(data) {
    return axios(data);
  },

  // Intercept 401 Authentication errors and process them:
  // - If it is during login, then clean up auth store, user can try again.
  // - If it is other request, then try to refresh the access token.
  // IMPORTANT NOTE:
  // Drupal returns 403 code instead of 401. Here I will check against 403,
  // but leave the name 401, as it should be by convention.
  mount401Interceptor() {
    this._401interceptor = axios.interceptors.response.use(
      response => {
        return response;
      },
      async error => {
        if (error.request.status === 403) {
          if (error.config.url.includes("/oauth/token")) {
            store.dispatch("auth/logout");
            throw error;
          } else {
            try {
              await store.dispatch("auth/refreshToken");

              return this.customRequest({
                method: error.config.method,
                url: error.config.url,
                data: error.config.data
              });
            } catch (e) {
              throw error;
            }
          }
        }

        throw error;
      }
    );
  },
  unmount401Interceptor() {
    axios.interceptors.response.eject(this._401interceptor);
  }
};

export default ApiService;