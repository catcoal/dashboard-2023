import { defineStore } from "pinia";
import { ref } from "vue";
import { Token } from "@/utils/auth";
import { Authorizations, IAuth, ResAuth } from "@/api/auth";

export const useAuth = defineStore("Auth", () => {
  const token = ref<string>(Token.get() || "");

  const signIn = (authToken: string) => {
    Token.set(authToken);
    token.value = authToken;
  };

  const signOut = () => {
    Token.clear();
    token.value = "";
  };

  return {
    token,
    signIn,
    signOut,
  };
});
