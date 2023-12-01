import LemFetch, { IResultData, FilterOptions } from "@/utils/MyFetch";

export type TagType = "Category" | "ArticleTag";
export interface ITag {
  name: string;
  type: TagType;
  id?: number;
  createdAt?: string;
  weight?: number;
}

export interface TagQuery extends FilterOptions {
  name?: string;
  type?: TagType;
}

export const FetchTagList = (data?: TagQuery): Promise<IResultData<ITag[]>> => {
  return LemFetch.get<TagQuery>(`/admin/tag`, data);
};

export const PostTag = (data: ITag): Promise<IResultData<ITag>> => {
  return LemFetch.post("/admin/tag", data);
};

export const DelTag = (id: number) => {
  return LemFetch.delete("/admin/tag/" + id);
};
