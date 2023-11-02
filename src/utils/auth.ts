const TokenKey = "Authorization";
export const Token = {
  get() {
    return localStorage.getItem(TokenKey);
  },
  set(token: string) {
    return localStorage.setItem(TokenKey, token);
  },
  clear() {
    return localStorage.removeItem(TokenKey);
  },
};
