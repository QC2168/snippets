import { ref, computed } from 'vue';

export default function useSendCode(cb: (mobile: string) => any, time = 60) {
  // 是否发送验证码
  const isSendCode = ref<boolean>(false);
  // 按钮文本
  const btnText = ref<string>('发送验证码');
  // 倒计时
  const remainSecond = ref<number>(time);
  // 按钮可视
  const disable = computed(() => remainSecond.value !== 0);
  // 计时器对象
  const timer = ref<null | NodeJS.Timer>(null);
  // 倒计时
  const countDown = () => {
    remainSecond.value = time;
    btnText.value = `已发送（${remainSecond.value}秒后可重新发送）`;
    timer.value = setInterval(() => {
      remainSecond.value -= 1;
      btnText.value = `已发送（${remainSecond.value}秒后可重新发送）`;
      //  计数0时取消计时器
      if (remainSecond.value <= 0 && timer.value !== null) {
        clearInterval(timer.value);
        remainSecond.value = 0;
        isSendCode.value = false;
        btnText.value = '重新发送';
      }
    }, 1000);
  };

  // 点击发送验证码
  const sendCode = async (mobile: string) => {
    // 判断是否输入手机号
    // 发送请求
    await cb(mobile);
    isSendCode.value = true;
    // 倒计时
    countDown();
  };
  return {
    sendCode,
    btnText,
    disable,
  };
}
