(() => {
  'use strict';
  const data = JSON.parse(document.getElementById('estate-data').textContent);
  const en = document.documentElement.lang === 'en';
  const text = (de, english) => en ? english : de;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = matchMedia('(max-width: 760px)');
  const motionButton = document.querySelector('.motion-toggle');
  const snapButton = document.querySelector('.snap-toggle');
  const ambientVideos = [...document.querySelectorAll('video.ambient')];
  const sections = [...document.querySelectorAll('main > .chapter')];
  const progressLinks = [...document.querySelectorAll('.chapter-progress a')];
  const menu = document.getElementById('navigation');
  const media = document.getElementById('media-dialog');
  const mediaContent = media.querySelector('.media-content');
  let paused = reduced.matches;
  let snap = true;
  let opener = null;
  try {
    paused = reduced.matches || sessionStorage.getItem('estate-motion') === 'paused';
    snap = sessionStorage.getItem('estate-snap') !== 'off';
  } catch (_) { /* The page also works when browser storage is unavailable. */ }
  const remember = (key, value) => { try { sessionStorage.setItem(key, value); } catch (_) {} };
  const behavior = () => reduced.matches ? 'instant' : 'smooth';

  function updateMotionButton() {
    const isPaused = paused || reduced.matches;
    motionButton.setAttribute('aria-pressed', String(isPaused));
    motionButton.replaceChildren(document.createTextNode(isPaused ? text('Bewegung starten', 'Start motion') : text('Bewegung pausieren', 'Pause motion')));
    const icon = document.createElement('span');
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = isPaused ? '▷' : 'Ⅱ';
    motionButton.append(icon);
    motionButton.disabled = reduced.matches;
    if (reduced.matches) motionButton.setAttribute('title', text('Reduzierte Bewegung ist in Ihrem Gerät aktiviert.', 'Reduced motion is enabled on your device.'));
    else motionButton.removeAttribute('title');
  }
  function updateAmbient() {
    for (const video of ambientVideos) {
      const rect = video.closest('section').getBoundingClientRect();
      const visible = rect.top < innerHeight * .75 && rect.bottom > innerHeight * .25;
      if (!paused && !reduced.matches && !document.hidden && !media.open && !menu.open && visible) {
        if (!video.hasAttribute('src')) {
          video.src = mobile.matches ? video.dataset.mobile : video.dataset.desktop;
          video.load();
        }
        if (video.paused) video.play().catch(() => { /* Poster stays visible if autoplay is unavailable. */ });
      } else video.pause();
    }
  }
  ambientVideos.forEach(video => video.addEventListener('playing', () => video.classList.add('is-playing')));
  motionButton.addEventListener('click', () => {
    paused = !paused;
    remember('estate-motion', paused ? 'paused' : 'playing');
    updateMotionButton(); updateAmbient();
  });
  function updateSnap() {
    const enabled = snap && !reduced.matches;
    document.documentElement.dataset.snap = enabled ? 'on' : 'off';
    snapButton.setAttribute('aria-pressed', String(enabled));
    snapButton.textContent = enabled ? text('Einrasten: an', 'Snap: on') : text('Einrasten: aus', 'Snap: off');
    snapButton.disabled = reduced.matches;
  }
  snapButton.addEventListener('click', () => { snap = !snap; remember('estate-snap', snap ? 'on' : 'off'); updateSnap(); });
  reduced.addEventListener('change', () => { updateMotionButton(); updateSnap(); updateAmbient(); });
  document.addEventListener('visibilitychange', updateAmbient);
  let scrollQueued = false;
  function updateChapter() {
    scrollQueued = false;
    let current = sections[0];
    for (const section of sections) if (section.getBoundingClientRect().top <= innerHeight * .4) current = section;
    document.body.dataset.chapter = current.id;
    const headerSection = sections.filter(section => section.getBoundingClientRect().top <= 70).at(-1) || sections[0];
    const theme = headerSection.classList.contains('dark') ? 'dark' : 'light';
    if (document.body.dataset.theme !== theme) {
      document.body.dataset.theme = theme;
      document.querySelector('.brand img').src = '/estatestar-preview/assets/Estatestar-final-logo-horizontal-' + (theme === 'dark' ? 'weiss22' : 'schwarz22') + '.webp';
    }
    progressLinks.forEach(link => {
      if (link.dataset.section === current.id) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    updateAmbient();
  }
  addEventListener('scroll', () => {
    if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(updateChapter); }
  }, { passive: true });
  addEventListener('resize', updateChapter, { passive: true });
  updateMotionButton(); updateSnap(); updateChapter();

  function openDialog(dialog, trigger) {
    opener = trigger;
    dialog.showModal();
    document.documentElement.classList.add('dialog-open');
    updateAmbient();
  }
  for (const dialog of [menu, media]) {
    dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const box = dialog.getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
    });
    dialog.addEventListener('close', () => {
      document.documentElement.classList.remove('dialog-open');
      if (dialog === media) {
        const video = mediaContent.querySelector('video');
        if (video) { video.pause(); video.removeAttribute('src'); video.load(); }
        mediaContent.replaceChildren();
      }
      if (opener && opener.isConnected) opener.focus({ preventScroll: true });
      opener = null;
      updateAmbient();
    });
  }
  document.querySelector('.menu-button').addEventListener('click', event => openDialog(menu, event.currentTarget));
  menu.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', event => {
    event.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    menu.close();
    if (target) requestAnimationFrame(() => { target.scrollIntoView({ behavior: behavior() }); history.replaceState(null, '', '#' + target.id); });
  }));

  function openVideo(button) {
    document.getElementById('media-title').textContent = button.dataset.title;
    const video = document.createElement('video');
    video.src = button.dataset.video;
    const still = button.querySelector('img');
    if (still) video.poster = still.src;
    video.controls = true; video.playsInline = true; video.preload = 'metadata';
    video.setAttribute('aria-label', button.dataset.title);
    video.addEventListener('error', () => {
      const note = document.createElement('p'); note.className = 'video-error';
      note.append(document.createTextNode(text('Der Film konnte nicht geladen werden. ', 'The film could not be loaded. ')));
      const link = document.createElement('a'); link.href = button.dataset.video; link.textContent = text('Film direkt öffnen', 'Open film directly');
      link.target = '_blank'; link.rel = 'noopener'; note.append(link); mediaContent.append(note);
    }, { once: true });
    mediaContent.replaceChildren(video); openDialog(media, button);
    video.play().catch(() => { /* Native controls remain available. */ });
  }
  document.querySelectorAll('[data-video]').forEach(button => button.addEventListener('click', () => openVideo(button)));

  const rail = document.querySelector('.photo-rail');
  document.querySelectorAll('[data-photo-filter]').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('[data-photo-filter]').forEach(tab => tab.setAttribute('aria-pressed', String(tab === button)));
    rail.querySelectorAll('.photo-card').forEach(card => { card.hidden = card.dataset.category !== button.dataset.photoFilter; });
    const all = document.querySelector('.all-photos');
    all.href = JSON.parse(all.dataset.routes)[button.dataset.photoFilter];
  }));

  document.querySelectorAll('[data-film-filter]').forEach(button => button.addEventListener('click', () => {
    const category = button.dataset.filmFilter;
    document.querySelectorAll('[data-film-filter]').forEach(tab => tab.setAttribute('aria-pressed', String(tab === button)));
    document.querySelectorAll('[data-film-category]').forEach(card => { card.hidden = card.dataset.filmCategory !== category; });
    const selected = data.portfolio.find(item => item.kind === 'film' && item.category === category);
    const stage = document.querySelector('.film-stage');
    stage.dataset.video = selected.video; stage.dataset.title = selected.title;
    stage.setAttribute('aria-label', selected.title + ' – ' + text('Film ansehen', 'Watch film'));
    stage.querySelector('img').src = selected.image;
    stage.querySelector('.film-stage-title').textContent = selected.title;
  }));
  document.getElementById('tour-select').addEventListener('change', event => {
    const tour = data.portfolio.find(item => item.id === event.target.value);
    document.querySelectorAll('.tour-link').forEach(link => {
      link.href = tour.tour;
      if (link.classList.contains('tour-visual')) link.setAttribute('aria-label', tour.title + ' – ' + text('virtuelle Tour öffnen', 'open virtual tour'));
    });
    const image = document.getElementById('tour-image'); image.src = tour.image; image.alt = tour.title;
    document.querySelector('.tour-caption').textContent = tour.title;
  });
  const concepts = [...document.querySelectorAll('.ki-option')];
  concepts.forEach(detail => detail.addEventListener('toggle', () => {
    if (!detail.open) return;
    concepts.forEach(other => { if (other !== detail) other.open = false; });
    document.getElementById('ki-image').src = detail.dataset.image;
  }));
  document.querySelectorAll('[data-person]').forEach(button => button.addEventListener('click', () => {
    const person = data.team[Number(button.dataset.person)];
    document.getElementById('media-title').textContent = person.name;
    const article = document.createElement('article'); article.className = 'person-bio';
    const image = document.createElement('img'); image.src = person.image; image.alt = person.name;
    const copy = document.createElement('div'); const role = document.createElement('span'); role.className = 'mono'; role.textContent = person.role[en ? 'en' : 'de'];
    const bio = document.createElement('p'); bio.textContent = person.bio[en ? 'en' : 'de']; copy.append(role, bio); article.append(image, copy);
    mediaContent.replaceChildren(article); openDialog(media, button);
  }));
  document.getElementById('project-form').addEventListener('submit', event => {
    event.preventDefault();
    const services = [...event.currentTarget.querySelectorAll('input:checked')].map(input => input.value);
    const brief = document.getElementById('project-brief').value.trim();
    const subject = text('Projektanfrage', 'Project enquiry') + (services.length ? ' · ' + services.join(', ') : ' · ESTATESTAR');
    const body = text('Hallo ESTATESTAR,', 'Hello ESTATESTAR,') + '\n\n' + (services.length ? text('Ich interessiere mich für: ', 'I am interested in: ') + services.join(', ') + '\n\n' : '') + brief + '\n\n' + text('Viele Grüße', 'Best regards');
    document.getElementById('mail-draft').href = 'mailto:studio@estatestar.de?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    document.querySelector('.mail-result').hidden = false;
  });
})();
