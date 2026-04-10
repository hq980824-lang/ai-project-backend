/**
 * 日出日落接口返回。
 * sunrise / sunset / updateTime 为北京时间 `YYYY-MM-DD HH:mm:ss`，由和风 ISO 字符串转换而来。
 */
export class HefengSunVo {
  updateTime: string | null;
  fxLink: string | null;
  sunrise: string | null;
  sunset: string | null;
}
