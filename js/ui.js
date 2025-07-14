/**
 * Javascript Document UI
 */
const commonUi = {
  init: () => {
    // User-Agent 확인
    const ua = navigator.userAgent;
    ua.indexOf('Edg') > -1 && document.documentElement.classList.add('is-edge-browser');
  },
};

document.addEventListener('DOMContentLoaded', commonUi.init);
