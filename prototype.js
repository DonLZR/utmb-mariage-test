(() => {
  'use strict';
  const points = {
    camp: {
      tag: 'Camp de base', title: 'Domaine des Hayes',
      text: 'Le point d’ancrage du week-end : arrivée, repères pratiques et départ vers chaque temps fort.',
      time: 'Tout le week-end', tip: 'Enregistrez l’itinéraire avant de partir.'
    },
    parking: {
      tag: 'Pratique', title: 'Parking & accueil',
      text: 'Le premier point de passage des invités, avec accès, dépose-minute et consignes d’arrivée.',
      time: 'Horaire à confirmer', tip: 'Le point exact et le sens d’entrée seront validés avant production.'
    },
    accueil: {
      tag: 'Départ', title: 'Accueil des invités',
      text: 'Le vrai départ du week-end : orientation, remise des informations et premier rassemblement.',
      time: 'Horaire à confirmer', tip: 'Prévoir un repère très visible depuis le parking.'
    },
    ceremonie: {
      tag: 'Temps fort', title: 'La cérémonie',
      text: 'Le premier sommet du parcours, dans un espace du domaine encore à confirmer sur le plan final.',
      time: 'Horaire piloté par le Sheet', tip: 'Ajouter un plan B météo au même point d’information.'
    },
    soiree: {
      tag: 'Grand ravito', title: 'Dîner & soirée',
      text: 'Le cœur festif du parcours : dîner, soirée et informations de retour vers les hébergements.',
      time: 'Horaire piloté par le Sheet', tip: 'Relier ce point aux navettes et couchages.'
    },
    hebergement: {
      tag: 'Refuge', title: 'Hébergements',
      text: 'Où poser le sac : couchages du domaine et solutions proches, selon les réponses des invités.',
      time: 'Accès à confirmer', tip: 'Conserver le formulaire d’hébergement existant.'
    }
  };

  const setPoint = id => {
    const p = points[id];
    if (!p) return;
    document.querySelectorAll('.poi,.map-marker').forEach(el => el.classList.toggle('active', el.dataset.id === id));
    document.querySelector('#poi-tag').textContent = p.tag;
    document.querySelector('#poi-title').textContent = p.title;
    document.querySelector('#poi-text').textContent = p.text;
    document.querySelector('#poi-time').textContent = p.time;
    document.querySelector('#poi-tip').textContent = p.tip;
  };

  document.querySelectorAll('.poi,.map-marker').forEach(el => {
    el.addEventListener('click', () => setPoint(el.dataset.id));
    if (el.classList.contains('map-marker')) {
      el.setAttribute('tabindex', '0');
      el.setAttribute('role', 'button');
      el.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setPoint(el.dataset.id); }
      });
    }
  });

  document.querySelectorAll('.map-chip').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('.map-chip').forEach(b => b.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.filter;
    document.querySelectorAll('.poi').forEach(poi => { poi.hidden = filter !== 'all' && poi.dataset.kind !== filter; });
  }));
})();
