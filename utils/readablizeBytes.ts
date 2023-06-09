// 文件大小后缀转换
export default function readablizeBytes(bytes: number): string {
  if (bytes === 0) return '';
  const s = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const e = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / 1024 ** Math.floor(e)).toFixed(2)} ${s[e]}` ?? 0;
}
