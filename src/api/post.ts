import LemFetch, { IResultData, PageOptions } from "@/utils/MyFetch";
import { ITag } from "./tag";

// export type PostStatus = "Publish" | "Private" | "Draft" | "Encrypt";
export enum PostStatus {
  Publish = "发布",
  Private = "私有",
  Draft = "草稿",
  Encrypt = "加密",
}

export enum PostType {
  Article = "文章",
  Dynamic = "动态",
}

export interface IPost {
  id?: number;
  title: string;
  enTitle: string;
  description: string;
  content: string;
  authorId: number;
  covers?: string[];
  weight?: number;
  status?: PostStatus;
  isTop?: boolean;
  commentEnabled?: boolean;
  isRecommend?: boolean;
  tagIds?: number[];
}

export interface ResPost {
  id: number;
  title: string;
  enTitle: string;
  description: string;
  content: string;
  authorId: number;
  covers: string[];
  weight: number;
  status: PostStatus;
  isTop: boolean;
  commentEnabled: boolean;
  isRecommend: boolean;
  tags?: ITag[];

  commentCount: number;
  createdAt: string;
  type: PostType;
  updatedAt: string;
  viewCount: number;
}

// 获取文章列表
export const FetchPostList = (
  data: PageOptions
): Promise<IResultData<ResPost[]>> => {
  return LemFetch.get<PageOptions>(`/admin/post`, data);
};

// 获取文章详情
export const FetchPostDetail = (id: number): Promise<IResultData<ResPost>> => {
  return LemFetch.get("/admin/post/" + id);
};

// 新增文章
export const NewPost = (data: IPost) => {
  return LemFetch.post("/admin/post", data);
};

// 新增文章
export const UpdatePost = (data: IPost) => {
  return LemFetch.patch("/admin/post/" + data.id, data);
};

// 删除文章
export const DelPost = (id: number) => {
  return LemFetch.delete("/admin/post/" + id);
};
