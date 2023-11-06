import LemFetch from "@/utils/MyFetch";
import { UserRole } from "./user";

export interface IAuth {
  account: string;
  password: string;
}

export interface ResAuth {
  token: string;
  userInfos: UserInfos;
}

interface UserInfos {
  id: number;
  author: string;
  email: string;
  role: UserRole;
}

export const Authorizations = (data: IAuth): Promise<ResAuth> => {
  return LemFetch.post("/admin/authorizations", data);
};
