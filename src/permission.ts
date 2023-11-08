import router from "./router";
import { useAuth } from "./stores/auth";
import { useMe } from "./stores/me";

const authWhiteList = ["/auth"];

router.beforeEach(async (to, from, next) => {
  const { getMineInfos } = useMe();
  const { token, signOut } = useAuth();
  if (token) {
    try {
      // 获取用户信息
      await getMineInfos();
    } catch (err: any) {
      signOut();
      next(`/auth?redirect=${to.path}`);
    }

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
