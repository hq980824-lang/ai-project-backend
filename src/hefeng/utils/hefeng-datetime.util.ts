/**
 * 将和风返回的 ISO 时间（如 2021-02-20T06:58+08:00）转为北京时间
 * `YYYY-MM-DD HH:mm:ss`。
 */
export function toChinaStandardDateTime(
  input: string | null | undefined,
): string | null {
  if (input == null) return null;
  const s = String(input).trim();
  if (!s) return null;
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return null;

  const f = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  const parts = f.formatToParts(d);
  const v = (t: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === t)?.value ?? '';
  return `${v('year')}-${v('month')}-${v('day')} ${v('hour')}:${v('minute')}:${v('second')}`;
}
