/* Consentement aux témoins (cookies) — Loi 25 (Québec) / RGPD (UE).
   Carte discrète en bas à gauche, non bloquante. Le choix est mémorisé ~13 mois.
   - GA4 tourne en Consent Mode v2 : signaux anonymes sans témoin tant que le
     visiteur n'a pas accepté (le « default denied » est posé dans chaque page
     avant gtag('js')), puis passe en mode complet à l'acceptation.
   - Le Meta Pixel ne se charge qu'après acceptation, via window.capLoadPixel()
     défini dans chaque page; les événements s'accumulent en file d'attente. */
(function () {
  var KEY = 'cap_consent';
  var MAX_AGE = 1000 * 60 * 60 * 24 * 395; /* ~13 mois */

  function read() {
    try {
      var v = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (v && v.choice && (Date.now() - v.ts) < MAX_AGE) return v.choice;
    } catch (e) {}
    return null;
  }
  function save(choice) {
    try { localStorage.setItem(KEY, JSON.stringify({ choice: choice, ts: Date.now() })); } catch (e) {}
  }
  function grant() {
    if (window.gtag) gtag('consent', 'update', {
      analytics_storage: 'granted', ad_storage: 'granted',
      ad_user_data: 'granted', ad_personalization: 'granted'
    });
    if (window.capLoadPixel) window.capLoadPixel();
  }

  var choice = read();
  if (choice === 'granted') { grant(); return; }
  if (choice === 'denied') { return; }

  /* Langue lue au moment de l'affichage (pas au chargement du script).
     L'attribut lang de la page est le signal le plus frais (toutes les pages
     le posent à chaque bascule), puis cap_lang, puis ?lang= de l'URL. */
  function isFr() {
    var l = (document.documentElement.lang || '').slice(0, 2);
    if (l !== 'en' && l !== 'fr') { try { l = localStorage.getItem('cap_lang'); } catch (e) {} }
    if (l !== 'en' && l !== 'fr') { try { l = new URLSearchParams(location.search).get('lang'); } catch (e) {} }
    return l !== 'en';
  }

  function render(card, fr) {
    card.setAttribute('aria-label', fr ? 'Consentement aux témoins' : 'Cookie consent');
    card.innerHTML = fr
      ? '<p>On utilise des témoins (cookies) pour mesurer ce qui fonctionne et améliorer le site. <a href="/politique-de-confidentialite/">Politique de confidentialité</a></p>' +
        '<div class="row"><button class="ok" type="button">Accepter</button><button class="no" type="button">Refuser</button></div>'
      : '<p>We use cookies to measure what works and improve the site. <a href="/politique-de-confidentialite/">Privacy policy</a></p>' +
        '<div class="row"><button class="ok" type="button">Accept</button><button class="no" type="button">Decline</button></div>';
    card.querySelector('.ok').addEventListener('click', function () { save('granted'); grant(); card.remove(); });
    card.querySelector('.no').addEventListener('click', function () { save('denied'); card.remove(); });
  }

  function show() {
    if (document.getElementById('cap-consent')) return;
    var css = document.createElement('style');
    css.textContent =
      '#cap-consent{position:fixed;left:16px;bottom:16px;z-index:99999;max-width:330px;' +
      'background:#18384E;color:#fff;border:1px solid rgba(255,255,255,.28);border-radius:14px;' +
      'padding:16px 18px;font:13.5px/1.5 -apple-system,"Segoe UI",Roboto,sans-serif;' +
      'box-shadow:0 8px 30px rgba(0,0,0,.35);opacity:0;transform:translateY(12px);' +
      'transition:opacity .4s ease,transform .4s ease;}' +
      '#cap-consent.on{opacity:1;transform:none;}' +
      '#cap-consent p{margin:0 0 12px;}' +
      '#cap-consent a{color:#7ee2b8;text-decoration:underline;text-underline-offset:2px;}' +
      '#cap-consent .row{display:flex;gap:8px;}' +
      '#cap-consent button{flex:1;font:inherit;font-weight:700;border-radius:9px;padding:9px 0;cursor:pointer;}' +
      '#cap-consent .ok{background:#6fae84;border:1px solid #6fae84;color:#0f2331;}' +
      '#cap-consent .no{background:none;border:1px solid rgba(255,255,255,.4);color:#fff;}' +
      '@media (max-width:480px){#cap-consent{left:10px;right:10px;max-width:none;bottom:10px;}}';
    document.head.appendChild(css);

    var card = document.createElement('div');
    card.id = 'cap-consent';
    card.setAttribute('role', 'dialog');
    render(card, isFr());
    document.body.appendChild(card);
    setTimeout(function () { card.classList.add('on'); }, 700);

    /* Si le visiteur change de langue pendant que la carte est visible
       (toutes les pages posent document.documentElement.lang), on suit. */
    try {
      new MutationObserver(function () {
        var c = document.getElementById('cap-consent');
        if (c) render(c, isFr());
      }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
    } catch (e) {}
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', show);
  else show();
})();
