import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { Resource } from "@/api/resource";

export const useResource = defineStore("Resource", () => {
  const currentPath = ref<string[]>([]);
  const hasBack = computed(() => currentPath.value.length > 0);
  const selectedFiles = ref<Set<string>>(new Set());

  const selectFile = (url: string) => {
    if (selectedFiles.value.has(url)) {
      selectedFiles.value.delete(url);
    } else {
      selectedFiles.value.add(url);
    }
  };

  const clearSelect = () => {
    selectedFiles.value.clear();
  };

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
    selectedFiles,
    push,
    back,
    selectFile,
    clearSelect,
  };
});
