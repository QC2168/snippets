function removeEventListenerByType(element, eventType) {
  // 获取元素上的所有事件监听器
  const listeners = getEventListeners(element)?.[eventType];

  if (listeners) {
    // 遍历所有的监听器并移除它们
    listeners.forEach((listenerInfo) => {
      // 获取事件监听器的实际函数
      const { listener } = listenerInfo;

      // 移除事件监听器
      element.removeEventListener(eventType, listener);
    });
  }
}
