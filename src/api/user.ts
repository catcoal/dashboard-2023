import LemFetch, { IResultData, PageOptions } from "@/utils/MyFetch";

type UserRole = "Admin" | "Custom";

export interface IUser {
  account: string;
  author: string;
  authorIp: string;
  authorUrl: string;
  createdAt: string;
  email: string;
  id: number;
  role: UserRole;
}

interface UserQuery {
  role?: UserRole;
}

export const FetchUserList = (
  data?: UserQuery & PageOptions
): Promise<IResultData<IUser[]>> => {
  return LemFetch.get<PageOptions>(`/admin/user`, data);
};

export const FetchMeInfo = () => {
  return LemFetch.get("/admin/user/me");
};
