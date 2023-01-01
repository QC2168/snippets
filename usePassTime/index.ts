function usePassTime(sourceTime:number) {
    const currentTime = Date.now();
    const time = currentTime - sourceTime;
    const day = Math.floor(time / (1000 * 60 * 60 * 24));
    const hour = Math.floor(time / (1000 * 60 * 60));
    const min = Math.floor(time / (1000 * 60));
    const second = Math.floor(time / 1000);
    const month = Math.floor(day / 30);
    const year = Math.floor(month / 12);
    if (year) return year + "年前"
    if (month) return month + "个月前"
    if (day) return day + "天前"
    if (hour) return hour + "小时前"
    if (min) return min + "分钟前"
    if (second) return second + "秒前"
    else return '刚刚'
}