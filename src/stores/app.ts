import { defineStore } from "pinia";
import { ref } from "vue";
import { isMobile } from "@/utils/utils";

export const useApp = defineStore("App", () => {
  const menuCollapsed = ref<boolean>(isMobile());

  const switchCollapsed = () => {
    menuCollapsed.value = !menuCollapsed.value;
  };
  return {
    menuCollapsed,
    switchCollapsed,
  };
});
