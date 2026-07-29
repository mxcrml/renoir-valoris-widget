/* =========================================================
   Widget "Guide offert" — Renoir & Valoris
   1. Hébergez ce fichier a une URL publique (médiathèque Netty,
      votre propre serveur, GitHub + jsDelivr...)
   2. Dans Netty, bloc Widget, collez une seule ligne :
   <div id="rv-guide"></div><script src="URL_DU_FICHIER_JS"></script>
   ========================================================= */
(function () {
  "use strict";

  var PDF_URL = "https://files.netty.immo/website/renoirvaloris/assets/56f823791785331402.pdf";
  var WEBHOOK_URL = "https://www.datatomic.app/webhook/3b4a990339c7";
  var PDF_FILENAME = "guide-renoir-valoris.pdf";
  var DT_TOKEN = "3b4a990339c7";
  var DT_SRC = "https://l.datatomic.app/js/dt/api/v1/form-fill-mail.js";

  var currentScript = document.currentScript;

  var CSS = "" +
    ".rv-guide{position:relative;box-sizing:border-box;width:100%;background:#0c5050;color:#fffcf6;font-family:'Montserrat',Arial,sans-serif;border-radius:6px;padding:30px 20px}" +
    "@media (min-width:680px){.rv-guide{padding:40px}}" +
    ".rv-guide *{box-sizing:border-box;font-family:inherit}" +
    ".rv-guide__title{margin:0 0 10px;font-size:25.2px;line-height:30.24px;font-weight:400;color:#fffcf6}" +
    ".rv-guide__title strong{font-weight:700}" +
    ".rv-guide__text{margin:0 0 20px;font-size:14.4px;line-height:21.6px}" +
    ".rv-guide__form{display:flex;flex-wrap:wrap;gap:10px}" +
    ".rv-guide__input{flex:1 1 240px;min-width:0;padding:10px 15px;font-size:14.4px;line-height:21.6px;color:#000505;background:#fff;border:1px solid #dbdbdb;border-radius:5px}" +
    ".rv-guide__input::placeholder{color:#5e6363}" +
    ".rv-guide__input:focus{outline:3px solid #f8e800;outline-offset:0;border-color:#f8e800}" +
    ".rv-guide__btn{flex:0 0 auto;padding:10px 20px;font-size:14.4px;line-height:21.6px;font-weight:700;color:#000505;background:#f8e800;border:0;border-radius:5px;cursor:pointer;transition:filter .15s ease}" +
    ".rv-guide__btn:hover{filter:brightness(.94)}" +
    ".rv-guide__btn:focus-visible{outline:3px solid #fffcf6;outline-offset:0}" +
    ".rv-guide__btn:disabled{opacity:.65;cursor:wait}" +
    ".rv-guide__hp{position:absolute;left:-9999px;width:1px;height:1px;opacity:0;pointer-events:none}" +
    ".rv-guide__error{margin:10px 0 0;font-size:14px;line-height:21px;font-weight:700;color:#f8e800}" +
    ".rv-guide__success{margin:0;font-size:17.28px;line-height:25.92px}" +
    ".rv-guide__success a{color:#f8e800;font-weight:700;text-decoration:underline}" +
    ".rv-guide__rgpd{margin:15px 0 0;font-size:12px;line-height:18px;color:rgba(255,252,246,.7)}" +
    ".rv-guide--done .rv-guide__text,.rv-guide--done .rv-guide__form,.rv-guide--done .rv-guide__error,.rv-guide--done .rv-guide__rgpd{display:none}" +
    ".rv-sr-only{position:absolute;width:1px;height:1px;margin:-1px;padding:0;border:0;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}";

  var HTML = [
    '<h3 class="rv-guide__title">T\u00e9l\u00e9chargez votre <strong>guide offert</strong></h3>',
    '<p class="rv-guide__text">Indiquez votre adresse e-mail et recevez imm\u00e9diatement notre guide pour r\u00e9ussir votre projet immobilier.</p>',
    '<form class="rv-guide__form" novalidate>',
    '<label class="rv-sr-only" for="email">Votre adresse e-mail</label>',
    '<input class="rv-guide__input" type="email" id="email" name="email" placeholder="Votre adresse e-mail" autocomplete="email" required>',
    '<input class="rv-guide__hp" type="text" name="rv_site" tabindex="-1" autocomplete="off" aria-hidden="true">',
    '<button class="rv-guide__btn" type="submit">T\u00e9l\u00e9charger le guide</button>',
    '</form>',
    '<p class="rv-guide__error" role="alert" hidden>Veuillez saisir une adresse e-mail valide.</p>',
    '<div aria-live="polite"><p class="rv-guide__success" hidden><strong>Merci&nbsp;!</strong> Le t\u00e9l\u00e9chargement de votre guide d\u00e9marre.<br>Si rien ne se passe, <a href="' + PDF_URL + '" target="_blank" rel="noopener" download="' + PDF_FILENAME + '">cliquez ici pour le t\u00e9l\u00e9charger</a>.</p></div>',
    '<p class="rv-guide__rgpd">En t\u00e9l\u00e9chargeant le guide, vous acceptez de recevoir les communications de Renoir &amp; Valoris. D\u00e9sinscription possible \u00e0 tout moment.</p>'
  ].join("");

  function init() {
    var mount = document.getElementById("rv-guide");

    /* Si aucune div n'est fournie, on se cree un point de montage
       a l'emplacement du script */
    if (!mount) {
      mount = document.createElement("div");
      mount.id = "rv-guide";
      if (currentScript && currentScript.parentNode) {
        currentScript.parentNode.insertBefore(mount, currentScript);
      } else {
        document.body.appendChild(mount);
      }
    }

    /* Anti double-initialisation */
    if (mount.getAttribute("data-rv-init") === "1") { return; }
    mount.setAttribute("data-rv-init", "1");
    mount.classList.add("rv-guide");

    /* Styles (une seule fois par page) */
    if (!document.getElementById("rv-guide-style")) {
      var style = document.createElement("style");
      style.id = "rv-guide-style";
      style.textContent = CSS;
      (document.head || document.documentElement).appendChild(style);
    }

    mount.innerHTML = HTML;

    var form = mount.querySelector("form");
    var input = mount.querySelector('input[name="email"]');
    var honeypot = mount.querySelector('input[name="rv_site"]');
    var button = mount.querySelector('button[type="submit"]');
    var error = mount.querySelector(".rv-guide__error");
    var success = mount.querySelector(".rv-guide__success");

    function telechargerGuide() {
      /* Telechargement direct ; si le navigateur refuse (CORS...),
         ouverture du PDF dans un nouvel onglet */
      fetch(PDF_URL)
        .then(function (r) { if (!r.ok) { throw new Error("HTTP " + r.status); } return r.blob(); })
        .then(function (blob) {
          var url = URL.createObjectURL(blob);
          var a = document.createElement("a");
          a.href = url;
          a.download = PDF_FILENAME;
          document.body.appendChild(a);
          a.click();
          a.remove();
          setTimeout(function () { URL.revokeObjectURL(url); }, 5000);
        })
        .catch(function () { window.open(PDF_URL, "_blank", "noopener"); });
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var email = (input.value || "").trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
        error.hidden = false;
        input.focus();
        return;
      }
      error.hidden = true;

      /* Champ piege rempli = robot : on ne fait rien */
      if (honeypot && honeypot.value) { return; }

      button.disabled = true;
      button.textContent = "Envoi en cours\u2026";

      /* Envoi vers Datatomic : seul "email" est transmis ;
         nom, prenom et livreblanc absents prennent leurs valeurs
         par defaut cote Datatomic (dont la date d'importation) */
      try {
        fetch(WEBHOOK_URL, {
          method: "POST",
          mode: "no-cors",
          body: new URLSearchParams({ email: email })
        }).catch(function () {});
      } catch (err) {}

      mount.classList.add("rv-guide--done");
      success.hidden = false;
      telechargerGuide();
    });

    /* Script Datatomic de pre-remplissage (liens finissant par @),
       ajoute une seule fois par page */
    if (!document.querySelector('script[src*="form-fill-mail"]')) {
      var dt = document.createElement("script");
      dt.src = DT_SRC;
      dt.setAttribute("data-token", DT_TOKEN);
      document.body.appendChild(dt);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
