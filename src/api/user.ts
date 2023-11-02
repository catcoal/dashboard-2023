import LemFetch, { IResultData, PageOptions } from "@/utils/MyFetch";

export interface IUser {
  account: string;
  author: string;
  authorIp: string;
  authorUrl: string;
  createdAt: string;
  email: string;
  id: number;
  role: "Admin" | "Custom";
}

export const FetchUserList = (
  data: PageOptions
): Promise<IResultData<IUser[]>> => {
  return LemFetch.get<PageOptions>(`/admin/user`, data);
};
