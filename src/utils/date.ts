// 解析时间
export function ParseTime(
  time: number | string | Date,
  cFormat?: string
): string {
  if (!time) {
    return "未知时间";
  }

  const date = typeof time === "string" ? new Date(time) : new Date(time);
  const format = cFormat || "{y}-{m}-{d} {h}:{i}:{s}";

  const formatObj: Record<string, number | string> = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
  };

  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key];
    if (key === "a") {
      return ["日", "一", "二", "三", "四", "五", "六"][value as number];
    }
    return value.toString().padStart(2, "0");
  });

  return time_str;
}
