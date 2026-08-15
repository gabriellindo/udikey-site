(function () {
  'use strict';
  var m = location.pathname.match(/\/servico\/([A-Za-z]{3}-\d{2})(?:\/|$)/);
  var cod = m ? m[1].toUpperCase() : '';
  var deep = 'udikey://servico/' + cod;
  document.getElementById('abrir').setAttribute('href', deep);
  if (!cod) return;

  var foto = document.getElementById('foto');
  foto.src = '/servicos-img/' + cod + '.jpg';
  foto.onload = function () { foto.hidden = false; };

  var t = setTimeout(function () {
    location.href = 'https://play.google.com/store/apps/details?id=com.udikey.app';
  }, 2200);
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) clearTimeout(t);
  });
  location.href = deep;
})();
