function formatPast(date: string, type = 'default', zeroFillFlag = true): string | undefined {
  // 定义countTime变量，用于存储计算后的数据
  let countTime;
  // 获取当前时间戳
  let time = new Date().getTime();
  // 转换传入参数为时间戳
  const afferentTime = new Date(date).getTime();
  // 当前时间戳 - 传入时间戳
  time = Number.parseInt(`${time - afferentTime}`, 10);
  if (time < 10000) {
    // 10秒内
    return '刚刚';
  } if (time < 60000) {
    // 超过10秒少于1分钟内
    countTime = Math.floor(time / 1000);
    return `${countTime}秒前`;
  } if (time < 3600000) {
    // 超过1分钟少于1小时
    countTime = Math.floor(time / 60000);
    return `${countTime}分钟前`;
  } if (time < 86400000) {
    // 超过1小时少于24小时
    countTime = Math.floor(time / 3600000);
    return `${countTime}小时前`;
  } if (time >= 86400000 && type === 'default') {
    // 超过二十四小时（一天）且格式参数为默认"default"
    countTime = Math.floor(time / 86400000);
    // 大于等于365天
    if (countTime >= 365) {
      return `${Math.floor(countTime / 365)}年前`;
    }
    // 大于等于30天
    if (countTime >= 30) {
      return `${Math.floor(countTime / 30)}个月前`;
    }
    return `${countTime}天前`;
  }
  // 一天（24小时）以上且格式不为"default"则按传入格式参数显示不同格式
  // 数字补零
  const Y = new Date(date).getFullYear();
  const M = new Date(date).getMonth() + 1;
  const zeroFillM = M > 9 ? M : `0${M}`;
  const D = new Date(date).getDate();
  const zeroFillD = D > 9 ? D : `0${D}`;
  // 传入格式为"-" "/" "."
  if (type === '-' || type === '/' || type === '.') {
    return zeroFillFlag
      ? Y + type + zeroFillM + type + zeroFillD
      : Y + type + M + type + D;
  }
  // 传入格式为"年月日"
  if (type === '年月日') {
    return zeroFillFlag
      ? Y + type[0] + zeroFillM + type[1] + zeroFillD + type[2]
      : Y + type[0] + M + type[1] + D + type[2];
  }
  // 传入格式为"月日"
  if (type === '月日') {
    return zeroFillFlag
      ? zeroFillM + type[0] + zeroFillD + type[1]
      : M + type[0] + D + type[1];
  }
  // 传入格式为"年"
  if (type === '年') {
    return Y + type;
  }

  return undefined;
}

console.log(formatPast('2024-1-1 11:11:11')); // 3天前
console.log(formatPast('2023-11-1 11:11:11')); // 2个月前
console.log(formatPast('2015-07-10 21:32:01')); // 8年前
console.log(formatPast('2023-02-01 09:32:01', '-', false)); // 2023-2-1
console.log(formatPast('2023.12.8 19:32:01', '/')); // 2023/12/08
console.log(formatPast('2023.12.8 19:32:01', '.')); // 2023.12.08
console.log(formatPast('2023/5/10 11:32:01', '年月日')); // 2023年05月10日
console.log(formatPast('2023/6/25 11:32:01', '月日', false)); // 6月25日
console.log(formatPast('2023/8/08 11:32:01', '年')); // 2023年
