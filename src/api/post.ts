import LemFetch, { IResultData, PageOptions } from "@/utils/MyFetch";

// export type PostStatus = "Publish" | "Private" | "Draft" | "Encrypt";
export enum PostStatus {
  Publish = "发布",
  Private = "私有",
  Draft = "草稿",
  Encrypt = "加密",
}

export interface IPost {
  title: string;
  description: string;
  content: string;
  authorId: number;
  covers?: string;
  weight?: number;
  status?: PostStatus;
  isTop?: number;
  commentEnabled?: number;
  categoryId?: number;
  tagIds?: string;
  isRecommend?: number;
}

export const FetchPostList = (
  data: PageOptions
): Promise<IResultData<IPost[]>> => {
  return LemFetch.get<PageOptions>(`/admin/post`, data);
};
