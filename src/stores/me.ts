import { defineStore } from "pinia";
import { ref } from "vue";
import { FetchMineInfo, ResMe } from "@/api/user";

export const useMe = defineStore("Me", () => {
  const MineInfo = ref<ResMe>();
  const getMineInfos = () => {
    return new Promise(async (resolve, reject) => {
      try {
        let res = await FetchMineInfo();
        MineInfo.value = res.data;
        resolve(res);
      } catch (err: any) {
        reject(err);
      }
    });
  };
  return {
    MineInfo,
    getMineInfos,
  };
});
