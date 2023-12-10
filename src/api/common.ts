import LemFetch, { IResultData } from "@/utils/MyFetch";

export interface ResFile {
  fileResult: any;
  fileUrl: string;
}
// 上传文件
export const UploadFile = (data: {
  name: string;
  file: File;
}): Promise<IResultData<ResFile>> => {
  return LemFetch.uploadFile("/upload/file", {
    file: data.file,
    name: data.name,
  });
};

export interface ResDashboardBasic {
  post_count: number;
  comment_count: number;
  unreviewed_comment_count: number;
}
// 获取控制面板基础信息
export const FetchDashboardBasic = (): Promise<
  IResultData<ResDashboardBasic>
> => {
  return LemFetch.get("/admin/basic");
};
