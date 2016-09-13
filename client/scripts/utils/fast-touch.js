export default function fastTouch(handler) {
  return {
    onClick: event => {
      if (typeof handler === 'function') {
        handler(event);
      }
    },
    onTouchEnd: event => {
      if (event.cancelable === false) {
        // スクロール時はcancellable === falseなのでハンドラーを呼ばない
        return;
      }

      const touch = event.changedTouches[0];
      const bound = event.currentTarget.getBoundingClientRect();

      if (
        touch.clientX < bound.left
        || touch.clientX > bound.right
        || touch.clientY < bound.top
        || touch.clientY > bound.bottom
      ) {
        // 領域外で指を離したらハンドラーを呼ばない
        event.preventDefault();
        return;
      }

      if (handler == null && ['INPUT', 'SELECT', 'TEXTAREA'].includes(event.currentTarget.tagName)) {
        event.currentTarget.focus();
      } else if (typeof handler === 'function') {
          handler(event);
      }
    },
  };
}
