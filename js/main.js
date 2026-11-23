/* ============================================================
   main.js · 启动入口
   ============================================================ */
(function (XW) {
  'use strict';

  XW.tick();
  setInterval(XW.tick, 1000);

  XW.renderCal();
  XW.renderAlbum();
  XW.renderJr();
  XW.refresh();
  XW.syncPlay();

})(window.XW);
