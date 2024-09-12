// @ts-nocheck


function startVolumeDetection(stream) {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const source = audioContext.createMediaStreamSource(stream);
  const analyser = audioContext.createAnalyser();
  analyser.fftSize = 2048; // 可以根据需要调整
  source.connect(analyser);

  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  // 更新音频数据
  function updateVolume() {
    analyser.getByteFrequencyData(dataArray);
    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
      sum += dataArray[i];
    }
    const average = sum / bufferLength;
    const volumePercentage = (average / 255) * 100;
    // 输出音量百分比
    console.log(`音量百分比: ${volumePercentage.toFixed(2)}%`);
  }

  setInterval(updateVolume, 100); // 每隔100毫秒更新一次音量
}

function initMicrophoneVolumeDetection() {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(startVolumeDetection)
      .catch((err) => {
        console.log(`拒绝访问麦克风: ${err}`);
      });
  } else {
    console.log('您的浏览器不支持Web Audio API');
  }
}
