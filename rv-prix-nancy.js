/* =========================================================
   Bloc "Prix de l'immobilier a Nancy" — Renoir & Valoris
   Integration dans Netty (bloc Widget), une seule ligne :
   <div id="rv-prix"></div><script src="https://cdn.jsdelivr.net/gh/mxcrml/renoir-valoris-widget@main/rv-prix-nancy.js"></script>
   ========================================================= */
(function () {
  "use strict";

  /* ---------- A METTRE A JOUR ---------- */
  var DATE_MAJ = "29/07/2026";
  var ESTIMATION_URL = "/estimez-votre-bien,107";
  var PRIX = {
    tousBiens: 2381,
    appartements: { moyen: 2329, bas: 1491, haut: 3115 },
    maisons: { moyen: 2828, bas: 1408, haut: 4908 }
  };
  /* ------------------------------------- */

  var currentScript = document.currentScript;

  var CSS = "" +
    ".rv-prix{box-sizing:border-box;width:100%;font-family:'Montserrat',Arial,sans-serif;color:#000}" +
    ".rv-prix *{box-sizing:border-box;font-family:inherit}" +
    ".rv-prix__title{margin:0 0 5px;font-size:25.2px;line-height:30.24px;font-weight:400;color:#0c5050}" +
    ".rv-prix__title strong{font-weight:700}" +
    ".rv-prix__caption{margin:0 0 20px;font-size:14px;line-height:21px;color:#5e6363}" +
    ".rv-prix__hero{background:#0c5050;color:#fffcf6;border-radius:6px;padding:30px 20px;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:20px;margin:0 0 20px}" +
    "@media (min-width:680px){.rv-prix__hero{padding:30px 40px}}" +
    ".rv-prix__hero-label{margin:0 0 5px;font-size:14.4px;line-height:21.6px;font-weight:700;color:#fffcf6}" +
    ".rv-prix__hero-value{margin:0;font-size:36px;line-height:43.2px;font-weight:700;color:#fffcf6}" +
    ".rv-prix__hero-unit{font-size:17.28px;line-height:25.92px;font-weight:400}" +
    ".rv-prix__cta{display:inline-block;padding:10px 20px;font-size:14.4px;line-height:21.6px;font-weight:700;color:#000505;background:#f8e800;border-radius:5px;text-decoration:none;transition:filter .15s ease}" +
    ".rv-prix__cta:hover{filter:brightness(.94)}" +
    ".rv-prix__cta:focus-visible{outline:3px solid #0c5050;outline-offset:0}" +
    ".rv-prix__grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:20px}" +
    ".rv-prix__card{background:#ffffff;border:1px solid #dbdbdb;border-radius:6px;padding:20px}" +
    ".rv-prix__card-title{margin:0 0 5px;font-size:19.2px;line-height:28.8px;font-weight:400;color:#0c5050}" +
    ".rv-prix__card-value{margin:0 0 15px;font-size:28.8px;line-height:34.56px;font-weight:700;color:#0c5050}" +
    ".rv-prix__card-unit{font-size:14.4px;line-height:21.6px;font-weight:400;color:#5e6363}" +
    ".rv-prix__row{display:flex;justify-content:space-between;gap:10px;padding:8px 0;border-top:1px solid #dbdbdb;font-size:14.4px;line-height:21.6px}" +
    ".rv-prix__row-label{color:#5e6363}" +
    ".rv-prix__row-val{font-weight:700;color:#000000}" +
    ".rv-prix__note{margin:15px 0 0;font-size:12px;line-height:18px;color:#5e6363}";

  function euros(n) {
    var s;
    try { s = n.toLocaleString("fr-FR"); } catch (err) { s = String(n); }
    return s.replace(/[\u202f\u00a0 ]/g, "\u00a0") + "\u00a0\u20ac";
  }

  function ligne(label, valeur) {
    return '<div class="rv-prix__row"><span class="rv-prix__row-label">' + label + '</span><span class="rv-prix__row-val">' + valeur + '</span></div>';
  }

  function carte(titre, d) {
    return '<div class="rv-prix__card">' +
      '<h3 class="rv-prix__card-title">' + titre + '</h3>' +
      '<p class="rv-prix__card-value">' + euros(d.moyen) + '<span class="rv-prix__card-unit"> / m\u00b2</span></p>' +
      ligne("Prix bas", euros(d.bas)) +
      ligne("Prix haut", euros(d.haut)) +
      '</div>';
  }

  function construireHTML() {
    return '' +
      '<h2 class="rv-prix__title">Prix de l\u2019immobilier au m\u00b2 <strong>\u00e0 Nancy</strong></h2>' +
      '<p class="rv-prix__caption">Donn\u00e9es SeLoger &amp; MeilleursAgents \u00b7 Mise \u00e0 jour le ' + DATE_MAJ + '</p>' +
      '<div class="rv-prix__hero">' +
        '<div>' +
          '<p class="rv-prix__hero-label">Prix moyen au m\u00b2 \u2014 tous types de biens</p>' +
          '<p class="rv-prix__hero-value">' + euros(PRIX.tousBiens) + '<span class="rv-prix__hero-unit"> / m\u00b2</span></p>' +
        '</div>' +
        '<a class="rv-prix__cta" href="' + ESTIMATION_URL + '">Estimez votre bien</a>' +
      '</div>' +
      '<div class="rv-prix__grid">' +
        carte("Appartements", PRIX.appartements) +
        carte("Maisons", PRIX.maisons) +
      '</div>' +
      '<p class="rv-prix__note">Prix indicatifs calcul\u00e9s \u00e0 partir des estimations SeLoger et MeilleursAgents. Ils ne remplacent pas une estimation personnalis\u00e9e de votre bien.</p>';
  }

  function init() {
    var mount = document.getElementById("rv-prix");

    /* Si aucune div n'est fournie, on se cree un point de montage
       a l'emplacement du script */
    if (!mount) {
      mount = document.createElement("div");
      mount.id = "rv-prix";
      if (currentScript && currentScript.parentNode) {
        currentScript.parentNode.insertBefore(mount, currentScript);
      } else {
        document.body.appendChild(mount);
      }
    }

    /* Anti double-initialisation */
    if (mount.getAttribute("data-rv-init") === "1") { return; }
    mount.setAttribute("data-rv-init", "1");
    mount.classList.add("rv-prix");

    /* Styles (une seule fois par page) */
    if (!document.getElementById("rv-prix-style")) {
      var style = document.createElement("style");
      style.id = "rv-prix-style";
      style.textContent = CSS;
      (document.head || document.documentElement).appendChild(style);
    }

    mount.innerHTML = construireHTML();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
