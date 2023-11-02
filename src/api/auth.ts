import LemFetch from "@/utils/MyFetch";

interface IAuth {
  account: string;
  password: string;
}

export const Authorizations = (data: IAuth) => {
  return LemFetch.post("/admin/authorizations", data);
};
