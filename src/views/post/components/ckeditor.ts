import Editor from "ckeditor5-custom-build";
import { UploadFile, ResFile } from "@/api/common";

// 自定义上传
export function customUploadImage(editor: Editor) {
  (editor.plugins.get("FileRepository").createUploadAdapter as any) = (
    loader: any
  ) => {
    return new UploadAdapter(loader);
  };
}

// ckeditor固定的自定义上传方法格式
class UploadAdapter {
  private loader: any;
  constructor(loader: any) {
    this.loader = loader;
  }
  async upload() {
    try {
      let file = await this.loader.file;
      let res = (await UploadFile({ file })).data;
      return new Promise((resolve) => {
        resolve({
          default: res?.fileUrl,
          // '160': 'http://example.com/images/image–size-160.image.png',
          // '500': 'http://example.com/images/image–size-500.image.png',
          // '1000': 'http://example.com/images/image–size-1000.image.png',
        });
      });
    } catch (err: any) {
      // message.error(err || '上传失败')
    }
  }
  abort() {}
}
