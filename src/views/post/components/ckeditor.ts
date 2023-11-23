import Editor from "ckeditor5-custom-build";
import {
  UploadAdapter as UploadAdapterType,
  FileLoader,
} from "@ckeditor/ckeditor5-upload/src/filerepository";
import { UploadFile } from "@/api/common";
import { ParseTime } from "@/utils/date";

// 自定义上传
export function customUploadImage(editor: Editor) {
  editor.plugins.get("FileRepository").createUploadAdapter = (
    loader: FileLoader
  ) => {
    return new UploadAdapter(loader) as UploadAdapterType;
  };
}

// ckeditor固定的自定义上传方法格式
// 参考文档：https://ckeditor.com/docs/ckeditor5/latest/framework/deep-dive/upload-adapter.html#the-complete-implementation
class UploadAdapter {
  private loader: FileLoader;
  constructor(loader: FileLoader) {
    this.loader = loader;
  }
  async upload() {
    try {
      let file = await this.loader.file;
      if (file) {
        const date = new Date();
        const name = "blog/" + ParseTime(date, "{y}/{m}/{d}") + "/" + file.name;
        let res = (await UploadFile({ name, file })).data;
        return Promise.resolve({
          default: res?.fileUrl,
          // '160': 'http://example.com/images/image–size-160.image.png',
          // '500': 'http://example.com/images/image–size-500.image.png',
          // '1000': 'http://example.com/images/image–size-1000.image.png',
        });
      } else {
        return Promise.reject();
      }
    } catch (err: any) {
      // message.error(err || '上传失败')
    }
  }
  abort() {}
}
