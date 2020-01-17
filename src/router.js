import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Login from "./views/Login.vue";
import { TokenService } from "./services/token.service";

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: "/",

  // Important note:
  // All routes require authentication by default.
  // You need to define it to be public.
  routes: [
    {
      // This route is private by default.
      path: "/",
      name: "home",
      component: Home
    },
    {
      // This route is public, because we made it public using meta object.
      path: "/login",
      name: "login",
      component: Login,
      meta: {
        public: true,
        onlyWhenLoggedOut: true
      }
    }
  ]
});

// Here we check if user is authenticated.
// If user isn't than redirect to login page.
router.beforeEach((to, from, next) => {
  const isPublic = to.matched.some(record => record.meta.public);
  const onlyWhenLoggedOut = to.matched.some(
    record => record.meta.onlyWhenLoggedOut
  );
  const loggedIn = !!TokenService.getToken();

  if (!isPublic && !loggedIn) {
    return next({
      path: "/login",
      query: { redirect: to.fullPath }
    });
  }

  if (loggedIn && onlyWhenLoggedOut) {
    return next("/");
  }

  next();
});

export default router;
