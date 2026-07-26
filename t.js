/* ============================================================
   Rastreamento de acessos da UDIkey (landing).
   Manda evento pro coletor do painel (admin.udikey.com/api/t), que grava em
   trafego_eventos e alimenta a Visão geral e a aba Creators.

   O que é guardado: um id de SESSÃO anônimo (gerado aqui, não identifica
   ninguém), o caminho da página, de qual creator veio (?ref=) e as UTMs.
   NÃO guardamos nome, e-mail, IP nem nada pessoal — e não usamos cookie:
   é localStorage, do próprio site.

   Sem dependência, sem biblioteca de terceiro.
   ============================================================ */
(function () {
  'use strict';

  var COLETOR = 'https://admin.udikey.com/api/t';
  var CHAVE_SESSAO = 'udikey_sid';
  var CHAVE_REF = 'udikey_ref';
  var PING_MS = 60000; // "online agora" no painel usa janela de 5 min

  // Obs.: NÃO checamos "Do Not Track". Aqui não se coleta nada pessoal — sem IP,
  // sem cookie, sem nome/e-mail, sem rastrear a pessoa por outros sites. É só uma
  // contagem anônima de acessos do próprio site, e ela precisa ser fiel: é com
  // esse número que se decide quanto cada influenciador trouxe de gente.

  function guardar(k, v) {
    try {
      localStorage.setItem(k, v);
    } catch (e) {}
  }
  function ler(k) {
    try {
      return localStorage.getItem(k);
    } catch (e) {
      return null;
    }
  }

  // --- id anônimo da sessão (por navegador) ---
  var novo = false;
  var sid = ler(CHAVE_SESSAO);
  if (!sid) {
    novo = true;
    sid =
      Date.now().toString(36) +
      Math.random().toString(36).slice(2, 10) +
      Math.random().toString(36).slice(2, 6);
    guardar(CHAVE_SESSAO, sid);
  }

  // --- de qual creator/campanha veio ---
  var q = new URLSearchParams(location.search);
  var ref = (q.get('ref') || q.get('creator') || '').trim().toLowerCase().slice(0, 40);
  if (ref) {
    // Guarda pra creditar também as próximas páginas que a pessoa abrir.
    guardar(CHAVE_REF, ref);
  } else {
    ref = ler(CHAVE_REF) || '';
  }

  function evento(nome) {
    var corpo = {
      origem: 'landing',
      evento: nome,
      sessao: sid,
      novo: novo && nome === 'view',
      ref: ref || null,
      utm_source: q.get('utm_source'),
      utm_medium: q.get('utm_medium'),
      utm_campaign: q.get('utm_campaign'),
      caminho: location.pathname.slice(0, 120),
      plataforma: 'web',
      referrer: document.referrer ? document.referrer.slice(0, 200) : null,
    };
    var texto = JSON.stringify(corpo);
    try {
      // sendBeacon não segura a navegação (ideal pra clique que sai da página).
      if (navigator.sendBeacon) {
        navigator.sendBeacon(COLETOR, new Blob([texto], { type: 'application/json' }));
        return;
      }
    } catch (e) {}
    try {
      fetch(COLETOR, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: texto,
        keepalive: true,
        mode: 'cors',
      }).catch(function () {});
    } catch (e) {}
  }

  // 1) a visita em si
  evento('view');

  // 2) sinal de vida enquanto a aba está aberta e visível (alimenta o
  //    "online agora" do painel)
  setInterval(function () {
    if (document.visibilityState === 'visible') evento('ping');
  }, PING_MS);

  // 3) clique nos botões de baixar/parceiro — mostra quanto do tráfego de cada
  //    creator realmente foi pro app
  document.addEventListener(
    'click',
    function (ev) {
      var a = ev.target && ev.target.closest ? ev.target.closest('a') : null;
      if (!a) return;
      var href = a.getAttribute('href') || '';
      var txt = (a.textContent || '').toLowerCase();
      if (
        href.indexOf('#baixar') >= 0 ||
        href.indexOf('play.google') >= 0 ||
        href.indexOf('apps.apple') >= 0 ||
        href.indexOf('udikey://') >= 0 ||
        txt.indexOf('baixar') >= 0 ||
        txt.indexOf('parceiro') >= 0
      ) {
        evento('clique_baixar');
      }
    },
    true,
  );
})();
