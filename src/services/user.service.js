import ApiService from "./api.service";
import { TokenService } from "./token.service";
import qs from "qs";

// Loaded form the .env.local file.
const CLIENT_ID = process.env.VUE_APP_CLIENT_ID;
const CLIENT_SECRET = process.env.VUE_APP_CLIENT_SECRET;

// Special type of error for auth errors.
class AuthenticationError extends Error {
  constructor(errorCode, message) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    this.errorCode = errorCode;
  }
}

// Service that is used to perform REST requests via ApiService class.
const UserService = {

  login: async function(email, password) {
    // OAuth request requires a very special request.
    const requestData = {
      method: "post",
      url: "/oauth/token",
      // It accepts only application/x-www-form-urlencoded requests.
      headers: { "content-type": "application/x-www-form-urlencoded" },
      data: qs.stringify({
        // All this data is required as well.
        grant_type: "password",
        username: email,
        password: password,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET
      })
    };

    try {
      // Perform request.
      const response = await ApiService.customRequest(requestData);

      // Process the response.
      TokenService.saveToken(response.data.access_token);
      TokenService.saveRefreshToken(response.data.refresh_token);
      ApiService.setHeader();

      ApiService.mount401Interceptor();

      return response.data.access_token;
    } catch (error) {
      throw new AuthenticationError(
        error.response.status,
        error.response.data.message
      );
    }
  },

  refreshToken: async function() {
    const refreshToken = TokenService.getRefreshToken();

    // OAuth request requires a very special request.
    const requestData = {
      method: "post",
      url: "/oauth/token",
      // It accepts only application/x-www-form-urlencoded requests.
      headers: { "content-type": "application/x-www-form-urlencoded" },
      data: qs.stringify({
        // All this data is required as well.
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET
      })
    };

    try {
      // Perform request.
      const response = await ApiService.customRequest(requestData);

      // Process the response.
      TokenService.saveToken(response.data.access_token);
      TokenService.saveRefreshToken(response.data.refresh_token);
      ApiService.setHeader();

      return response.data.access_token;
    } catch (error) {
      throw new AuthenticationError(
        error.response.status,
        error.response.data.message
      );
    }
  },

  logout() {
    TokenService.removeToken();
    TokenService.removeRefreshToken();
    ApiService.removeHeader();

    ApiService.unmount401Interceptor();
  }
};

export default UserService;

export { UserService, AuthenticationError };
