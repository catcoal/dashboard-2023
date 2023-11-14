// 图片质量返回
export const OptimizeImageURL = (url: string, size: number) => {
  if (size <= 20) {
    return url + "!v1/scale/20/quality/30";
  } else if (size <= 50) {
    return url + "!v1/scale/30/quality/50";
  } else if (size <= 80) {
    return url + "!v1/scale/40/quality/80";
  } else if (size <= 100) {
    return url;
  }
};

// 是否为移动端
export const isMobile = (): boolean => {
  const userAgent = window.navigator.userAgent.toLowerCase();
  return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
    userAgent
  );
};

// 大小转换函数
export const ConvertSize = (bytes: number): string => {
  const units = ["Bytes", "KB", "MB", "GB", "TB"];

  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
};

/**
 * 将文件图片转换为Base64编码
 * @param {File} file - 要转换的文件
 * @param {number} quality - 图片质量，范围在0到1之间，默认为1（无损压缩）
 * @return {Promise<string>} - 返回Base64编码的字符串
 */
export const FileToBase64 = (
  file: File,
  quality: number = 1
): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    if (!file || !file.type.startsWith("image/")) {
      reject(new Error("Invalid file type. Please provide an image file."));
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const image = new Image();

      image.onload = () => {
        const maxWidth = image.width;
        const maxHeight = image.height;

        const canvas = document.createElement("canvas");
        canvas.width = maxWidth;
        canvas.height = maxHeight;

        const context = canvas.getContext("2d")!;
        context.drawImage(image, 0, 0, maxWidth, maxHeight);

        // 将画布上的图像转为Base64编码
        const base64String = canvas.toDataURL(file.type, quality);
        resolve(base64String);
      };

      image.onerror = (error) => {
        reject(error);
      };

      image.src = reader.result as string;
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsDataURL(file);
  });
};
