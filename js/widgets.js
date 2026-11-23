/* ============================================================
   widgets.js · 首页小组件
   时钟问候 / 纪念日 / 天气 / 额度环 / 日历 / 音乐 / 主题
   ============================================================ */
(function (XW) {
  'use strict';
  var $ = XW.$, S = XW.S, DEF = XW.DEF, pad = XW.pad, WD = XW.WD;

  /* ---------- 主题（第十章：白昼 / 夜幕 / 自动） ---------- */
  XW.applyTheme = function () {
    var m = S.theme || 'auto';
    var h = new Date().getHours();
    var night = m === 'night' || (m === 'auto' && (h >= 19 || h < 6));
    var v = night ? 'night' : 'day';
    if (document.documentElement.dataset.theme !== v) {
      document.documentElement.dataset.theme = v;
    }
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = night ? '#131313' : '#F5F4F1';
  };

  /* ---------- 时钟与问候 ---------- */
  XW.tick = function () {
    XW.applyTheme();
    var d = new Date();
    $('#clock').textContent = pad(d.getHours()) + ':' + pad(d.getMinutes());
    $('#heroDate').textContent = (d.getMonth() + 1) + '月' + d.getDate() + '日 · 星期' + WD[d.getDay()];
    var h = d.getHours();
    var g = h < 5 ? '夜深了' : h < 11 ? '早安' : h < 14 ? '午安' : h < 18 ? '下午好' : h < 23 ? '晚安' : '夜深了';
    $('#greet').innerHTML = '<b>' + g + '</b> · 星期' + WD[d.getDay()] + ' '
      + (d.getMonth() + 1) + '月' + d.getDate() + '日';
  };

  /* ---------- 纪念日（数字滚动） ---------- */
  var rafId = null;
  function countUp(el, to) {
    if (rafId) cancelAnimationFrame(rafId);
    var t0 = null;
    function step(ts) {
      if (!t0) t0 = ts;
      var p = Math.min(1, (ts - t0) / 1200);
      var e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(to * e).toLocaleString('en-US');
      if (p < 1) rafId = requestAnimationFrame(step);
    }
    rafId = requestAnimationFrame(step);
  }

  XW.refreshDays = function () {
    var start = new Date((S.start || DEF.start) + 'T00:00:00');
    var now = new Date(); now.setHours(0, 0, 0, 0);
    var days = Math.round((now - start) / 86400000);
    if (isNaN(days) || days < 0) days = 0;
    countUp($('#daysNum'), days);
    $('#since').textContent = (S.start || DEF.start).replace(/-/g, '.');
    $('#whoNames').textContent = (S.a || '他') + ' & ' + (S.b || '她');
    var next = Math.floor(days / 100) * 100 + 100;
    var remain = next - days;
    $('#mileTxt').textContent = '距 ' + next + ' 天还有 ' + remain + ' 天';
    $('#milePct').textContent = Math.round(days / next * 100) + '%';
    setTimeout(function () {
      $('#mileBar').style.width = Math.min(100, days / next * 100) + '%';
    }, 60);
  };

  /* ---------- 天气（本地模拟，按 城市+日期 稳定变化） ---------- */
  var CONDS = [['☀️', '晴', 2], ['⛅', '多云', 0], ['☁️', '阴', -2], ['🌦', '小雨', -5], ['🌙', '晴', -4]];
  function hash(s) { var h = 0; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; }

  XW.refreshWeather = function () {
    var city = (S.city || '').trim();
    if (!city) {
      $('#wxIco').textContent = '—';
      $('#wxTemp').textContent = '—';
      $('#wxSub').textContent = '未设置城市';
      return;
    }
    var d = new Date();
    var key = city + d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
    var h = hash(key);
    var night = d.getHours() >= 18 || d.getHours() < 6;
    var c = night ? CONDS[4] : CONDS[h % 4];
    $('#wxIco').textContent = c[0];
    $('#wxTemp').textContent = (7 + h % 15 + c[2]) + '°';
    $('#wxSub').textContent = city + ' · ' + c[1];
  };

  /* ---------- 额度环 ---------- */
  XW.refreshQuota = function () {
    var used = +S.quotaUsed || 0, total = +S.quotaTotal || 0;
    var p = total > 0 ? Math.min(100, used / total * 100) : 0;
    var C = 163.36; /* 2πr, r=26 */
    $('#ringFg').style.strokeDashoffset = C * (1 - p / 100);
    $('#ringPct').textContent = Math.round(p) + '%';
    $('#quotaFig').textContent = used.toFixed(1) + 'k / ' + total + 'k';
  };

  /* ---------- 日历 ---------- */
  var calCur = new Date();
  XW.renderCal = function () {
    var y = calCur.getFullYear(), m = calCur.getMonth();
    $('#calTitle').textContent = y + ' 年 ' + (m + 1) + ' 月';
    var first = new Date(y, m, 1).getDay();
    var n = new Date(y, m + 1, 0).getDate();
    var g = $('#calGrid'); g.innerHTML = '';
    '日一二三四五六'.split('').forEach(function (w) {
      var e = document.createElement('div'); e.className = 'wd'; e.textContent = w; g.appendChild(e);
    });
    for (var i = 0; i < first; i++) g.appendChild(document.createElement('div'));
    var today = new Date();
    for (var d = 1; d <= n; d++) {
      var e = document.createElement('div'); e.className = 'd'; e.textContent = d;
      if (y === today.getFullYear() && m === today.getMonth() && d === today.getDate()) e.classList.add('today');
      g.appendChild(e);
    }
  };
  $('#calPrev').addEventListener('click', function () { calCur.setMonth(calCur.getMonth() - 1); XW.renderCal(); });
  $('#calNext').addEventListener('click', function () { calCur.setMonth(calCur.getMonth() + 1); XW.renderCal(); });

  /* ---------- 音乐 ---------- */
  var playing = false;
  XW.syncPlay = function () {
    $('#musicCard').classList.toggle('playing', playing);
    $('#playIco').innerHTML = playing
      ? '<rect x="3" y="2.5" width="3.6" height="11" rx="1"/><rect x="9.4" y="2.5" width="3.6" height="11" rx="1"/>'
      : '<path d="M4 2.5v11l9-5.5z"/>';
  };
  XW.refreshMusic = function () {
    var has = (S.song || '').trim();
    $('#mTitle').textContent = has || '还没挑一首';
    $('#mArtist').textContent = (S.artist || '').trim() || (has ? '' : '点这里去加');
    $('#mInfo').classList.toggle('empty', !has);
    if (!has && playing) { playing = false; XW.syncPlay(); }
  };
  $('#playBtn').addEventListener('click', function () {
    if (!(S.song || '').trim()) { XW.toast('去「更多」挑一首歌吧'); return; }
    playing = !playing; XW.syncPlay();
    if (playing) XW.toast('♪ ' + S.song);
  });
  $('#mInfo').addEventListener('click', function () {
    if (!(S.song || '').trim()) XW.switchTab('more');
  });

  /* ---------- 总刷新（设置改动后调用） ---------- */
  XW.refresh = function () {
    $('#nameA').textContent = S.a || '他';
    $('#nameB').textContent = S.b || '她';
    XW.applyTheme();
    XW.refreshDays();
    XW.refreshWeather();
    XW.refreshQuota();
    XW.refreshMusic();
  };

})(window.XW);
