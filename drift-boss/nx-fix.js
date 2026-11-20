/* Null X fix: skip dead click listeners.
   The booster-tutorial screen registers an undefined START DRIFT handler in
   game.js; Signal.dispatch then throws on every tap ("Cannot read properties
   of undefined (reading 'apply')"), which aborts the update loop and freezes
   the game before a run can start. This guard drops those listeners. */
(function () {
  'use strict';

  function install() {
    if (!window.ig || !ig.Signal || !ig.Signal.prototype) return false;
    var proto = ig.Signal.prototype;
    if (proto.__nxGuard) return true;
    var dispatch = proto.dispatch;
    proto.dispatch = function () {
      var listeners = this.signalListeners || [];
      for (var i = 0; i < listeners.length; i++) {
        if (!listeners[i] || typeof listeners[i].signalListener !== 'function') {
          listeners.splice(i, 1);
          i--;
        }
      }
      return dispatch.apply(this, arguments);
    };
    proto.__nxGuard = true;
    return true;
  }

  if (install()) return;
  var tries = 0;
  var timer = setInterval(function () {
    if (install() || ++tries > 400) clearInterval(timer);
  }, 50);
})();
