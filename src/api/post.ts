import LemFetch, { IResultData, PageOptions } from "@/utils/MyFetch";

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
  title: string;
  description: string;
  content: string;
  authorId: number;
  covers?: string;
  weight?: number;
  status?: PostStatus;
  isTop?: boolean;
  commentEnabled?: boolean;
  isRecommend?: boolean;
  tagIds?: number[];
}

export interface ResPost {
  id: number;
  authorId: number;
  commentCount: number;
  commentEnabled: boolean;
  content: string;
  covers: string[];
  createdAt: string;
  description: string;
  isRecommend: boolean;
  isTop: boolean;
  status: PostStatus;
  title: string;
  type: PostType;
  updatedAt: string;
  viewCount: number;
  weight: number;
}

// 获取文章列表
export const FetchPostList = (
  data: PageOptions
): Promise<IResultData<ResPost[]>> => {
  return LemFetch.get<PageOptions>(`/admin/post`, data);
};

// 新增文章
export const NewPost = (data: IPost) => {
  return LemFetch.post("/admin/post", data);
};
