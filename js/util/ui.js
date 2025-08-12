/**
 * Javascript Document UI
 */
const commonUi = {
  init: () => {
    // User-Agent 확인
    const ua = navigator.userAgent;
    ua.indexOf('Edg') > -1 && document.documentElement.classList.add('is-edge-browser');

    // GNB initialize
    const gnbContainer = document.querySelector('.gnb-container');
    setTimeout(() => {
      commonUi.gnb(gnbContainer);
    }, 50);
  },
  gnb: (gnbContainer) => {
    let gnbMenus = gnbContainer.querySelectorAll('.gnb-depth-1 .depth-1');
    [...gnbMenus].forEach((menu) => {
      menu.addEventListener('mouseenter', (e) => {
        gnbOpen(e.target);
      });
      menu.addEventListener('focusin', (e) => {
        gnbOpen(e.target.closest('.depth-1'));
      });

      menu.addEventListener('mouseleave', (e) => {
        gnbClose(e.target);
      });
      menu.addEventListener('focusout', (e) => {
        gnbClose(e.target.closest('.depth-1'));
      });
    });

    const gnbOpen = (target) => {
      let targetItem = target.querySelector('.depth-item');
      // let targetMenu = target.querySelector('.gnb-depth-2');
      // let targetHeight = targetMenu.getBoundingClientRect().height;
      target.classList.add('active');
      targetItem.style.height = '400px';
    };
    const gnbClose = (target) => {
      let targetItem = target.querySelector('.depth-item');
      target.classList.remove('active');
      targetItem.style.height = '0px';
    };
  },
};

document.addEventListener('DOMContentLoaded', commonUi.init);
