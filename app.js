/* BROCÉLIANDE — moteur du site V3.6.0 (socle fonctionnel préservé, prototype Parcours) */
(() => {
  'use strict';
  const C = window.UTMB_CONFIG, I18N = window.UTMB_I18N, FLAGS = window.UTMB_FLAGS;
  const $ = (s, r = document) => r.querySelector(s);
  const SEEN_KEY = 'utmb_seen', DOSSARD_KEY = 'utmb_dossard', GATE_KEY = 'utmb_ok', LANG_KEY = 'utmb_lang',
        SCROLL_KEY = 'utmb_scroll', FORMS_KEY = 'utmb_forms', UNLOCK_KEY = 'utmb_unlock',
        MOBILE_STAGE_KEY = 'utmb_mobile_stage_window_v1';
  const NOUVEAU_PERSO_H = 48;                     // durée (heures) du badge « Nouveau » après un déblocage personnel
  let DATA = null, DATA_SIG = '', RAW = null, deferredInstall = null, selectedMapStage = null;
  let chronoTarget = null, chronoTimer = null, slideTimer = null;

  /* ---------- Langue ---------- */
  const LANGS = (C.langues || ['fr']).filter(l => I18N[l]);
  const LANG = (() => {
    const q = (new URLSearchParams(location.search).get('lang') || '').toLowerCase();
    if (LANGS.includes(q)) { localStorage.setItem(LANG_KEY, q); return q; }
    const s = localStorage.getItem(LANG_KEY); if (LANGS.includes(s)) return s;
    const n = (navigator.language || '').slice(0, 2).toLowerCase(); if (LANGS.includes(n)) return n;
    return LANGS[0] || 'fr';
  })();
  let CORRECTIONS = [], CORRECTIONS_SIG = '', corrObserver = null;
  const corrTextState = new WeakMap(), corrAttrState = new WeakMap();
  const CACHE_KEY = 'utmb_data_v1_' + LANG;

  /* Corrections éditables depuis le Sheet — appliquées à TOUT texte visible de la page.
     Le suivi de la valeur source évite les doubles remplacements, même si le DOM est redessiné. */
  const echapperRegExp = s => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  function compilerCorrections(liste) {
    const alpha = 'A-Za-zÀ-ÖØ-öø-ÿ0-9';
    return (Array.isArray(liste) ? liste : [])
      .filter(c => c && String(c.source || '').trim())
      .map(c => {
        const source = String(c.source).trim(), remplacement = String(c.remplacement == null ? '' : c.remplacement);
        const debut = new RegExp('^[' + alpha + ']$').test(source.charAt(0));
        const fin = new RegExp('^[' + alpha + ']$').test(source.charAt(source.length - 1));
        return { source, remplacement, re: new RegExp((debut ? '(^|[^' + alpha + '])' : '()') + '(' + echapperRegExp(source) + ')' + (fin ? '(?=$|[^' + alpha + '])' : ''), 'gi') };
      })
      .sort((a, b) => b.source.length - a.source.length);
  }
  function corrigerTexte(valeur) {
    let out = String(valeur == null ? '' : valeur);
    CORRECTIONS.forEach(c => { out = out.replace(c.re, (_, avant) => (avant || '') + c.remplacement); });
    return out;
  }
  const t = (k, v = {}) => {
    const texte = String((I18N[LANG] && I18N[LANG][k]) ?? I18N.fr[k] ?? k).replace(/\{(\w+)\}/g, (_, x) => v[x] ?? '');
    return k === '_locale' ? texte : corrigerTexte(texte);
  };

  const CORR_ATTRS = ['placeholder', 'title', 'aria-label', 'alt'];
  const ignorerTexte = n => !n.parentElement || !!n.parentElement.closest('script,style,noscript,template');
  function corrigerNoeudTexte(n, force) {
    if (!n || n.nodeType !== Node.TEXT_NODE || ignorerTexte(n)) return;
    const precedent = corrTextState.get(n), courant = n.nodeValue || '';
    const source = precedent && (force || courant === precedent.rendu) ? precedent.source : courant;
    const rendu = corrigerTexte(source);
    corrTextState.set(n, { source, rendu });
    if (courant !== rendu) n.nodeValue = rendu;
  }
  function corrigerAttribut(el, nom, force) {
    if (!el || el.nodeType !== Node.ELEMENT_NODE || !el.hasAttribute(nom)) return;
    let etat = corrAttrState.get(el); if (!etat) { etat = {}; corrAttrState.set(el, etat); }
    const courant = el.getAttribute(nom) || '', precedent = etat[nom];
    const source = precedent && (force || courant === precedent.rendu) ? precedent.source : courant;
    const rendu = corrigerTexte(source); etat[nom] = { source, rendu };
    if (courant !== rendu) el.setAttribute(nom, rendu);
  }
  function appliquerCorrectionsPage(force, racine) {
    const root = racine || document;
    if (root.nodeType === Node.TEXT_NODE) corrigerNoeudTexte(root, force);
    if (root.nodeType === Node.ELEMENT_NODE) CORR_ATTRS.forEach(a => corrigerAttribut(root, a, force));
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let n; while ((n = walker.nextNode())) corrigerNoeudTexte(n, force);
    if (root.querySelectorAll) root.querySelectorAll('*').forEach(el => CORR_ATTRS.forEach(a => corrigerAttribut(el, a, force)));
  }
  function observerCorrections() {
    if (corrObserver) return;
    corrObserver = new MutationObserver(mutations => mutations.forEach(m => {
      if (m.type === 'characterData') corrigerNoeudTexte(m.target, false);
      else if (m.type === 'attributes') corrigerAttribut(m.target, m.attributeName, false);
      else m.addedNodes.forEach(n => appliquerCorrectionsPage(false, n));
    }));
    corrObserver.observe(document.documentElement, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: CORR_ATTRS });
  }
  function activerCorrections(liste) {
    const propres = (Array.isArray(liste) ? liste : []).map(c => ({ source: String(c.source || ''), remplacement: String(c.remplacement == null ? '' : c.remplacement) }));
    const sig = JSON.stringify(propres);
    if (sig !== CORRECTIONS_SIG) { CORRECTIONS_SIG = sig; CORRECTIONS = compilerCorrections(propres); appliquerCorrectionsPage(true); }
    observerCorrections();
  }

  function switchLang(l) {
    if (!LANGS.includes(l) || l === LANG) return;
    localStorage.setItem(LANG_KEY, l);
    sessionStorage.setItem(SCROLL_KEY, String(scrollY));
    const u = new URL(location.href);
    u.searchParams.delete('lang');
    history.replaceState(null, '', u.toString());
    location.reload();
  }
  function applyStaticI18n() {
    document.documentElement.lang = LANG;
    document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll('[data-i18n-ph]').forEach(el => { el.placeholder = t(el.dataset.i18nPh); });
    document.querySelectorAll('[data-i18n-aria]').forEach(el => { el.setAttribute('aria-label', t(el.dataset.i18nAria)); });
    document.querySelectorAll('[data-lang-switch]').forEach(box => {
      box.innerHTML = LANGS.map(l => `<button type="button" data-lang="${l}" aria-pressed="${l === LANG}" title="${I18N[l]._nom}" aria-label="${I18N[l]._nom}">${FLAGS[l] || l.toUpperCase()}</button>`).join('');
      box.addEventListener('click', ev => {
        const b = ev.target.closest('button[data-lang]'); if (!b) return;
        ev.preventDefault(); switchLang(b.dataset.lang);
      });
    });
  }

  /* ---------- Utilitaires ---------- */
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const md = s => esc(s).split(/\n{2,}/).map(p => '<p>' + p
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
      .replace(/\n/g, '<br>') + '</p>').join('');
  const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  const num = v => { const n = parseFloat(String(v ?? '').replace(',', '.')); return isNaN(n) ? null : n; };
  const statut = e => { const s = norm(e.statut); return s.startsWith('nouv') ? 'nouveau' : s.startsWith('ouv') ? 'ouvert' : 'verrouille'; };
  const isOpen = e => statut(e) !== 'verrouille';
  const photos = key => (DATA.photos && DATA.photos[key]) || [];
  const toast = (msg, ms = 4000) => { const el = $('#toast'); el.textContent = msg; el.classList.add('show'); clearTimeout(el._h); el._h = setTimeout(() => el.classList.remove('show'), ms); };
  /* Miniatures Drive : on demande une taille adaptée à l'écran (beaucoup plus léger sur téléphone) */
  const sized = (u, w) => String(u).replace(/sz=w\d+/, 'sz=w' + Math.round(w));
  const ecranW = () => Math.min(2000, Math.round((window.innerWidth || 1000) * Math.min(2, window.devicePixelRatio || 1)));
  const imgTag = (src, alt = '') => `<img src="${esc(sized(src, 700))}" alt="${esc(alt)}" loading="lazy" decoding="async" data-zoom data-full="${esc(src)}">`;
  const fmtNum = n => Number(n).toLocaleString(t('_locale'));

  /* Dates : « 2027-07-24 », « 2027-07-24T15:00 », « 24/07/2027 », « 24/07/2027 15:00 » → heure locale */
  function parseDate(v) {
    if (!v) return null;
    const s = String(v).trim();
    let m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:[ T](\d{1,2})[:h](\d{2}))?$/);
    if (m) return new Date(+m[3], +m[2] - 1, +m[1], +(m[4] || 0), +(m[5] || 0));
    m = s.match(/^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{1,2}):(\d{2}))?/);
    if (m) return new Date(+m[1], +m[2] - 1, +m[3], +(m[4] || 0), +(m[5] || 0));
    const d = new Date(s); return isNaN(d) ? null : d;
  }

  /* ---------- Mémoire de l'appareil : formulaires envoyés ---------- */
  const lireJSON = (k, d) => { try { return JSON.parse(localStorage.getItem(k) || 'null') ?? d; } catch (e) { return d; } };
  const formsFaits = () => lireJSON(FORMS_KEY, {});
  const nouveauJeton = () => (crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2, 12));
  function marquerForm(form, jeton, reponses) {
    const f = formsFaits(); f[form] = { j: jeton, r: reponses || {} }; localStorage.setItem(FORMS_KEY, JSON.stringify(f));
  }
  /* Règle de déblocage (colonne « debloquer_si » de l'onglet Etapes) :
     « presence » = dès que le formulaire Présence est envoyé ; « presence=Oui » = selon une réponse */
  function regleOk(regle) {
    const r = String(regle || '').trim(); if (!r) return true;
    const f = formsFaits(), m = r.match(/^([\w-]+)\s*(!=|=)\s*(.*)$/);
    if (!m) return !!f[norm(r)];
    const vals = m[3].split('|').map(norm);
    for (const k in f) {
      const v = f[k].r && f[k].r[m[1]];
      if (v === undefined) continue;
      const has = Array.isArray(v) ? v.some(x => vals.includes(norm(x))) : vals.includes(norm(v));
      return m[2] === '=' ? has : !has;
    }
    return false;
  }
  const formDeRegle = regle => { const r = String(regle || '').trim(), m = r.match(/^([\w-]+)\s*(!=|=)/); return m ? null : norm(r); };

  /* ---------- Porte d'accès ---------- */
  async function sha256(txt) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(txt.trim().toUpperCase()));
    return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
  }
  async function gate() {
    if (!C.accessCodeHash) return;
    if (localStorage.getItem(GATE_KEY) === C.accessCodeHash) return;
    const urlCode = new URLSearchParams(location.search).get('code');
    if (urlCode && await sha256(urlCode) === C.accessCodeHash) { localStorage.setItem(GATE_KEY, C.accessCodeHash); return; }
    const g = $('#gate'); g.hidden = false; document.body.style.overflow = 'hidden';
    await new Promise(resolve => {
      $('#gateForm').addEventListener('submit', async ev => {
        ev.preventDefault();
        if (await sha256($('#gateInput').value) === C.accessCodeHash) {
          localStorage.setItem(GATE_KEY, C.accessCodeHash); g.hidden = true; document.body.style.overflow = ''; resolve();
        } else { $('#gateError').textContent = t('gate_err'); }
      });
    });
  }

  /* ---------- Données : affichage immédiat depuis le cache, puis mise à jour ---------- */
  function readCache() {
    if (!C.apiUrl) return C.demo;
    try { const c = localStorage.getItem(CACHE_KEY); return c ? JSON.parse(c) : null; } catch (e) { return null; }
  }
  async function fetchData() {
    if (!C.apiUrl) return null;
    const ctrl = 'AbortController' in window ? new AbortController() : null;
    const to = ctrl && setTimeout(() => ctrl.abort(), 20000);
    try {
      const r = await fetch(C.apiUrl + (C.apiUrl.includes('?') ? '&' : '?') + 'lang=' + LANG + '&t=' + Date.now(), ctrl ? { signal: ctrl.signal } : {});
      const txt = await r.text();
      const d = JSON.parse(txt);
      if (!d || !d.etapes) throw new Error('format');
      try { localStorage.setItem(CACHE_KEY, txt); } catch (e) {}
      return d;
    } catch (e) { return null; } finally { if (to) clearTimeout(to); }
  }
  function prepare(d) {
    activerCorrections(d.corrections || []);
    d.parametres = d.parametres || {};
    d.etapes = (d.etapes || []).filter(e => e.titre)
      .map((e, i) => ({ ...e, ordre: Number(e.ordre) || i + 1, lat: num(e.lat) ?? NaN, lng: num(e.lng) ?? NaN }))
      .sort((a, b) => a.ordre - b.ordre);
      d.etapes.forEach((e, i) => { if (!e.id) e.id = 'etape-' + (i + 1); });
      /* Déblocage personnel : section verrouillée tant que la personne n'a pas répondu au formulaire indiqué */
      const unl = lireJSON(UNLOCK_KEY, {}), maintenant = Date.now();
      d.etapes.forEach(e => {
        if (!String(e.debloquer_si || '').trim()) return;
        if (regleOk(e.debloquer_si)) {
          if (!unl[e.id]) unl[e.id] = maintenant;
          e.statut = (maintenant - unl[e.id]) < NOUVEAU_PERSO_H * 3600e3 ? 'nouveau' : 'ouvert';
        } else {
          delete unl[e.id];
          e.statut = 'verrouille';
          if (!String(e.indice || '').trim()) {
            const f = formDeRegle(e.debloquer_si) || 'presence';
            const src = d.etapes.find(x => norm(x.type) === f || norm(x.type) === 'formulaire:' + f);
            e.indice = t('indice_form', { t: src ? src.titre : f });
          }
        }
      });
      try { localStorage.setItem(UNLOCK_KEY, JSON.stringify(unl)); } catch (err) {}

      /* Badge « Nouveau » : une seule étape à la fois.
         - dès qu'une étape plus récente est nouvelle, les précédentes repassent ouvertes ;
         - si le formulaire de l'étape courante a déjà été envoyé et que la suivante reste verrouillée,
           son badge disparaît également (ex. Hébergement renseigné, étape 4 encore bloquée). */
      const nouveaux = d.etapes.filter(e => statut(e) === 'nouveau');
      if (nouveaux.length) {
        const courant = nouveaux[nouveaux.length - 1];
        nouveaux.slice(0, -1).forEach(e => { e.statut = 'ouvert'; });
        const ty = norm(courant.type), form = ty.startsWith('formulaire:') ? norm(ty.split(':')[1])
          : (['presence', 'hebergement'].includes(ty) ? ty : '');
        const idx = d.etapes.indexOf(courant), suivant = d.etapes[idx + 1];
        if (form && formsFaits()[form] && (!suivant || statut(suivant) === 'verrouille')) courant.statut = 'ouvert';
      }
    d.hebergements = d.hebergements || []; d.programme = d.programme || []; d.photos = d.photos || {};
    return d;
  }

  /* ---------- Accueil : compte à rebours + altimètre ---------- */
  const PROFIL = [[0,62],[22,56],[44,59],[68,48],[92,52],[116,41],[140,45],[164,33],[188,37],[212,26],[236,29],[258,17],[280,8],[300,13]];
  function profilY(x) {
    for (let i = 1; i < PROFIL.length; i++) {
      const [x1, y1] = PROFIL[i], [x0, y0] = PROFIL[i - 1];
      if (x <= x1) return y0 + (y1 - y0) * ((x - x0) / (x1 - x0 || 1));
    }
    return PROFIL[PROFIL.length - 1][1];
  }
  function initAltimetre() {
    const d = 'M0,70 ' + PROFIL.map(p => 'L' + p.join(',')).join(' ') + ' L300,70 Z';
    $('#altiBase').setAttribute('d', d); $('#altiFill').setAttribute('d', d);
    $('#altiMax').textContent = t('alti_max', { a: fmtNum(C.altitudeSommet) });
    $('#alti').hidden = false;
  }
  function majAltimetre(target) {
    const start = parseDate(C.departChrono) || new Date();
    const total = target - start, done = Date.now() - start;
    const p = total > 0 ? Math.min(1, Math.max(0, done / total)) : 1;
    const alt = Math.round(C.altitudeDepart + (C.altitudeSommet - C.altitudeDepart) * p);
    const x = Math.max(3, Math.min(297, p * 300));
    $('#altiClipRect').setAttribute('width', (p * 300).toFixed(1));
    $('#altiDot').setAttribute('cx', x.toFixed(1));
    $('#altiDot').setAttribute('cy', profilY(x).toFixed(1));
    $('#altiVal').textContent = fmtNum(alt);
    if (p >= 1) $('#altiMax').textContent = t('alti_top');
  }

  /* Compte à rebours : un seul minuteur, même si l'accueil est redessiné */
  function startChrono(target) {
    if (chronoTarget && +chronoTarget === +target) return;
    chronoTarget = target;
    $('#heroDate').textContent = target.toLocaleDateString(t('_locale'), { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    $('#chrono').hidden = false;
    initAltimetre();
    let last = -1;
    const tick = () => {
      let s = Math.max(0, Math.floor((chronoTarget - Date.now()) / 1000));
      $('#cJ').textContent = Math.floor(s / 86400); s %= 86400;
      $('#cH').textContent = String(Math.floor(s / 3600)).padStart(2, '0'); s %= 3600;
      $('#cM').textContent = String(Math.floor(s / 60)).padStart(2, '0');
      $('#cS').textContent = String(s % 60).padStart(2, '0');
      const minute = Math.floor(Date.now() / 60000);
      if (minute !== last) { last = minute; majAltimetre(chronoTarget); }
    };
    clearInterval(chronoTimer); tick(); chronoTimer = setInterval(tick, 1000);
  }
  /* Accueil minimal, affiché avant même l'arrivée des données */
  function renderHeroInstant() {
    $('#footerVersion').textContent = 'v' + C.version;
    const target = parseDate(C.dateMariage);
    if (target) startChrono(target);
  }

  function renderCoverSettings() {
    const p = DATA.parametres || {}, cfg = C.cover || {};
    const clampZoom = (value, fallback) => {
      const parsed = num(value), base = num(fallback);
      return Math.min(1.35, Math.max(.75, parsed === null ? (base === null ? 1 : base) : parsed));
    };
    const cover = $('#bookCover');
    if (!cover) return;
    cover.style.setProperty('--cover-zoom', clampZoom(p.couverture_zoom, cfg.zoom));
    cover.style.setProperty('--cover-zoom-mobile', clampZoom(p.couverture_zoom_mobile, cfg.zoomMobile ?? cfg.zoom));
    const clampPosition = (value, fallback) => {
      const parsed = num(value), base = num(fallback);
      return Math.min(100, Math.max(0, parsed === null ? (base === null ? 50 : base) : parsed));
    };
    cover.style.setProperty('--cover-title-x', clampPosition(p.couverture_texte_position_h, cfg.titleX) + '%');
    cover.style.setProperty('--cover-title-y', clampPosition(p.couverture_texte_position_v, cfg.titleY) + '%');
    cover.style.setProperty('--cover-title-x-mobile', clampPosition(p.couverture_texte_position_h_mobile, cfg.titleXMobile ?? cfg.titleX) + '%');
    cover.style.setProperty('--cover-title-y-mobile', clampPosition(p.couverture_texte_position_v_mobile, cfg.titleYMobile ?? cfg.titleY) + '%');
  }

  function renderHero() {
    const p = DATA.parametres;
    $('#heroTitre').textContent = p.course_nom || 'BROCÉLIANDE';
    $('#heroSousTitre').textContent = p.sous_titre || '';
    $('#heroPrenoms').textContent = p.prenoms || '';
    $('#heroLieu').textContent = p.lieu || '';
    $('#introMessage').textContent = p.message_accueil || '';
    document.title = `UTMB WEDDING SERIES — ${p.course_nom || 'BROCÉLIANDE'}`;
    $('#footerVersion').textContent = 'v' + C.version;

    const target = parseDate(p.date_mariage) || parseDate(C.dateMariage);
    if (target) {
      startChrono(target);
    }

    const bg = $('#heroBg'), imgs = photos('accueil').slice();
    if (!imgs.length && C.heroFallback) imgs.push(C.heroFallback);
    /* Cadrage de la photo d'accueil (onglet Parametres) : 0 = gauche/haut, 50 = centre, 100 = droite/bas */
    const pc = (v, d) => { const n = num(v); return n === null ? d : Math.min(100, Math.max(0, n)); };
    const px = pc(p.accueil_position_h, 50), py = pc(p.accueil_position_v, 50);
    const zm = Math.min(3, Math.max(1, num(p.accueil_zoom) ?? 1));
    bg.style.setProperty('--px', px + '%'); bg.style.setProperty('--py', py + '%'); bg.style.setProperty('--z', zm);
    bg.style.setProperty('--pxm', pc(p.accueil_position_h_mobile, px) + '%'); bg.style.setProperty('--pym', pc(p.accueil_position_v_mobile, py) + '%');
    clearInterval(slideTimer);
    bg.classList.toggle('empty', !imgs.length);
    /* Photo plein écran (comme avant la V1.5) */
    bg.innerHTML = imgs.map((u, i) =>
      `<div class="slide"><img src="${esc(sized(u, ecranW()))}" alt="" decoding="async"${i ? ' loading="lazy"' : ' fetchpriority="high"'}></div>`).join('');
    const els = bg.querySelectorAll('.slide');
    if (els.length) {
      let k = 0; els[0].classList.add('on');
      if (els.length > 1) slideTimer = setInterval(() => { els[k].classList.remove('on'); k = (k + 1) % els.length; els[k].classList.add('on'); }, 6000);
    }

    const strip = photos('bandeau');
    $('#strip').hidden = !strip.length;
    $('#stripTrack').innerHTML = stripTrack(strip);

      const d = lireJSON(DOSSARD_KEY, null);
      if (d) showDossard(d); else hideDossard();
  }
  /* Bandeau défilant : photos répétées pour toujours remplir la largeur, boucle sans à-coup */
  function stripBase(list) { let b = list.slice(); while (b.length && b.length < 8) b = b.concat(list); return b; }
  function stripTrack(list) { const h = stripBase(list).map(u => imgTag(u)).join(''); return h + h; }
  function stripHtml(list) {
    if (!list.length) return '';
    return `<div class="strip strip-in"><div class="strip-track">${stripTrack(list)}</div></div>`;
  }
  /* Défilement des bandeaux en JavaScript : iOS/Safari fige les animations CSS en % quand les photos
     se chargent après le démarrage. Ici la largeur est mesurée en continu → défilement fiable partout. */
  const STRIP_VITESSE = 32;                                   // pixels par seconde
  const strips = new Map();
  let stripRaf = null, stripLast = 0;
  function initStrips() {
    document.querySelectorAll('.strip-track').forEach(tr => {
      if (strips.has(tr)) return;
      const st = { x: 0, pause: false, half: 0, visible: true };
      const mesure = () => { st.half = tr.scrollWidth / 2; };
      tr.querySelectorAll('img').forEach(im => { if (!im.complete) im.addEventListener('load', mesure, { once: true }); });
      mesure();
      const box = tr.parentElement;
      box.addEventListener('mouseenter', () => { st.pause = true; });
      box.addEventListener('mouseleave', () => { st.pause = false; });
      box.addEventListener('touchstart', () => { st.pause = true; }, { passive: true });
      box.addEventListener('touchend', () => { setTimeout(() => { st.pause = false; }, 1200); }, { passive: true });
      if ('IntersectionObserver' in window) new IntersectionObserver(en => { st.visible = en[0].isIntersecting; }).observe(box);
      strips.set(tr, st);
    });
    strips.forEach((st, tr) => { if (!tr.isConnected) strips.delete(tr); });
    if (!stripRaf && strips.size) { stripLast = performance.now(); stripRaf = requestAnimationFrame(stripTick); }
  }
  function stripTick(now) {
    const dt = Math.min(0.1, (now - stripLast) / 1000); stripLast = now;
    strips.forEach((st, tr) => {
      if (!tr.isConnected) { strips.delete(tr); return; }
      if (st.pause || !st.visible || document.hidden) return;
      if (!st.half) st.half = tr.scrollWidth / 2;
      if (st.half < 10) return;
      st.x -= STRIP_VITESSE * dt;
      if (-st.x >= st.half) st.x += st.half;
      tr.style.transform = `translate3d(${st.x.toFixed(2)}px,0,0)`;
    });
    stripRaf = strips.size ? requestAnimationFrame(stripTick) : null;
  }
  addEventListener('resize', () => strips.forEach((st, tr) => { st.half = tr.scrollWidth / 2; }));

    function hideDossard() { $('#dossard').hidden = true; }
    function showDossard(d) {
      $('#dossard').hidden = false;
    $('#dossardNum').textContent = String(d.num).padStart(3, '0');
    $('#dossardName').textContent = d.nom;
  }

  /* ---------- Installation en appli ---------- */
  function initInstall() {
    const btn = $('#btnInstall');
    const standalone = matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});
    if (standalone) return;
    if (ios) btn.hidden = false;
    addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferredInstall = e; btn.hidden = false; });
    addEventListener('appinstalled', () => { btn.hidden = true; deferredInstall = null; toast(t('installe')); });
    btn.addEventListener('click', async () => {
      if (deferredInstall) {
        deferredInstall.prompt();
        try { const r = await deferredInstall.userChoice; if (r.outcome === 'accepted') btn.hidden = true; } catch (e) {}
        deferredInstall = null;
      } else { $('#iosModal').hidden = false; }
    });
    const closeModal = () => { $('#iosModal').hidden = true; };
    $('#iosClose').addEventListener('click', closeModal);
    $('#iosModal').addEventListener('click', e => { if (e.target.id === 'iosModal') closeModal(); });
  }

  /* ---------- Navigation (pastilles sur mobile) ---------- */
  function renderNav() {
    $('#navLinks').innerHTML = DATA.etapes.map((e, i) => {
      const open = isOpen(e), nv = statut(e) === 'nouveau';
      return `<a href="#${esc(e.id)}" class="${open ? '' : 'locked'}${nv ? ' nouveau' : ''}" title="${esc(e.titre)}" aria-label="${i + 1}. ${esc(e.titre)}${nv ? ' — ' + esc(t('nouveau')) : ''}">` +
        `<span class="nl-num" aria-hidden="true">${open ? i + 1 : '🔒'}</span><span class="nl-txt">${open ? '' : '🔒 '}${esc(e.titre)}</span>` +
        `${nv ? `<span class="badge nl-badge" aria-hidden="true">${esc(t('nouveau'))}</span>` : ''}</a>`;
    }).join('') +
      (hasGalerie() ? `<a href="#galerie" class="nl-gal" title="${esc(t('galerie'))}" aria-label="${esc(t('galerie'))}"><span class="nl-num" aria-hidden="true">📷</span><span class="nl-txt">${esc(t('galerie'))}</span></a>` : '');
  }
  let spy = null;
  function initScrollSpy() {
    if (!('IntersectionObserver' in window)) return;
    if (spy) spy.disconnect();
    const links = [...document.querySelectorAll('#navLinks a')];
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        links.forEach(a => a.classList.toggle('current', a.getAttribute('href') === '#' + en.target.id));
        const a = links.find(l => l.classList.contains('current')), box = $('#navLinks');
        if (a && box.scrollWidth > box.clientWidth) box.scrollTo({ left: a.offsetLeft - box.clientWidth / 2, behavior: 'smooth' });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    spy = io;
    document.querySelectorAll('#programme, #parcours, .stage, #galerie').forEach(s => io.observe(s));
  }

  /* ---------- Progression ---------- */
  const mapStages = () => DATA ? DATA.etapes.slice(0, Math.max(1, Number(C.parchmentMap?.limit) || 5)) : [];
  function renderProgress() {
    const stages = mapStages(), total = stages.length, open = stages.filter(isOpen);
    const last = open[open.length - 1];
    const maxKm = Math.max(...stages.map(e => Number(e.km) || 0), 1);
    const pct = total ? Math.round(((last ? Number(last.km) || 0 : 0) / maxKm) * 100) : 0;
    setTimeout(() => $('#progressFill').style.width = Math.max(pct, open.length ? 6 : 0) + '%', 300);
    $('#progressText').textContent = t('progress', { n: open.length, t: total }) + (last && last.km !== '' ? ` · km ${last.km}` : '');
  }

  /* ---------- Carte parchemin : cinq étapes issues du Sheet ---------- */
  function parchmentPosition(e, i) {
    const fallback = C.parchmentMap?.positions?.[i] || { x: 50, y: 50 };
    const clamp = (v, def) => Math.min(96, Math.max(4, num(v) ?? def));
    return { x: clamp(e.carte_x, fallback.x), y: clamp(e.carte_y, fallback.y) };
  }

  function renderPanel() {
    $('#cpPanel').innerHTML = mapStages().map((e, i) => {
      const st = statut(e);
      return `<button type="button" class="cp ${st === 'verrouille' ? 'locked' : ''}${st === 'nouveau' ? ' is-new' : ''}" data-map-stage="${esc(e.id)}">
        <span class="cp-num">${i + 1}</span>${st === 'nouveau' ? `<span class="badge badge-coin" aria-hidden="true">${esc(t('nouveau'))}</span>` : ''}
        <span><span class="cp-title">${esc(e.titre)} ${st === 'nouveau' ? `<span class="badge badge-inline">${esc(t('nouveau'))}</span>` : ''}</span>
        <span class="cp-meta">${esc(e.cp || '')} · ${esc(e.lieu || '')}${e.km !== '' && e.km != null ? ' · km ' + esc(e.km) : ''}</span></span>
      </button>`;
    }).join('');
    updateMobileStageWindow(true);
  }

  /* Mobile : exactement deux étapes visibles. La fenêtre suit le dernier déblocage,
     sans rejouer le roulement si l'état mémorisé n'a pas progressé. */
  function updateMobileStageWindow(allowAnimation) {
    const panel = $('#cpPanel'); if (!panel || !DATA) return;
    const stages = mapStages(), buttons = [...panel.querySelectorAll('.cp')];
    const mobile = matchMedia('(max-width:600px)').matches;
    const unlocked = stages.reduce((n, e) => n + (isOpen(e) ? 1 : 0), 0);
    const latest = Math.max(0, stages.reduce((last, e, i) => isOpen(e) ? i : last, 0));
    const start = Math.max(0, Math.min(stages.length - 2, latest - 1));
    let previous = null;
    try { previous = JSON.parse(localStorage.getItem(MOBILE_STAGE_KEY) || 'null'); } catch (e) {}
    const previousCount = previous ? Number(previous.count) : NaN;
    const previousStart = previous && Number.isFinite(Number(previous.start)) ? Number(previous.start) : start;
    const progressed = previous && Number.isFinite(previousCount) && unlocked > previousCount;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const animate = mobile && allowAnimation && progressed && !reduced;

    panel.classList.remove('is-rolling');
    panel.style.setProperty('--mobile-stage-start', String(animate ? previousStart : start));
    buttons.forEach((button, i) => {
      const visible = !mobile || (i >= start && i < start + 2);
      if (visible) { button.removeAttribute('aria-hidden'); button.removeAttribute('tabindex'); }
      else { button.setAttribute('aria-hidden', 'true'); button.setAttribute('tabindex', '-1'); }
    });
    if (animate) requestAnimationFrame(() => requestAnimationFrame(() => {
      panel.classList.add('is-rolling');
      panel.style.setProperty('--mobile-stage-start', String(start));
      window.setTimeout(() => panel.classList.remove('is-rolling'), 700);
    }));

    /* Ne jamais faire reculer la mémoire à cause d'un cache plus ancien. */
    if (!previous || !Number.isFinite(previousCount) || unlocked >= previousCount) {
      try { localStorage.setItem(MOBILE_STAGE_KEY, JSON.stringify({ count: unlocked, start, latest: stages[latest]?.id || '' })); } catch (e) {}
    }
  }

  function renderParchmentMap() {
    const stages = mapStages();
    $('#mapMarkers').innerHTML = stages.map((e, i) => {
      const st = statut(e), locked = st === 'verrouille', p = parchmentPosition(e, i);
      return `<button type="button" class="map-pin ${locked ? 'locked' : st}" style="--map-x:${p.x}%;--map-y:${p.y}%" data-map-stage="${esc(e.id)}" aria-label="${i + 1}. ${esc(e.titre)} — ${esc(e.lieu || '')}">
        <span class="map-pin-core" aria-hidden="true">${i + 1}</span>
        <span class="map-pin-label">${esc(e.titre)}</span>
      </button>`;
    }).join('');
    const selected = stages.find(e => e.id === selectedMapStage) || stages[0];
    if (selected) selectStage(selected.id, false, true);
  }

  function renderStageDetail(e) {
    const box = $('#mapStageDetail'); if (!box || !e) return;
    const st = statut(e), locked = st === 'verrouille';
    const meta = [e.cp, e.lieu, e.km !== '' && e.km != null ? `km ${e.km}` : '', e.altitude ? `${e.altitude} m` : ''].filter(Boolean).map(esc).join(' · ');
    box.innerHTML = `<span class="map-detail-status">${locked ? '🔒 ' + esc(t('verrouille')) : esc(t('map_selected'))}</span>
      <h4>${esc(e.titre)}</h4><p class="map-detail-meta">${meta}</p>
      ${e.sous_titre ? `<p>${esc(e.sous_titre)}</p>` : ''}
      ${locked ? `<p class="map-detail-lock">${esc(e.indice || t('bientot'))}</p>` : `<button type="button" class="btn btn-gold map-detail-open" data-map-go="${esc(e.id)}">${esc(t('map_open_stage'))} →</button>`}`;
  }

  function selectStage(id, fly, silent) {
    const e = DATA.etapes.find(x => x.id === id); if (!e) return;
    selectedMapStage = id;
    document.querySelectorAll('[data-map-stage]').forEach(b => b.classList.toggle('active', b.dataset.mapStage === id));
    renderStageDetail(e);
    if (silent) return;
    if (!isOpen(e)) toast(`🔒 ${e.titre} — ${e.indice || t('bientot')}`);
  }

  function announceNew() {
    const seen = JSON.parse(localStorage.getItem(SEEN_KEY) || '[]');
    const fresh = DATA.etapes.filter(e => statut(e) === 'nouveau' && !seen.includes(e.id));
    if (fresh.length) {
      const e = fresh[fresh.length - 1];
      setTimeout(() => toast(t('toast_new', { t: e.titre }), 5000), 1200);
      coachEvent('deblocage', { id: e.id, t: e.titre });
      if (mapStages().some(x => x.id === e.id)) selectStage(e.id, false, true);
    }
    localStorage.setItem(SEEN_KEY, JSON.stringify(DATA.etapes.filter(isOpen).map(e => e.id)));
  }
  /* ---------- Sections ---------- */
  function photosHtml(key) { const p = photos(key); return p.length ? `<div class="stage-photos">${p.map(u => imgTag(u)).join('')}</div>` : ''; }
  function linkHtml(e) { return e.lien_url ? `<p><a class="btn btn-ghost" href="${esc(e.lien_url)}" target="_blank" rel="noopener">${esc(e.lien_libelle || t('en_savoir'))} →</a></p>` : ''; }
  const formOff = () => C.apiUrl ? '' : `<p class="form-off">${esc(t('demo'))}</p>`;

  /* ---------- Formulaires dynamiques (onglet « Questions » du Sheet) ---------- */
  const DEMI = ['texte', 'email', 'telephone', 'nombre', 'date', 'liste'];
  const formulaires = () => (DATA.formulaires && Object.keys(DATA.formulaires).length) ? DATA.formulaires : (C.demo.formulaires || {});
  const vide = v => v == null || (Array.isArray(v) ? v.length === 0 : String(v).trim() === '');
  const choixMultiple = q => q.type === 'cases' || (q.type === 'pastilles' && norm(q.mode_selection) === 'multiple');

  /* « presence=Oui », « presence!=Non », « besoin=A|B » */
  function condOk(si, rep) {
    if (!si) return true;
    const m = String(si).match(/^\s*([\w-]+)\s*(!=|=)\s*(.*)$/);
    if (!m) return true;
    const vals = m[3].split('|').map(s => norm(s)), v = rep[m[1]];
    const has = Array.isArray(v) ? v.some(x => vals.includes(norm(x))) : vals.includes(norm(v));
    return m[2] === '=' ? has : !has;
  }

  function champHtml(q, form) {
    const id = `f-${form}-${q.id}`, req = q.obligatoire ? ' <span class="req" aria-hidden="true">*</span>' : '';
    const nm = esc(q.id), ph = q.aide ? ` placeholder="${esc(q.aide)}"` : '', rq = q.obligatoire ? ' aria-required="true"' : '';
    const def = q.defaut != null && q.defaut !== '' ? String(q.defaut) : '';
    const lab = `<label for="${id}">${esc(q.question)}${req}</label>`;
    const opts = q.options || [];
    let inner;
    switch (q.type) {
      case 'texte_long': inner = lab + `<textarea id="${id}" name="${nm}" maxlength="1000"${ph}${rq}>${esc(def)}</textarea>`; break;
      case 'email': inner = lab + `<input id="${id}" name="${nm}" type="email" maxlength="120" autocomplete="email" value="${esc(def)}"${ph}${rq}>`; break;
      case 'telephone': inner = lab + `<input id="${id}" name="${nm}" type="tel" maxlength="30" autocomplete="tel" value="${esc(def)}"${ph}${rq}>`; break;
      case 'nombre': inner = lab + `<input id="${id}" name="${nm}" type="number" inputmode="numeric" min="${q.min}" max="${q.max}" step="1" value="${esc(def)}"${ph}${rq}>`; break;
      case 'date': inner = lab + `<input id="${id}" name="${nm}" type="date" value="${esc(def)}"${rq}>`; break;
      case 'liste': inner = lab + `<select id="${id}" name="${nm}"${rq}><option value="">${esc(t('choisir'))}</option>` +
        opts.map(o => `<option value="${esc(o.v)}"${norm(o.v) === norm(def) ? ' selected' : ''}>${esc(o.l)}</option>`).join('') + '</select>'; break;
      case 'choix': case 'ouinon': case 'cases': case 'pastilles': {
        const multi = choixMultiple(q), pastilles = q.type === 'pastilles';
        const list = q.type === 'ouinon' && !opts.length ? [{ v: 'Oui', l: t('oui') }, { v: 'Non', l: t('non') }] : opts;
        const defs = def.split(';').map(norm);
        inner = `<fieldset class="choice-set${pastilles ? ' pills-set' : ''}"><legend>${esc(q.question)}${req}</legend>${q.aide ? `<p class="q-aide">${esc(q.aide)}</p>` : ''}<div class="choice${pastilles ? ` pills pills-${multi ? 'multi' : 'single'}` : ''}"${pastilles && !multi ? ' role="radiogroup"' : ''}>` +
          list.map(o => `<label><input type="${multi ? 'checkbox' : 'radio'}" name="${nm}" value="${esc(o.v)}"${defs.includes(norm(o.v)) && def ? ' checked' : ''}${rq}><span class="opt">${esc(o.l)}</span></label>`).join('') +
          '</div></fieldset>';
        break;
      }
      default: inner = lab + `<input id="${id}" name="${nm}" type="text" maxlength="200" value="${esc(def)}"${ph}${rq}>`;
    }
    return `<div class="q" data-q="${nm}" data-type="${esc(q.type)}"${q.si ? ` data-si="${esc(q.si)}"` : ''}>${inner}</div>`;
  }

  function formHtml(form) {
    const qs = formulaires()[form] || [];
    if (!qs.length) return '';
    const lim = DATA.parametres.date_limite_reponse;
    const intro = form === 'presence' && lim && !String(lim).includes('[') ? `<div class="form-deadline" role="note">
      <span class="form-deadline-icon" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false" aria-hidden="true" fill="none" stroke="#d8c3a5" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3v4M17 3v4M4 9h16M5.5 5h13A1.5 1.5 0 0 1 20 6.5v12a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5v-12A1.5 1.5 0 0 1 5.5 5Z"/></svg></span><span class="form-deadline-text">
      <span class="form-deadline-label">${esc(t('deadline_label'))}</span><strong class="form-deadline-date">${esc(t('deadline_date', { d: lim }))}</strong></span></div>` : '';
    return `<form class="form" data-type="${esc(form)}" novalidate>${intro}
      <div class="form-grid">${qs.map(q => champHtml(q, form)).join('')}</div>
      <p class="form-legende"><span class="req">*</span> ${esc(t('requis'))}</p>
      <input class="hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
      <button class="btn btn-gold" type="submit">${esc(t(form === 'presence' ? 'f_valider' : 'f_envoyer'))}</button>
      <p class="form-msg" aria-live="polite"></p>${formOff()}
    </form>`;
  }

  function lireReponses(f) {
    const fd = new FormData(f), qs = formulaires()[f.dataset.type] || [], rep = {};
    qs.forEach(q => { rep[q.id] = choixMultiple(q) ? fd.getAll(q.id) : (fd.get(q.id) ?? ''); });
    return rep;
  }

  /* Affiche / masque les questions conditionnelles + mise en page 2 colonnes */
  function majConditions(f) {
    const rep = lireReponses(f);
    let run = [];
    const flush = () => { run.forEach((el, i) => el.classList.toggle('q-pleine', run.length % 2 === 1 && i === run.length - 1)); run = []; };
    f.querySelectorAll('.q').forEach(el => {
      const ok = condOk(el.dataset.si, rep);
      el.hidden = !ok;
      el.querySelectorAll('input,select,textarea').forEach(i => { i.disabled = !ok; });
      if (!ok) return;
      if (DEMI.includes(el.dataset.type)) { el.classList.remove('q-pleine'); run.push(el); }
      else { el.classList.add('q-pleine'); flush(); }
    });
    flush();
  }
  function initForms() {
    document.querySelectorAll('form.form').forEach(f => {
      majConditions(f);
      f.addEventListener('change', () => majConditions(f));
      f.addEventListener('input', ev => { ev.target.closest('.q')?.classList.remove('q-err'); });
      f.addEventListener('submit', submitForm);
    });
  }

  function hebergementsHtml() {
    const h = DATA.hebergements.filter(x => x.nom && norm(x.visible) !== 'non');
    if (!h.length) return '';
    return `<div class="rows">${h.map(x => `<article class="row">
      <div class="row-id">${x.type ? `<span class="tag">${esc(x.type)}</span>` : ''}<h3>${esc(x.nom)}</h3>
        ${[x.distance, x.prix].filter(Boolean).length ? `<span class="meta">${[x.distance, x.prix].filter(Boolean).map(esc).join(' · ')}</span>` : ''}</div>
      <p class="row-desc">${x.description ? esc(x.description) : ''}</p>
      ${x.lien ? `<a class="row-lien" href="${esc(x.lien)}" target="_blank" rel="noopener">${esc(t('voir_reserver'))}</a>` : '<span></span>'}
    </article>`).join('')}</div>`;
  }
  function programmeData() {
    const sheet = (DATA.programme || []).filter(x => x && x.titre && !String(x.titre).includes('[à compléter]'));
    if (sheet.length) return sheet;
    return (I18N[LANG] && I18N[LANG].programme_items) || I18N.fr.programme_items || [];
  }
  function programmeEntryHtml(x, i) {
    const time = x.heure ? `<span class="programme-time">${esc(x.heure)}</span>` : '';
    return `<article class="programme-entry" style="--programme-order:${i}">${time}<h3>${esc(x.titre)}</h3>${x.lieu ? `<p class="programme-place">⌖ ${esc(x.lieu)}</p>` : ''}<div class="programme-description">${md(x.description || '')}</div></article>`;
  }
  function renderProgrammeIntro() {
    const list = programmeData(), split = Math.ceil(list.length / 2);
    $('#programmeCol1').innerHTML = list.slice(0, split).map((x, i) => programmeEntryHtml(x, i)).join('');
    $('#programmeCol2').innerHTML = list.slice(split).map((x, i) => programmeEntryHtml(x, i + split)).join('');
  }
  function renderMemoryRibbon() {
    const own = photos('bandeau');
    const box = $('#souvenirs');
    if (!box) return;
    box.hidden = !own.length;
    $('#memoryRibbonTrack').innerHTML = own.length ? stripTrack(own) : '';
  }

  function programmeHtml() {
    const p = DATA.programme.filter(x => x.titre);
    if (!p.length) return '';
    return `<ol class="timeline">${p.map(x => `<li><div class="tl-time">${esc(x.heure)}</div>
      <div class="tl-title">${esc(x.titre)}</div>${x.lieu ? `<div class="tl-place">📍 ${esc(x.lieu)}</div>` : ''}
      ${x.description ? `<div>${esc(x.description)}</div>` : ''}</li>`).join('')}</ol>`;
  }

  const pageArrowHtml = (direction, target, label) => `<a href="#${esc(target)}" class="book-arrow book-arrow-${direction}" aria-label="${esc(label)}"><span aria-hidden="true">${direction === 'prev' ? '←' : '→'}</span></a>`;
  function stagePageNav(i) {
    const prev = i === 0 ? 'parcours' : DATA.etapes[i - 1].id;
    const next = i < DATA.etapes.length - 1 ? DATA.etapes[i + 1].id : (hasGalerie() ? 'galerie' : 'footer');
    return `<nav class="book-page-nav stage-page-nav" aria-label="${esc(t('nav_prev'))} / ${esc(t('nav_next'))}">${pageArrowHtml('prev', prev, t('nav_prev'))}${pageArrowHtml('next', next, t('nav_next'))}</nav>`;
  }

  function renderSections() {
    $('#sections').innerHTML = DATA.etapes.map((e, i) => {
      const st = statut(e), locked = st === 'verrouille';
      let body;
      if (locked) {
        body = `<div><div class="lock-ico">🔒</div><strong>${esc(t('verrouille'))}</strong><br>${esc(e.indice || t('bientot'))}</div>`;
      } else {
        body = md(e.contenu || '');
        const ty = norm(e.type);
        if (ty === 'presence') body += formHtml('presence');
        if (ty === 'hebergement') body += hebergementsHtml() + stripHtml(photos('hebergement')) + formHtml('hebergement');
        if (ty.startsWith('formulaire')) body += formHtml(ty.split(':')[1]?.trim() || '');
        if (ty === 'plan') body += photosHtml('plan');
        if (ty === 'programme') body += programmeHtml();
        body += photosHtml(e.id) + linkHtml(e);
      }
      return `<section class="stage ${locked ? 'locked' : ''}${st === 'nouveau' ? ' is-new' : ''}" id="${esc(e.id)}">
        <div class="stage-head">
          <div class="stage-num">${locked ? '🔒' : i + 1}</div>
          <div><div class="stage-cp">${esc(e.cp || '')}${e.lieu ? ' · ' + esc(e.lieu) : ''}${e.km !== '' && e.km != null ? ' · km ' + esc(e.km) : ''}${e.altitude ? ' · ' + esc(e.altitude) + ' m' : ''}</div>
            <h2>${esc(e.titre)}</h2>${e.sous_titre ? `<p class="stage-sub">${esc(e.sous_titre)}</p>` : ''}</div>
          ${st === 'nouveau' ? `<span class="badge badge-coin" aria-hidden="true">${esc(t('nouveau'))}</span>` : ''}
        </div>
        ${st === 'nouveau' ? `<span class="badge stage-new badge-inline">${esc(t('nouveau'))}</span>` : ''}
        <div class="stage-body">${body}</div>
        ${stagePageNav(i)}
      </section>`;
    }).join('');
    initForms();
  }

  function hasGalerie() { return photos('galerie').length > 0; }
  function renderGalerie() {
    if (!hasGalerie()) return;
    $('#galerie').hidden = false;
    $('#galerieGrid').innerHTML = photos('galerie').map(u => imgTag(u)).join('');
    if (!$('#galerie .book-page-nav')) $('#galerie').insertAdjacentHTML('beforeend', `<nav class="book-page-nav stage-page-nav" aria-label="${esc(t('nav_prev'))} / ${esc(t('nav_next'))}">${pageArrowHtml('prev', DATA.etapes[DATA.etapes.length - 1]?.id || 'parcours', t('nav_prev'))}${pageArrowHtml('next', 'footer', t('nav_next'))}</nav>`);
  }

  /* ---------- Envoi des formulaires ---------- */
  async function submitForm(ev) {
    ev.preventDefault();
    const f = ev.currentTarget, msg = f.querySelector('.form-msg'), btn = f.querySelector('button[type=submit]');
    const form = f.dataset.type, qs = formulaires()[form] || [];
    const label = btn.textContent;
    msg.className = 'form-msg';
    f.querySelectorAll('.q-err').forEach(el => el.classList.remove('q-err'));
    const rep = lireReponses(f), envoi = {};
    const err = (txt, q) => {
      msg.textContent = txt; msg.classList.add('err');
      const el = q && f.querySelector(`.q[data-q="${CSS.escape(q.id)}"]`);
      if (el) { el.classList.add('q-err'); el.querySelector('input,select,textarea')?.focus(); }
    };
    for (const q of qs) {
      if (!condOk(q.si, rep)) continue;               // question masquée : ignorée
      let v = rep[q.id];
      if (q.obligatoire && vide(v)) return err(t('e_requis', { q: q.question }), q);
      if (vide(v)) { envoi[q.id] = choixMultiple(q) ? [] : ''; continue; }
      if (q.type === 'email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) return err(t('e_email'), q);
      if (q.type === 'nombre') {
        const n = Number(v);
        if (!Number.isFinite(n) || n < q.min || n > q.max) return err(t('e_nombre', { q: q.question, min: q.min, max: q.max }), q);
        v = Math.round(n);
      }
      envoi[q.id] = v;
    }
    if (!C.apiUrl) return err(t('e_demo'));
    btn.disabled = true; btn.textContent = t('envoi');
    try {
        const deja = formsFaits()[form];
        const jeton = deja && deja.j && !String(deja.j).startsWith('d:') ? deja.j : nouveauJeton();   // même appareil = même jeton
        const body = { type: form, langue: LANG, jeton, website: new FormData(f).get('website') || '', reponses: envoi };
      const r = await fetch(C.apiUrl, { method: 'POST', body: JSON.stringify(body) });
      const res = await r.json();
      if (!res.ok) throw new Error(res.error || 'Erreur');
        f.reset(); majConditions(f);
        /* Mémoire de l'appareil : réponses courtes (choix) pour les déblocages conditionnels */
        const courtes = {};
        qs.forEach(q => { if (['choix', 'ouinon', 'liste', 'cases', 'pastilles'].includes(q.type) && envoi[q.id] !== undefined) courtes[q.id] = envoi[q.id]; });
        marquerForm(form, jeton, courtes);
        let texte;
        if (form === 'presence' && res.dossard) {
          const d = { num: res.dossard, nom: String(envoi.nom || '').trim(), j: jeton };
          localStorage.setItem(DOSSARD_KEY, JSON.stringify(d)); showDossard(d);
          texte = t('ok_dossard', { n: String(res.dossard).padStart(3, '0') });
          toast(t('toast_dossard'), 5000);
          coachEvent('dossard', { n: res.dossard });
        } else {
          if (form === 'presence') { localStorage.removeItem(DOSSARD_KEY); hideDossard(); }   // réponse « Non » : pas de dossard
          texte = form === 'hebergement' ? t('ok') + ' ' + t('ok_matos') : t('ok');
          if (form === 'hebergement') coachEvent('matos');
        }
        msg.textContent = texte; msg.classList.add('ok');
        /* Une section dépend de ce formulaire ? On la débloque tout de suite */
        if (RAW && rerenderSiDeblocage()) {
          const nf = document.querySelector(`form.form[data-type="${CSS.escape(form)}"] .form-msg`);
          if (nf) { nf.textContent = texte; nf.className = 'form-msg ok'; }
        }
    } catch (e) {
      err(String(e.message || '').startsWith('requis:') ? t('e_requis', { q: e.message.slice(7) }) : t('e_envoi'));
    } finally { btn.disabled = false; btn.textContent = label; }
  }

  /* ---------- Visionneuse : flèches, clavier, glisser du doigt ---------- */
  let lbList = [], lbIdx = 0;
  function lbShow(i) {
    if (!lbList.length) return;
    lbIdx = (i + lbList.length) % lbList.length;
    $('#lbImg').src = sized(lbList[lbIdx], 2400);
    const multi = lbList.length > 1;
    $('#lbPrev').hidden = !multi; $('#lbNext').hidden = !multi;
    $('#lbCount').textContent = multi ? `${lbIdx + 1} / ${lbList.length}` : '';
    if (multi) [lbIdx - 1, lbIdx + 1].forEach(k => { const im = new Image(); im.src = sized(lbList[(k + lbList.length) % lbList.length], 2400); });
  }
  function initLightbox() {
    document.addEventListener('click', e => {
      const img = e.target.closest('img[data-zoom]'); if (!img) return;
      const zone = img.closest('.strip-track, .stage-photos, .grid') || img.parentElement;
      const full = el => el.dataset.full || el.src;
      lbList = [...new Set([...zone.querySelectorAll('img[data-zoom]')].map(full))];   // bandeaux : photos dédoublonnées
      $('#lightbox').hidden = false; document.body.style.overflow = 'hidden';
      lbShow(Math.max(0, lbList.indexOf(full(img))));
    });
    const closeLb = () => { $('#lightbox').hidden = true; $('#lbImg').src = ''; document.body.style.overflow = ''; };
    $('#lbClose').addEventListener('click', closeLb);
    $('#lbPrev').addEventListener('click', ev => { ev.stopPropagation(); lbShow(lbIdx - 1); });
    $('#lbNext').addEventListener('click', ev => { ev.stopPropagation(); lbShow(lbIdx + 1); });
    $('#lightbox').addEventListener('click', e => { if (e.target.id === 'lightbox') closeLb(); });
    addEventListener('keydown', e => {
      if (e.key === 'Escape') { if (!$('#lightbox').hidden) closeLb(); $('#iosModal').hidden = true; }
      if ($('#lightbox').hidden) return;
      if (e.key === 'ArrowLeft') lbShow(lbIdx - 1);
      if (e.key === 'ArrowRight') lbShow(lbIdx + 1);
    });
    let x0 = null, y0 = null;
    $('#lightbox').addEventListener('touchstart', e => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
    $('#lightbox').addEventListener('touchend', e => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0; x0 = null;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) lbShow(lbIdx + (dx < 0 ? 1 : -1));
    }, { passive: true });
  }

  /* ---------- Navigation interne sans « #ancre » dans l'adresse ---------- */
  function goTo(id) {
    if (id === 'bookCover') { window.BroceliandeCover?.reopen(); return; }
    if (id === 'top') return scrollTo({ top: 0, behavior: 'smooth' });
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }
  function initAnchors() {
    document.addEventListener('click', ev => {
      const coverButton = ev.target.closest('[data-book-cover]');
      if (coverButton) { ev.preventDefault(); window.BroceliandeCover?.reopen(); return; }
      const a = ev.target.closest('a[href^="#"]'); if (!a) return;
      const id = a.getAttribute('href').slice(1); if (!id) return;
      ev.preventDefault(); goTo(id);
    });
  }

  /* ---------- Rendu complet (rejouable sans doublon) ---------- */
  const formulaireEnCours = () => [...document.querySelectorAll('form.form')].some(f =>
    [...f.elements].some(el => (el.type === 'radio' || el.type === 'checkbox') ? el.checked !== el.defaultChecked
      : (el.name && el.name !== 'website' && 'defaultValue' in el && el.value !== el.defaultValue)));
    function renderAll(d, maj, force) {
      const sig = JSON.stringify(d);
      if (sig === DATA_SIG && !force) return false;
      if (maj && formulaireEnCours()) return false;    // l'invité remplit un formulaire : on ne touche à rien
      RAW = d; DATA_SIG = sig; DATA = prepare(JSON.parse(sig));
    renderCoverSettings(); renderHero(); renderProgrammeIntro(); renderMemoryRibbon(); renderNav(); renderProgress(); renderPanel(); renderParchmentMap(); renderSections(); renderGalerie(); initScrollSpy(); initStrips();
    appliquerCorrectionsPage(false);
    document.body.classList.remove('chargement');
    return true;
  }

    /* Re-calcule les déblocages personnels ; re-dessine seulement si quelque chose change */
    function rerenderSiDeblocage() {
      const avant = DATA.etapes.map(e => e.id + ':' + statut(e)).join('|');
      const apres = prepare(JSON.parse(JSON.stringify(RAW))).etapes.map(e => e.id + ':' + statut(e)).join('|');
      if (avant === apres) return false;
      renderAll(RAW, false, true);
      setTimeout(announceNew, 1800);
      return true;
    }

    /* Vérifie auprès du Sheet que les réponses mémorisées sur l'appareil existent encore
       (réponses effacées dans le Sheet → dossard et déblocages retirés de l'appareil) */
    async function verifierMemoire() {
      if (!C.apiUrl) return;
      const f = formsFaits(), dos = lireJSON(DOSSARD_KEY, null), q = {};
      Object.keys(f).forEach(k => { if (f[k] && f[k].j) q[k] = f[k].j; });
      if (dos && !q.presence) q.presence = dos.j || ('d:' + dos.num + ':' + (dos.nom || ''));   // dossard d'avant la V1.9
      if (!Object.keys(q).length) return;
      try {
        const r = await fetch(C.apiUrl + (C.apiUrl.includes('?') ? '&' : '?') + 'action=verif&j=' + encodeURIComponent(JSON.stringify(q)) + '&t=' + Date.now());
        const res = await r.json();
        if (!res || res.ok !== true || !res.forms) return;          // pas de réponse fiable : on ne touche à rien
        const ff = formsFaits();
        Object.keys(q).forEach(k => {
          if (res.forms[k] === false) delete ff[k];
          else if (res.forms[k] === true && !ff[k]) ff[k] = { j: q[k], r: k === 'presence' ? { presence: 'Oui' } : {} };
        });
        localStorage.setItem(FORMS_KEY, JSON.stringify(ff));
        if (res.dossard && res.dossard.num) {
          const d = { num: res.dossard.num, nom: res.dossard.nom || (dos && dos.nom) || '', j: ff.presence && ff.presence.j };
          localStorage.setItem(DOSSARD_KEY, JSON.stringify(d)); showDossard(d);
        } else { localStorage.removeItem(DOSSARD_KEY); hideDossard(); }
        if (RAW) rerenderSiDeblocage();
      } catch (e) {}
    }

    /* ---------- Démarrage ---------- */
  /* ---------- Coach la marmotte : AUCUN fichier Coach chargé au démarrage ----------
     Le module (assets/coach/coach.js + coach.webp, ~85 Ko au total) n'est téléchargé qu'au moment
     de la 1re apparition (25-50 s après l'ouverture, navigateur au repos) ou après une action de l'invité. */
  const T0 = performance.now();
  let coachProm = null, coachPlanifie = false, coachPending = null;
  function coachCfg() {
    const p = (DATA && DATA.parametres) || {}, d = C.coach || {};
    const v = (k, def) => { const n = num(p['coach_' + k]); return n === null ? def : n; };
    const b = (k, def) => { const x = norm(p['coach_' + k]); return x ? ['oui', '1', 'true', 'vrai', 'yes', 'si'].includes(x) : def; };
    return { active: b('active', d.active !== false), mobile: b('mobile', d.mobile !== false), evenements: b('evenements', d.evenements !== false),
      delaiMin: v('delai_min', d.delaiMin ?? 25), delaiMax: v('delai_max', d.delaiMax ?? 50),
      intervalleMin: v('intervalle_min', d.intervalleMin ?? 120), intervalleMax: v('intervalle_max', d.intervalleMax ?? 300),
      maxVisite: v('max_visite', d.maxVisite ?? 3), taillePc: v('taille_pc', d.taillePc ?? 230), tailleMobile: v('taille_mobile', d.tailleMobile ?? 160) };
  }
  const coachParam = () => new URLSearchParams(location.search).get('coach');
  const coachOff = () => localStorage.getItem('utmb_coach_off') === '1';
  function coachPossible(cfg) {
    if (!cfg.active || coachOff() || coachParam() === '0') return false;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    if (!cfg.mobile && matchMedia('(max-width:820px)').matches) return false;
    return true;
  }
  function chargerCoach() {
    if (coachProm) return coachProm;
    coachProm = new Promise((ok, ko) => {
      const s = document.createElement('script'); s.src = 'assets/coach/coach.js?v=' + C.version; s.async = true;
      s.onload = () => {
        if (!window.UTMB_COACH) return ko();
        window.UTMB_COACH.init({ lang: LANG, cfg: coachCfg(), goTo, onToggle: majCoachToggle });
        ok(window.UTMB_COACH);
      };
      s.onerror = () => { coachProm = null; ko(); };
      document.head.appendChild(s);
    });
    return coachProm;
  }
  const auRepos = fn => ('requestIdleCallback' in window) ? requestIdleCallback(fn, { timeout: 4000 }) : setTimeout(fn, 300);
  const alea = (a, b) => (a + Math.random() * Math.max(0, b - a)) * 1000;
  function planifierCoach() {
    majCoachToggle();
    if (coachParam() === 'demo') {                       // contrôle qualité : les 7 animations à la suite
      setTimeout(() => chargerCoach().then(m => m.demo()).catch(() => {}), 3000);
      return;
    }
    if (coachPlanifie) return;
    const cfg = coachCfg();
    if (!coachPossible(cfg)) return;
    coachPlanifie = true;
    setTimeout(() => auRepos(() => chargerCoach().then(m => {
      if (coachPending) { const p = coachPending; coachPending = null; m.evenement(p.type, p.info); m.start(alea(cfg.intervalleMin, cfg.intervalleMax) / 1000); }
      else m.start();
    }).catch(() => {})), alea(cfg.delaiMin, cfg.delaiMax));
  }
  function coachEvent(type, info) {
    const cfg = coachCfg();
    if (!coachPossible(cfg) || !cfg.evenements) return;
    const age = performance.now() - T0;
    /* Pendant les 15 premières secondes : l'événement attend la 1re apparition programmée (aucun chargement au démarrage) */
    if (age < 15000 && !coachProm) { coachPending = { type, info }; return; }
    auRepos(() => chargerCoach().then(m => m.evenement(type, info)).catch(() => {}));
  }
  function majCoachToggle() {
    const btn = $('#coachToggle'); if (!btn) return;
    const cfg = coachCfg();
    btn.hidden = !cfg.active || matchMedia('(prefers-reduced-motion: reduce)').matches;
    btn.textContent = t(coachOff() ? 'coach_on' : 'coach_off');
  }
  function initCoachToggle() {
    const btn = $('#coachToggle'); if (!btn) return;
    btn.addEventListener('click', () => {
      if (coachOff()) {
        localStorage.removeItem('utmb_coach_off'); majCoachToggle();
        chargerCoach().then(m => m.coucou()).catch(() => {});
        coachPlanifie = false; planifierCoach();
      } else {
        localStorage.setItem('utmb_coach_off', '1'); majCoachToggle();
        if (window.UTMB_COACH) window.UTMB_COACH.masquer();
      }
    });
  }

  async function start() {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    const y = sessionStorage.getItem(SCROLL_KEY);
    if (y === null) {                                 // lancement normal : toujours sur l'accueil
      if (location.hash) history.replaceState(null, '', location.pathname + location.search);
      scrollTo(0, 0);
    }
    applyStaticI18n();
    renderHeroInstant();                              // titres + compte à rebours tout de suite
    initInstall(); initLightbox(); initAnchors(); initCoachToggle();
    const mobileQuery = matchMedia('(max-width:600px)');
    const refreshMobileStageWindow = () => updateMobileStageWindow(false);
    if (mobileQuery.addEventListener) mobileQuery.addEventListener('change', refreshMobileStageWindow);
    else if (mobileQuery.addListener) mobileQuery.addListener(refreshMobileStageWindow);
    const nav = $('#nav'), upd = () => nav.classList.toggle('scrolled', scrollY > 60);
    addEventListener('scroll', upd, { passive: true }); upd();
    $('#parcours').addEventListener('click', ev => {
      const stage = ev.target.closest('[data-map-stage]');
      if (stage) return selectStage(stage.dataset.mapStage, false);
      const open = ev.target.closest('[data-map-go]');
      if (open) goTo(open.dataset.mapGo);
    });

    const cache = readCache();                         // permet aussi de corriger immédiatement l'écran d'accès
    if (cache) activerCorrections(cache.corrections || []);
    const frais = fetchData();                        // la requête part tout de suite, même pendant le code d'accès
    frais.then(d => { if (d) activerCorrections(d.corrections || []); }).catch(() => {});
    await gate();
    if (cache) { renderAll(cache); announceNew(); }   // visite suivante : tout s'affiche instantanément
    const d = await frais;
    if (d) { const premier = !DATA; renderAll(d, !premier); if (premier) announceNew(); }
    else if (!DATA) { renderAll(C.demo); announceNew(); }

      if (y !== null) { sessionStorage.removeItem(SCROLL_KEY); setTimeout(() => scrollTo({ top: +y, behavior: 'instant' }), 80); }
      verifierMemoire();
      planifierCoach();
  }
  start();
})();

