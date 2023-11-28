import LemFetch, { IResultData, PageOptions } from "@/utils/MyFetch";

export type UserRole = "Admin" | "Custom";

export interface ResMe {
  id: number;
  email: string;
  author: string;
  role: UserRole;
  exp?: number;
  iat?: number;
}

export interface IUser {
  account: string;
  author: string;
  authorIp: string;
  authorUrl: string;
  createdAt: string;
  email: string;
  id: number;
  role: UserRole;
  _count: {
    posts: number;
    comments: number;
  };
}

export interface NewUser {
  author: string;
  email: string;
  password: string;
  account?: string;
  authorUrl?: string;
  role?: UserRole;
}

interface UserQuery {
  role?: UserRole;
}

export const FetchUserList = (
  data?: UserQuery & PageOptions
): Promise<IResultData<IUser[]>> => {
  return LemFetch.get<PageOptions>(`/admin/user`, data);
};

export const FetchMineInfo = (): Promise<IResultData<ResMe>> => {
  return LemFetch.get("/admin/user/me");
};

export const AddUser = (data: NewUser) => {
  return LemFetch.post("/admin/user", data);
};

export const DelUser = (id: number) => {
  return LemFetch.delete("/admin/user/" + id);
};
