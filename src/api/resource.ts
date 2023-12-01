import LemFetch, { IResultData, FilterOptions } from "@/utils/MyFetch";

export interface ResourceQuery {
  remotePath: string;
}

export interface Resource {
  url?: string;
  name: string;
  size: number;
  time: number;
  type: "N" | "F"; // file type, N: 文件; F: 目录
}

// 获取素材
export const FetchResources = (
  query: ResourceQuery & FilterOptions
): Promise<IResultData<Resource[]>> => {
  return LemFetch.get("/resources", query);
};

// 创建文件夹
export const CreateFolder = (remotePath: string) => {
  return LemFetch.post("/dir", { remotePath });
};

// 删除素材
export const DeleteResource = (remotePath: string) => {
  return LemFetch.delete("/resource", { remotePath });
};

// 获取目录大小
export const FetchUsage = (remotePath: string) => {
  return LemFetch.get("/resource/size", { remotePath });
};
