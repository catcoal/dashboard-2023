import LemFetch, { IResultData, PageOptions } from "@/utils/MyFetch";

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
  query: ResourceQuery & PageOptions
): Promise<IResultData<Resource[]>> => {
  return LemFetch.get("/resources", query);
};

// 删除素材
export const DeleteResource = (remotePath: string) => {
  return LemFetch.delete("/resource", { remotePath });
};
