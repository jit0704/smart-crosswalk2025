/**
 * Javascript Document UI
 */
const commonUi = {
  init: () => {
    // HTML include (퍼블리싱 확인용)
    if (document.querySelectorAll('[include-html]').length !== 0) {
      includeHTML();
    }

    // User-Agent 확인
    const ua = navigator.userAgent;
    ua.indexOf('Edg') > -1 && document.documentElement.classList.add('is-edge-browser');
  },
};

document.addEventListener('DOMContentLoaded', commonUi.init);
