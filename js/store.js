/* ============================================================
   store.js · 全局命名空间 / 本地存储 / 工具函数
   后面的 widgets.js、pages.js、main.js 都挂在 XW 上。
   ============================================================ */
window.XW = window.XW || {};

(function (XW) {
  'use strict';

  /* ---------- DOM 工具 ---------- */
  XW.$ = function (s) { return document.querySelector(s); };
  XW.$$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };

  /* ---------- 本地存储（容错封装） ---------- */
  XW.store = {
    get: function (k, d) {
      try {
        var v = localStorage.getItem(k);
        return v == null ? d : JSON.parse(v);
      } catch (e) { return d; }
    },
    set: function (k, v) {
      try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {}
    },
    del: function (k) {
      try { localStorage.removeItem(k); } catch (e) {}
    }
  };

  /* ---------- 默认设置 ---------- */
  XW.DEF = {
    a: '他', b: '她',
    start: '2025-01-01',
    city: '',
    quotaUsed: 0, quotaTotal: 128,
    song: '', artist: '',
    theme: 'auto'   /* auto / day / night（见宪法第十章） */
  };

  /* ---------- 当前设置（启动时从本地读出） ---------- */
  XW.S = {};
  Object.keys(XW.DEF).forEach(function (k) {
    XW.S[k] = XW.store.get('xw-' + k, XW.DEF[k]);
  });
  XW.save = function () {
    Object.keys(XW.S).forEach(function (k) { XW.store.set('xw-' + k, XW.S[k]); });
  };

  /* ---------- 小工具 ---------- */
  XW.pad = function (n) { return (n < 10 ? '0' : '') + n; };
  XW.WD = '日一二三四五六';

  /* ---------- toast ---------- */
  var toastT = null;
  XW.toast = function (msg) {
    var t = XW.$('#toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastT);
    toastT = setTimeout(function () { t.classList.remove('show'); }, 1800);
  };

})(window.XW);
