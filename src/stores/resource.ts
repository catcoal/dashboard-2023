import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useResource = defineStore("Resource", () => {
  const currentPath = ref<string[]>([]);
  const hasBack = computed(() => currentPath.value.length > 0);

  const push = (folder: string) => {
    currentPath.value.push("/" + folder);
  };

  const back = () => {
    return new Promise((resolve) => {
      if (hasBack.value) {
        currentPath.value.splice(currentPath.value.length - 1, 1);
        resolve(true);
      }
    });
  };

  return {
    currentPath,
    hasBack,
    push,
    back,
  };
});
