import { Token } from "@/utils/auth";
// import { LemVantDialog } from "./lem-vant";

export interface IResultData<T> {
  data?: T;
  meta?: any;
}

export interface PageOptions {
  page?: number;
  pageSize?: number;
}

class LemFetch {
  baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_APP_BASE_API;
  }

  private async handleResponse(response: Response) {
    if (response.status >= 200 && response.status < 300) {
      if (response.status === 204) {
        return { success: true };
      }
      // 请求成功
      return response.json();
    } else {
      if (response.status === 401) {
        //   // 权限错误
        //   LemVantDialog({
        //     message: "权限错误,请重新登录!",
        //   }).then(() => {
        Token.clear();
        //     window.location.reload();
        //   });
        //   return;
      }
      // 请求失败，处理错误信息
      let errorMessage = "未知错误";
      try {
        const errorData = await response.json();
        if (errorData && errorData.message) {
          errorMessage = errorData.message;
        }
      } catch (error) {
        // 如果无法解析错误信息，使用默认错误消息
      }
      // throw `请求错误码为 ${response.status}: ${errorMessage}`;
      throw `${errorMessage}`;
    }
  }

  async request(url: string, method: string, data?: any) {
    try {
      const response = await fetch(`${this.baseUrl}${url}`, {
        method,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          // Authorization: "Bearer " + Token.get(),
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiYXV0aG9yIjoiTGVtbWluZyIsInJvbGUiOiJBZG1pbiIsImlhdCI6MTY5ODk3NzU1MSwiZXhwIjoxNjk5MDIwNzUxfQ._fQSTeBbL0VGIOUZ1sCfIFy1FG8ulye5-tOh9zSaitI",
        },
        body: JSON.stringify(data),
      });
      return this.handleResponse(response);
    } catch (err: any) {
      throw `请求错误 ${err}`;
    }
  }

  // 下载文件
  async downloadFile(url: string, filename: string) {
    try {
      const response = await fetch(`${this.baseUrl}${url}`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + Token.get(),
        },
      });
      if (response.status >= 200 && response.status < 300) {
        const blob = await response.blob();

        // 创建一个临时的URL以下载文件
        const url = window.URL.createObjectURL(blob);

        // 创建一个<a>元素来触发下载
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();

        // 释放URL对象
        window.URL.revokeObjectURL(url);

        return { success: true };
      } else {
        // 处理下载失败
        throw `下载文件失败：HTTP错误码 ${response.status}`;
      }
    } catch (err) {
      throw `下载文件时出错：${err}`;
    }
  }

  // 上传文件
  async uploadFile(url: string, params: Record<string, any>) {
    try {
      const formData = new FormData();
      for (const key in params) {
        if (params.hasOwnProperty(key)) {
          formData.append(key, params[key]);
        }
      }

      const response = await fetch(`${this.baseUrl}${url}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          // "Content-Type":
          //   "multipart/form-data",
          Authorization: "Bearer " + Token.get(),
        },
        body: formData,
      });

      return this.handleResponse(response);
    } catch (err) {
      throw `上传文件时出错：${err}`;
    }
  }

  async get<T extends Record<string, any>>(url: string, data?: T) {
    if (data) {
      url +=
        "?" +
        Object.keys(data)
          .map((key) => `${key}=${encodeURIComponent(data[key])}`)
          .join("&");
    }
    return this.request(url, "GET");
  }

  async post(url: string, data: any) {
    return this.request(url, "POST", data);
  }

  async put(url: string, data: any) {
    return this.request(url, "PUT", data);
  }

  async patch(url: string, data: any) {
    return this.request(url, "PATCH", data);
  }

  async delete(url: string) {
    return this.request(url, "DELETE");
  }
}

export default new LemFetch();
