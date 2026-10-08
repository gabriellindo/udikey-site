/* ============================================================
   udikey.com/app: abre o app UDIkey (2026-10-08)
   ------------------------------------------------------------
   É o link do WhatsApp que avisa o chaveiro "tem pedido, fique
   online". O app, aberto pela raiz (udikey://), já leva o
   chaveiro logado pra área dele, onde fica o botão de ficar online.

   - Android: intent:// com o pacote e o endereço de reserva
     (S.browser_fallback_url). Se o app não estiver instalado, o
     próprio Chrome vai pra Play Store, sem depender de relógio. É o
     mesmo caminho do painel (painel-udikey/lib/lojas.ts).
   - iPhone: udikey:// direto.
   - Computador: não tenta abrir nada (não existe o app ali).

   Se em 2,2 s a página continuar visível, o app não abriu: a página
   MOSTRA a loja certa em vez de mandar pra ela. Quem recebe é
   chaveiro, que quase sempre já tem o app. No iPhone o Safari
   pergunta "Abrir no UDIkey?" e um desvio automático derrubaria
   essa pergunta; e navegador embutido que bloqueia o esquema
   esconderia o botão "Abrir o app" atrás da página da loja.
   ============================================================ */
(function () {
  'use strict';

  var PLAY = 'https://play.google.com/store/apps/details?id=com.udikey.app';

  var ua = navigator.userAgent || '';
  // iPad novo diz ser Mac; o toque e o fabricante separam os dois (igual ao painel)
  var appleAqui = /Apple/i.test(navigator.vendor || '');
  var ehIOS = /iPhone|iPod|iPad/i.test(ua) ||
    (/Macintosh/i.test(ua) && (navigator.maxTouchPoints || 0) > 1 && appleAqui);
  var ehAndroid = /Android/i.test(ua);

  var titulo = document.getElementById('titulo');
  var texto = document.getElementById('texto');
  var abrir = document.getElementById('abrir');
  var play = document.getElementById('play');
  var apple = document.getElementById('apple');

  // no celular, só a loja daquele celular
  if (ehAndroid) apple.hidden = true;
  if (ehIOS) play.hidden = true;

  if (!ehAndroid && !ehIOS) {
    titulo.textContent = 'Abra este link no celular';
    texto.textContent = 'Toque no link da mensagem no celular em que você usa o app UDIkey.';
    abrir.hidden = true;
    return;
  }

  var destino = ehAndroid
    ? 'intent://#Intent;scheme=udikey;package=com.udikey.app;S.browser_fallback_url=' +
      encodeURIComponent(PLAY) + ';end'
    : 'udikey://';
  abrir.setAttribute('href', destino);

  function mostrarLoja() {
    titulo.textContent = 'O app não abriu?';
    texto.textContent = 'Toque em "Abrir o app". Se ainda não tem o UDIkey, baixe na loja abaixo.';
  }

  var naoAbriu = setTimeout(mostrarLoja, 2200);
  // página escondida = o app abriu; não troca o texto por baixo dele
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) clearTimeout(naoAbriu);
  });
  window.addEventListener('pagehide', function () { clearTimeout(naoAbriu); });

  try {
    location.href = destino;
  } catch (e) {
    clearTimeout(naoAbriu);
    mostrarLoja();
  }
})();
