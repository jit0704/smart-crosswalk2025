var iaURL = '../'; // 현황판 작업목록 루트경로
var ajaxURL = 'html/'; // 현황판 리스트 URL

var ia = {
  baseUrl: 'html/',
  init: function () {
    var _this = this;
    var sections = document.querySelectorAll('.ia-section-ajax');
    sections.forEach(function (section, i) {
      var file = section.dataset.file;
      var color = '#' + section.dataset.color;
      var graphHtml =
        '<li>' +
        '   <a href="#gIA' +
        i +
        '" data-role="spy-scroll">' +
        '       <span class="tit"><!-- 자동입력 --></span>' +
        '       <span class="bar" data-color="' +
        color +
        '"><span class="active"></span></span>' +
        '       <span class="pages"><em class="graph-complete"></em>/<em class="graph-total"></em></span>' +
        '   </a>' +
        '</li>';

      section.id = 'gIA' + i;
      document.querySelector('.ia-graph .graph').insertAdjacentHTML('beforeend', graphHtml);

      // IA페이지 로드 후 설정
      setTimeout(function () {
        _this.cal('#gIA' + i);
      }, 100);
      _this.url('#gIA' + i);

      if (sections.length - 1 === i) {
        iaUI.spyScroll.init();
        setTimeout(function () {
          iaUI.accordion.init();
        }, 200);
      }
    });
  },
  cal: function (obj) {
    var element = document.querySelector(obj);
    // col-complete체크
    if (element.querySelectorAll('[data-complete=완료]').length > 0) {
      element.querySelectorAll('[data-complete=완료]').forEach((item) => {
        item.parentNode.classList.add('row-done');
      });
    }
    if (element.querySelectorAll('[data-complete=삭제]').length > 0) {
      element.querySelectorAll('[data-complete=삭제]').forEach((item) => {
        item.parentNode.classList.add('row-del');
      });
    }
    if (element.querySelectorAll('[data-complete=제외]').length > 0) {
      element.querySelectorAll('[data-complete=제외]').forEach((item) => {
        item.parentNode.classList.add('row-except');
      });
    }
    element.querySelectorAll('.row-del .col-num').forEach(function (num) {
      num.classList.remove('col-num');
    });
    element.querySelectorAll('.row-except .col-num').forEach(function (num) {
      num.classList.remove('col-num');
    });

    // 계산
    var cal_total = element.querySelectorAll('.col-num').length;
    var cal_complete = element.querySelectorAll('[data-complete=완료]').length;
    var cal_process = Math.round((cal_complete / cal_total) * 100);

    // 그래프
    var graph = document.querySelector('.ia-graph a[href="' + obj + '"]');
    var graph_tit = graph.querySelector('.tit');
    var graph_total = graph.querySelector('.graph-total');
    var graph_complete = graph.querySelector('.graph-complete');
    var graph_process = graph.querySelector('.bar');
    var graph_active = graph.querySelector('.bar .active');
    graph_total.textContent = cal_total;
    graph_complete.textContent = cal_complete;
    graph_process.setAttribute('data-process', cal_process + '%');
    graph_active.style.backgroundColor = graph_process.dataset.color;
    graph_active.style.width = cal_process + '%';

    // 범례
    var legend_total = element.querySelector('.legend-total');
    var legend_complete = element.querySelector('.legend-complete');
    var legend_process = element.querySelector('.legend-process');
    legend_total.textContent = cal_total;
    legend_complete.textContent = cal_complete;
    legend_process.textContent = cal_complete > 0 ? cal_process + '%' : '0%';

    // 리스트
    var ia_num = element.querySelectorAll('.col-num');
    var ia_depth4 = element.querySelectorAll('td.col-4depth');
    var is_depth4 = false;
    var ia_depth5 = element.querySelectorAll('td.col-5depth');
    var is_depth5 = false;
    var ia_tit = element.querySelector('.ia-h2 > a').textContent;
    graph_tit.innerHTML = ia_tit;

    // 넘버링
    for (var i = 0; i < cal_total; i++) {
      ia_num[i].textContent = i + 1;
    }

    // depth4체크
    for (var j = 0; j < ia_depth4.length; j++) {
      if (ia_depth4[j].textContent !== '') {
        is_depth4 = true;
      }
    }
    if (!is_depth4) {
      element.querySelectorAll('.col-4depth').forEach(function (depth) {
        depth.style.display = 'none';
      });
    }

    // depth5체크
    for (var k = 0; k < ia_depth5.length; k++) {
      if (ia_depth5[k].textContent !== '') {
        is_depth5 = true;
      }
    }
    if (!is_depth5) {
      element.querySelectorAll('.col-5depth').forEach(function (depth) {
        depth.style.display = 'none';
      });
    }
  },
  url: function (obj) {
    var element = document.querySelector(obj);
    element.querySelectorAll('td.col-url').forEach(function (urlCell) {
      var src = iaURL + urlCell.textContent;
      urlCell.innerHTML = '<a href="' + src + '" target="_blank">' + src + '</a>';
    });
  },
};

var iaUI = {
  winEvent: function () {
    var setTime = null;
    window.addEventListener('scroll', function () {
      clearTimeout(setTime);
      setTime = setTimeout(function () {
        iaUI.scrolled.init();
      }, 10);
    });
  },
  top: function () {
    window.scrollTo(0, 0);
  },
  spyScroll: {
    init: function () {
      var links = document.querySelectorAll('[data-role=spy-scroll]');
      links.forEach(function (link) {
        link.addEventListener('click', function (e) {
          e.preventDefault();
          var target = document.querySelector(this.getAttribute('href'));
          var topH = 90;
          window.scrollTo({
            top: target.offsetTop - topH,
            behavior: 'smooth',
          });
        });
      });
    },
  },
  scrolled: {
    init: function () {
      if (document.documentElement.scrollTop > 50 || document.body.scrollTop > 50) {
        if (!document.getElementById('ia-wrap').classList.contains('is-scrolled')) {
          document.getElementById('ia-wrap').classList.add('is-scrolled');
        }
      } else {
        if (document.getElementById('ia-wrap').classList.contains('is-scrolled')) {
          document.getElementById('ia-wrap').classList.remove('is-scrolled');
        }
      }
    },
  },
  accordion: {
    eleModule: '.ia-section-ajax',
    eleHeader: '.ia-section-header',
    eleBody: '.ia-section-body',
    init: function () {
      var _this = this;
      _this.event();
    },
    event: function () {
      var _this = this;
      var graphLinks = document.querySelectorAll('.ia-graph a');
      graphLinks.forEach(function (link) {
        link.addEventListener('click', function () {
          var id = this.getAttribute('href');
          document.querySelector(id).querySelector(_this.eleBody).style.height = 'auto';
        });
      });
      var headers = document.querySelectorAll(_this.eleHeader);
      headers.forEach(function (header) {
        header.addEventListener('click', function () {
          _this.action(this.nextElementSibling);
        });
      });
    },
    action: function ($this) {
      if ($this.style.height === '0px' || $this.style.height === '') {
        $this.style.height = 'auto';
      } else {
        $this.style.height = '0';
      }
    },
  },
  preview: {
    eleThumb: '.ia-tab-content.type-thumb',
    eleList: '.ia-tab-content.type-list',
    thumb: function () {
      document.querySelector(this.eleThumb).classList.add('is-visible');
      document.querySelector(this.eleList).classList.remove('is-visible');
    },
    list: function () {
      document.querySelector(this.eleThumb).classList.remove('is-visible');
      document.querySelector(this.eleList).classList.add('is-visible');
    },
  },
};

document.addEventListener('DOMContentLoaded', function () {
  ia.init();
  iaUI.winEvent();
  iaUI.spyScroll.init();
  iaUI.scrolled.init();
});
