/* =========================================================
   UTMB – Ultra Trail du Mariage Bossi — config.js
   Tes clés sont dans cles.js (jamais livré). Les réglages du Sheet
   (onglet Parametres) priment sur les valeurs ci-dessous.
   ========================================================= */
window.UTMB_CONFIG = {
  version: "3.7.0",

  /* Secours local haute qualité : conservé pour compatibilité avec l’ancien hero masqué. */
  heroFallback: "assets/images/hero-couple-original.jpg",

  /* Couverture : valeurs de repli si les clés Google Sheet sont absentes.
     1 = rendu validé ; plages appliquées par app.js : 0.75 à 1.35. */
  cover: {
    zoom: 1, zoomMobile: 1,
    titleX: 52.5, titleY: 67.5,
    titleXMobile: 57.5, titleYMobile: 74
  },

  apiUrl: (window.UTMB_CLES && window.UTMB_CLES.apiUrl) || "",
  accessCodeHash: (window.UTMB_CLES && window.UTMB_CLES.accessCodeHash) || "",

  /* Langues proposées (la 1re = langue par défaut) — "es" = espagnol (drapeau chilien) */
  langues: ["fr", "it", "es"],

  /* Compte à rebours + altimètre
     dateMariage : utilisée si la ligne date_mariage du Sheet est vide
     departChrono : date de départ de la progression altimétrique */
  dateMariage: "2027-07-24T00:00",
  departChrono: "2026-11-01T00:00",
  altitudeDepart: 55,     // secteur de Paimpont (valeur de démonstration)
  altitudeSommet: 181,    // Fontaine de Barenton (valeur de démonstration)

  /* Coach la marmotte — valeurs par défaut (les lignes « coach_… » de l'onglet Parametres priment)
     Aucun fichier Coach n'est chargé au démarrage : uniquement à sa 1re apparition. */
  coach: {
    active: true, mobile: true, evenements: true,
    delaiMin: 25, delaiMax: 50,             // 1re apparition (secondes)
    intervalleMin: 120, intervalleMax: 300,  // apparitions suivantes (secondes)
    maxVisite: 3,                            // apparitions aléatoires max par visite
    taillePc: 230, tailleMobile: 160         // hauteur de Coach (px)
  },
  /* Carte parchemin du prototype Parcours.
     Les positions sont des pourcentages de la largeur/hauteur de l'image.
     Elles peuvent aussi être définies directement dans le Sheet avec deux
     colonnes facultatives carte_x et carte_y (aucun changement Apps Script). */
  parchmentMap: {
    limit: 5,
    positions: [
      { x: 33.46, y: 31.74 },
      { x: 31.38, y: 47.17 },
      { x: 66.86, y: 51.27 },
      { x: 56.77, y: 67.48 },
      { x: 80.14, y: 66.50 }
    ]
  },
  /* Données de démonstration (utilisées tant que apiUrl est vide) */
  demo: {
    parametres: {
      titre: "UTMB WEDDING SERIES",
      course_nom: "BROCÉLIANDE",
      sous_titre: "Ultra Trail du Mariage Bossi",
      prenoms: "[Prénom] & [Prénom]",
      date_mariage: "",
      lieu: "BRETAGNE — DOMAINE DES HAYES",
      /* Conservées pour compatibilité avec les Sheets existants ; non affichées sur l’accueil V3.2. */
      accroche: "Une nouvelle épreuve rejoint le circuit. Barrière horaire supprimée, engagement à vie.",
      sous_accroche: "Bienvenue sur BROCÉLIANDE, l’ultra où le ravito final se sert en coupe de champagne.",
      message_accueil: "Des légendes de Brocéliande au Domaine des Hayes, suivez une course pas tout à fait comme les autres : les ravitos se débloquent, le dossard est personnel et l’arrivée se fête en grand.",
      date_limite_reponse: "[à compléter]",
      carte_zoom_etape: 12.1,
      couverture_zoom: 1,
      couverture_zoom_mobile: 1,
      couverture_texte_position_h: 52.5,
      couverture_texte_position_v: 67.5,
      couverture_texte_position_h_mobile: 52.5,
      couverture_texte_position_v_mobile: 74
    },
    etapes: [
      { id:"etape-1", ordre:1, cp:"Départ", lieu:"Domaine des Hayes", km:0, altitude:82, titre:"Le Départ", sous_titre:"Entrée dans la légende", type:"texte", statut:"ouvert", indice:"", lat:47.9820, lng:-2.0500,
        contenu:"Bienvenue sur **BROCÉLIANDE**. Ici, le terrain est légendaire, le dossard personnel et l’engagement à vie.", lien_libelle:"", lien_url:"" },
      { id:"etape-2", ordre:2, cp:"Ravito 1", lieu:"Étang de Paimpont", km:7, altitude:62, titre:"Présence", sous_titre:"Confirmez votre inscription", type:"presence", statut:"nouveau", indice:"", lat:48.0191, lng:-2.1734,
        contenu:"Pas de dossard sans inscription ! Dites-nous si vous serez sur la ligne de départ.", lien_libelle:"", lien_url:"" },
      { id:"etape-3", ordre:3, cp:"Dernière bosse", lieu:"Val sans Retour", km:28, altitude:132, titre:"Hébergement", sous_titre:"Où poser le sac", type:"hebergement", statut:"nouveau", indice:"", lat:48.0000, lng:-2.2833,
        contenu:"Voici quelques adresses pour récupérer après l’effort.", lien_libelle:"", lien_url:"" },
      { id:"etape-4", ordre:4, cp:"Source", lieu:"Fontaine de Barenton", km:39, altitude:181, titre:"Programme", sous_titre:"Le Jour J minute par minute", type:"programme", statut:"verrouille", indice:"Débloqué prochainement", lat:48.0389, lng:-2.2469,
        contenu:"", lien_libelle:"", lien_url:"" },
      { id:"etape-5", ordre:5, cp:"Château", lieu:"Château de Comper", km:51, altitude:95, titre:"Plan du site", sous_titre:"Repérage du terrain", type:"plan", statut:"verrouille", indice:"Débloqué prochainement", lat:48.0700, lng:-2.1728,
        contenu:"", lien_libelle:"", lien_url:"" },
      { id:"etape-6", ordre:6, cp:"PC Merlin", lieu:"Tombeau de Merlin", km:71, altitude:118, titre:"Dernières consignes", sous_titre:"Avant le sprint final", type:"texte", statut:"verrouille", indice:"Débloqué prochainement", lat:48.0778, lng:-2.1175,
        contenu:"", lien_libelle:"", lien_url:"" },
      { id:"etape-7", ordre:7, cp:"Arrivée", lieu:"Domaine des Hayes", km:92, altitude:82, titre:"L’Arrivée", sous_titre:"Ravito champagne", type:"texte", statut:"verrouille", indice:"Débloqué prochainement", lat:47.9820, lng:-2.0500,
        contenu:"Coordonnées de démonstration à valider puis à ajuster dans le Sheet.", lien_libelle:"", lien_url:"" }
    ],
    hebergements: [
      { nom:"[Hébergement 1]", type:"Hôtel", distance:"[x] km", prix:"[à compléter]", lien:"", description:"[à compléter]" },
      { nom:"[Hébergement 2]", type:"Gîte", distance:"[x] km", prix:"[à compléter]", lien:"", description:"[à compléter]" }
    ],
    programme: [],
    photos: {},
    /* Formulaires de secours (mode démo ou Code.gs pas encore mis à jour).
       En temps normal, les questions viennent de l'onglet « Questions » du Sheet. */
    formulaires: {
      presence: [
        { id:"nom", question:"Nom & prénom", type:"texte", obligatoire:true },
        { id:"email", question:"E-mail", type:"email" },
        { id:"presence", question:"Serez-vous sur la ligne de départ ?", type:"pastilles", mode_selection:"unique", obligatoire:true,
          options:[{ v:"Oui", l:"🏃 Je prends le départ !" }, { v:"Non", l:"🫶 Abandon… mais de tout cœur avec vous" }] },
        { id:"adultes", question:"Nombre d'adultes", type:"nombre", min:0, max:20, defaut:1, obligatoire:true, si:"presence=Oui" },
        { id:"enfants", question:"Nombre d'enfants", type:"nombre", min:0, max:20, defaut:0, si:"presence=Oui" },
        { id:"regime", question:"Régime alimentaire / allergies", type:"texte", aide:"Végétarien, sans gluten…", si:"presence=Oui" },
        { id:"message", question:"Un mot pour les mariés", type:"texte_long" }
      ],
      hebergement: [
        { id:"nom", question:"Nom & prénom", type:"texte", obligatoire:true },
        { id:"personnes", question:"Nombre de personnes", type:"nombre", min:1, max:20, defaut:2 },
        { id:"besoin", question:"Votre besoin", type:"liste", obligatoire:true, options:[
          { v:"Je souhaite une proposition d'hébergement", l:"Je souhaite une proposition d'hébergement" },
          { v:"Je réserve moi-même", l:"Je réserve moi-même" },
          { v:"Je n'ai pas besoin d'hébergement", l:"Je n'ai pas besoin d'hébergement" }] },
        { id:"nuits", question:"Nuits concernées", type:"texte", aide:"Ex. vendredi + samedi" },
        { id:"commentaire", question:"Commentaire", type:"texte_long" }
      ]
    }
  }
};

