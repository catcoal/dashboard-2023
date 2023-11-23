import LemFetch, { IResultData } from "@/utils/MyFetch";

export interface ResFile {
  fileResult: any;
  fileUrl: string;
}

export const UploadFile = (data: {
  name: string;
  file: File;
}): Promise<IResultData<ResFile>> => {
  return LemFetch.uploadFile("/upload/file", {
    file: data.file,
    name: data.name,
  });
};
