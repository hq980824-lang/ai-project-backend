export class HefengIndecesVo {
  // 预报日期
  date: string;
  // 生活指数类型ID
  type: string;
  // 生活指数类型的名称
  name: string;
  // 生活指数类型等级
  level: string;
  // 生活指数预报级别名称
  category: string;
  // 生活指数预报的详细描述，可能为空
  text: string | null;
}