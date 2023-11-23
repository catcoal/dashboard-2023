const TokenKey = "Authorization";
const TsSecret = 609;

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

// 生成虚假时间戳，用于判断是否为伪造请求
export const CreateTimestamp = (): string => {
  const timestamp = Date.now();
  const ts = timestamp - (timestamp % TsSecret) + TsSecret;
  return ts.toString();
};
