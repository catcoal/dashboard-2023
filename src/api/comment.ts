import LemFetch, { IResultData, FilterOptions } from "@/utils/MyFetch";

export type CommentStatusType = "Unreviewed" | "Show" | "Hide" | "Rubbish";

export enum CommentStatus {
  Unreviewed = "待审核",
  Show = "展示",
  Hide = "隐藏",
  Rubbish = "垃圾评论",
}

export interface Comment {
  id: number;
  status: CommentStatusType;
  postId?: number;
  parentId?: number;
  authorId?: number;
  post?: {};
  author?: {};
  createdAt?: string;
  content?: string;
  childComments?: Comment[];
}

export interface CommentQuery {
  status?: string;
}

export const FetchComments = (
  data: CommentQuery & FilterOptions
): Promise<IResultData<Comment[]>> => {
  return LemFetch.get("/admin/comments", data);
};

export const UpdateComment = (data: Comment) => {
  return LemFetch.patch("/admin/comment/" + data.id, data);
};

export const DeleteComment = (id: number) => {
  return LemFetch.delete("/admin/comment/" + id);
};
