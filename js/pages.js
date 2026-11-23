/* ============================================================
   pages.js · 子页逻辑
   相册 / 日记 / 设置绑定 / 页面切换 / 重置
   ============================================================ */
(function (XW) {
  'use strict';
  var $ = XW.$, $$ = XW.$$, S = XW.S, DEF = XW.DEF, pad = XW.pad;

  /* ---------- 页面切换 ---------- */
  XW.switchTab = function (p) {
    $$('#dock button').forEach(function (b) { b.classList.toggle('active', b.dataset.p === p); });
    $$('.page').forEach(function (pg) { pg.classList.toggle('active', pg.id === 'page-' + p); });
    $('#main').scrollTop = 0;
  };
  $$('#dock button').forEach(function (b) {
    b.addEventListener('click', function () { XW.switchTab(b.dataset.p); });
  });

  /* ---------- 相册 ---------- */
  var photos = XW.store.get('xw-photos', []);
  function tileBg(s) {
    var h1 = s % 360, h2 = (s * 7 + 40) % 360;
    return 'linear-gradient(160deg,hsl(' + h1 + ' 42% 80%),hsl(' + h2 + ' 38% 66%))';
  }
  XW.renderAlbum = function () {
    var g = $('#albumGrid'); g.innerHTML = '';
    $('#albumEmpty').style.display = photos.length ? 'none' : 'block';
    photos.forEach(function (p, idx) {
      var t = document.createElement('div'); t.className = 'tile';
      t.style.background = tileBg(p.s);
      var d = new Date(p.t);
      t.innerHTML = '<span class="lb">' + (d.getMonth() + 1) + '/' + d.getDate() + '</span>'
        + '<button class="del" aria-label="删除">×</button>';
      t.querySelector('.del').addEventListener('click', function () {
        photos.splice(idx, 1);
        XW.store.set('xw-photos', photos);
        XW.renderAlbum();
        XW.toast('删掉了');
      });
      g.appendChild(t);
    });
  };
  $('#albumAdd').addEventListener('click', function () {
    photos.unshift({ s: Math.floor(Math.random() * 360), t: Date.now() });
    XW.store.set('xw-photos', photos);
    XW.renderAlbum();
    if (photos.length === 1) XW.toast('第一张，放进来了');
  });

  /* ---------- 日记 ---------- */
  var entries = XW.store.get('xw-journal', []);
  XW.renderJr = function () {
    var l = $('#jrList'); l.innerHTML = '';
    $('#jrEmpty').style.display = entries.length ? 'none' : 'block';
    entries.forEach(function (en, idx) {
      var d = new Date(en.t);
      var e = document.createElement('div'); e.className = 'entry';
      e.innerHTML = '<div class="tx"><div class="d">' + (d.getMonth() + 1) + '月' + d.getDate() + '日 '
        + pad(d.getHours()) + ':' + pad(d.getMinutes()) + '</div><div class="c"></div></div>'
        + '<button class="x" aria-label="删除">×</button>';
      e.querySelector('.c').textContent = en.text;
      e.querySelector('.x').addEventListener('click', function () {
        entries.splice(idx, 1);
        XW.store.set('xw-journal', entries);
        XW.renderJr();
        XW.toast('删掉了');
      });
      l.appendChild(e);
    });
  };
  $('#jrText').addEventListener('input', function () {
    $('#jrCnt').textContent = this.value.length + ' 字';
  });
  $('#jrSave').addEventListener('click', function () {
    var v = $('#jrText').value.trim();
    if (!v) { XW.toast('先写点什么吧'); return; }
    entries.unshift({ t: Date.now(), text: v });
    XW.store.set('xw-journal', entries);
    $('#jrText').value = '';
    $('#jrCnt').textContent = '0 字';
    XW.renderJr();
    XW.toast('存下来了');
  });

  /* ---------- 设置绑定（输入即存即生效） ---------- */
  var binds = [
    ['inA', 'a'], ['inB', 'b'], ['inStart', 'start'], ['inCity', 'city'],
    ['inUsed', 'quotaUsed'], ['inTotal', 'quotaTotal'], ['inSong', 'song'],
    ['inArtist', 'artist'], ['inTheme', 'theme']
  ];
  binds.forEach(function (bd) {
    var el = $('#' + bd[0]);
    el.value = S[bd[1]] == null ? '' : S[bd[1]];
    el.addEventListener('input', function () {
      var v = el.value;
      if (bd[0] === 'inUsed' || bd[0] === 'inTotal') v = parseFloat(v);
      S[bd[1]] = v;
      XW.save();
      XW.refresh();
    });
  });

  /* ---------- 重置 ---------- */
  $('#resetAll').addEventListener('click', function () {
    if (!confirm('确定要清空所有本地数据吗？')) return;
    Object.keys(DEF).forEach(function (k) { XW.store.del('xw-' + k); });
    XW.store.del('xw-photos');
    XW.store.del('xw-journal');
    location.reload();
  });

})(window.XW);
