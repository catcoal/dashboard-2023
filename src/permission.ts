import router from "./router";
import { useAuth } from "./stores/auth";

const authWhiteList = ["/auth"];

router.beforeEach((to, from, next) => {
  const { token } = useAuth();
  if (token) {
    if (to.path === "/auth") {
      next("/");
    } else {
      next();
    }
  } else {
    if (authWhiteList.includes(to.path)) {
      next();
    } else {
      next(`/auth?redirect=${to.path}`);
    }
  }
});
