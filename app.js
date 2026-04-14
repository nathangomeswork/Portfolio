// ── SVSC Portfolio Engine ──
// Charge data.json et injecte les données dans la page courante

// ── BASE URL — pointe vers la racine du dépôt GitHub Pages ──
const BASE = '/Portfolio';

let DATA = null;

async function loadData() {
  const res = await fetch(`${BASE}/data.json`);
  DATA = await res.json();
  return DATA;
}

// ── Utilitaires ──
function tag(cls, html, tag = 'div') {
  return `<${tag} class="${cls}">${html}</${tag}>`;
}

function formatTags(tags, cls = 'exp-tag') {
  return tags.map(t => `<span class="${cls}">${t}</span>`).join('');
}

// ── NAV commune ──
function renderNav(activePage = '') {
  const d = DATA.identite;
  return `
  <nav class="nav">
    <a href="${BASE}/index.html" class="nav-logo">
      <span class="dot"></span>
      ${d.prenom.charAt(0)}${d.nom.charAt(0)} · Portfolio
    </a>
    <ul class="nav-links">
      <li><a href="${BASE}/index.html#experiences">Expériences</a></li>
      <li><a href="${BASE}/index.html#projets">Projets</a></li>
      <li><a href="${BASE}/index.html#competences">Compétences</a></li>
      <li><a href="${BASE}/index.html#contact" class="nav-cta">Contact</a></li>
    </ul>
  </nav>`;
}

// ── FOOTER commun ──
function renderFooter() {
  const d = DATA.identite;
  return `
  <footer>
    <span class="footer-copy">© 2025 — ${d.prenom} ${d.nom}</span>
    <span class="footer-copy">${d.disponibilite} · ${d.localisation}</span>
  </footer>`;
}

// ── INDEX PAGE ──
async function renderIndex() {
  const d = DATA.identite;

  // Hero
  document.getElementById('hero-badge-text').textContent = d.disponibilite + ' · ' + d.localisation;
  document.getElementById('hero-prenom').textContent = d.prenom;
  document.getElementById('hero-nom').textContent = d.nom;
  document.getElementById('hero-titre').textContent = d.titre;
  document.getElementById('hero-accroche').textContent = d.accroche;

  // Photo
  const photoWrap = document.getElementById('hero-photo-wrap');
  if (photoWrap) {
    if (d.photo) {
      photoWrap.innerHTML = `
        <div class="hero-photo-ring">
          <img src="${d.photo}" alt="${d.prenom} ${d.nom}" class="hero-photo">
        </div>`;
    } else {
      photoWrap.innerHTML = `
        <div class="hero-photo-ring hero-photo-placeholder">
          <div class="hero-photo-placeholder-inner">
            <span>+</span>
            <small>photo.png</small>
            <small style="font-size:0.55rem;opacity:0.5">assets/images/</small>
          </div>
        </div>`;
    }
  }

  // Expériences
  const expGrid = document.getElementById('exp-grid');
  if (expGrid) {
    expGrid.innerHTML = DATA.experiences.map(exp => `
      <a href="${BASE}/experiences/${exp.slug}.html" class="exp-card reveal">
        <div class="exp-logo-wrap">
          ${exp.logo
            ? `<img src="${exp.logo}" alt="${exp.entreprise}" class="exp-logo">`
            : `<div class="exp-logo-placeholder">${exp.entreprise.charAt(0)}</div>`
          }
        </div>
        <div class="exp-meta">
          <div class="exp-periode">${exp.periode}</div>
          <div class="exp-duree">${exp.duree}</div>
        </div>
        <div class="exp-content">
          <div class="exp-poste">${exp.poste}</div>
          <div class="exp-entreprise">${exp.entreprise}</div>
          <p class="exp-resume">${exp.resume}</p>
          <div class="exp-tags">${formatTags(exp.tags, 'exp-tag')}</div>
        </div>
        <div class="exp-right">
          <span class="exp-type">${exp.type}</span>
          <span class="exp-arrow">↗</span>
        </div>
      </a>`).join('');
  }

  // Projets
  const projetsGrid = document.getElementById('projets-grid');
  if (projetsGrid) {
    projetsGrid.innerHTML = DATA.projets.map((p, i) => `
      <a href="${BASE}/projets/${p.slug}.html" class="projet-card reveal" style="transition-delay:${i * 0.08}s">
        <div class="projet-header" style="background:${p.couleur}">
          <div class="projet-header-pattern"></div>
          ${p.image
            ? `<img src="${p.image}" alt="${p.titre}" class="projet-header-img">`
            : `<div class="projet-header-placeholder"><span>+</span><small>Ajoute une image dans data.json</small></div>`
          }
          <div class="projet-num">0${i + 1}</div>
          <span class="projet-status">${p.annee}</span>
        </div>
        <div class="projet-body">
          <div class="projet-tags">${formatTags(p.tags, 'projet-tag')}</div>
          <div class="projet-titre">${p.titre}</div>
          <p class="projet-resume">${p.resume}</p>
          <div class="projet-footer">
            <span class="projet-lien">Voir le projet →</span>
            <span class="projet-annee">${p.annee}</span>
          </div>
        </div>
      </a>`).join('');
  }

  // Compétences
  const skillsGrid = document.getElementById('skills-grid');
  if (skillsGrid) {
    skillsGrid.innerHTML = DATA.competences.map(c => `
      <div class="skill-bloc reveal">
        <div class="skill-icone">${c.icone}</div>
        <div class="skill-cat">${c.categorie}</div>
        <div class="skill-items">${c.items.map(i => `<span class="skill-item">${i}</span>`).join('')}</div>
      </div>`).join('');
  }

  // Formation
  const formGrid = document.getElementById('formation-grid');
  if (formGrid) {
    const formHTML = DATA.formation.map(f => `
      <a href="${f.url}" target="_blank" rel="noopener" class="formation-card reveal formation-link">
        <div class="formation-annee">${f.annee}</div>
        <div class="formation-diplome">${f.diplome}</div>
        ${f.specialite ? `<div class="formation-spe">${f.specialite}</div>` : ''}
        <div class="formation-etab-row">
          <span class="formation-etab">${f.etablissement}</span>
          <span class="formation-ext">↗</span>
        </div>
      </a>`).join('');

    const languesHTML = DATA.langues.map(l => {
      const inner = `
        <div class="langue-header">
          <div class="langue-code ${l.code === 'C1' ? 'langue-code-featured' : ''}">${l.code}</div>
          <div>
            <div class="langue-nom">${l.langue}</div>
            <div class="langue-niveau">${l.niveau}</div>
          </div>
        </div>
        ${l.detail ? `<div class="langue-detail">${l.detail}</div>` : ''}
        ${l.certificat_url ? `<div class="langue-cert-link">Voir le certificat ↗</div>` : ''}
      `;
      return l.certificat_url
        ? `<a href="${l.certificat_url}" target="_blank" rel="noopener" class="formation-card reveal langue-card ${l.code === 'C1' ? 'langue-featured' : ''} formation-link">${inner}</a>`
        : `<div class="formation-card reveal langue-card">${inner}</div>`;
    }).join('');

    formGrid.innerHTML = formHTML + `
      <div class="langues-titre reveal"><div class="section-eyebrow" style="margin-bottom:0">Langues</div></div>
      <div style="display:none"></div>` + languesHTML;
  }

  // Contact
  const d2 = DATA.identite;
  const contactLinks = document.getElementById('contact-links');
  if (contactLinks) {
    contactLinks.innerHTML = [
      { label: 'Email', value: d2.email, href: `mailto:${d2.email}`, arrow: '↗' },
      { label: 'Téléphone', value: d2.telephone, href: `tel:${d2.telephone.replace(/\s/g,'')}`, arrow: '↗' },
      { label: 'LinkedIn', value: 'Voir mon profil', href: d2.linkedin, arrow: '↗' },
      { label: 'GitHub', value: 'Voir mes projets', href: d2.github, arrow: '↗' },
    ].map(item => `
      <a href="${item.href}" target="_blank" class="contact-item">
        <div>
          <div class="contact-label">${item.label}</div>
          <div class="contact-value">${item.value}</div>
        </div>
        <span class="contact-arrow">${item.arrow}</span>
      </a>`).join('');
  }
  document.getElementById('contact-desc').textContent = d2.disponibilite + '. ' + d2.bio2;
}

// ── PAGE EXPÉRIENCE ──
async function renderExperience() {
  const slug = document.body.dataset.slug;
  const exp = DATA.experiences.find(e => e.slug === slug);
  if (!exp) { document.body.innerHTML += '<p style="padding:8rem;color:white">Expérience introuvable.</p>'; return; }

  document.title = `${exp.poste} — ${exp.entreprise} · Portfolio`;
  document.documentElement.style.setProperty('--couleur-exp', exp.couleur);

  document.getElementById('exp-back').innerHTML = `← Retour`;
  document.getElementById('exp-type').textContent = exp.type;
  document.getElementById('exp-poste').textContent = exp.poste;
  document.getElementById('exp-entreprise').textContent = exp.entreprise;
  document.getElementById('exp-periode').textContent = exp.periode;
  document.getElementById('exp-duree').textContent = exp.duree;
  document.getElementById('exp-tags').innerHTML = formatTags(exp.tags, 'page-badge');
  document.getElementById('exp-missions').innerHTML = exp.missions.map((m, i) => `
    <div class="mission-item reveal">
      <span class="mission-num">0${i+1}</span>
      <span class="mission-text">${m}</span>
    </div>`).join('');
  document.getElementById('exp-impact').textContent = exp.impact;
  document.getElementById('exp-resume-full').textContent = exp.resume;

  // Galerie photos
  const galerie = document.getElementById('exp-galerie');
  if (galerie && exp.photos && exp.photos.length) {
    galerie.innerHTML = exp.photos.map((src, i) => `
      <div class="galerie-item">
        <img src="${src}" alt="Photo ${i+1} — ${exp.entreprise}" class="galerie-img"
             onerror="this.parentElement.classList.add('galerie-placeholder'); this.remove(); this.parentElement.innerHTML += '<div class=\\'galerie-ph-inner\\'><span>+</span><small>${exp.slug}-${i+1}.jpg</small></div>'">
      </div>`).join('');
  }
}

// ── PAGE PROJET ──
async function renderProjet() {
  const slug = document.body.dataset.slug;
  const projet = DATA.projets.find(p => p.slug === slug);
  if (!projet) { document.body.innerHTML += '<p style="padding:8rem;color:white">Projet introuvable.</p>'; return; }

  document.title = `${projet.titre} · Portfolio`;
  document.documentElement.style.setProperty('--couleur-projet', projet.couleur);

  document.getElementById('projet-titre').textContent = projet.titre;
  document.getElementById('projet-sous-titre').textContent = projet.sous_titre;
  document.getElementById('projet-annee').textContent = projet.annee;
  document.getElementById('projet-tags').innerHTML = formatTags(projet.tags, 'page-badge');
  document.getElementById('projet-description').textContent = projet.description;
  document.getElementById('projet-stack').innerHTML = formatTags(projet.stack, 'skill-item');
  document.getElementById('projet-points').innerHTML = projet.points_cles.map((p, i) => `
    <div class="mission-item reveal">
      <span class="mission-num">0${i+1}</span>
      <span class="mission-text">${p}</span>
    </div>`).join('');

  const githubBtn = document.getElementById('projet-github');
  const demoBtn = document.getElementById('projet-demo');
  if (githubBtn) githubBtn.href = projet.github_url;
  if (demoBtn) {
    if (projet.demo_url) { demoBtn.href = projet.demo_url; demoBtn.style.display = 'inline-flex'; }
    else { demoBtn.style.display = 'none'; }
  }
}

// ── SCROLL REVEAL ──
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    els.forEach(e => { e.style.opacity = '1'; e.style.transform = 'none'; });
    return;
  }
  els.forEach(el => { el.style.opacity = '0'; el.style.transform = 'translateY(20px)'; });
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'none';
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
  els.forEach(e => obs.observe(e));
}

// ── INIT ──
document.addEventListener('DOMContentLoaded', async () => {
  try {
    await loadData();
    // Injecte nav et footer
    const navEl = document.getElementById('nav-placeholder');
    const footerEl = document.getElementById('footer-placeholder');
    if (navEl) navEl.outerHTML = renderNav();
    if (footerEl) footerEl.outerHTML = renderFooter();

    // Route selon la page
    const page = document.body.dataset.page;
    if (page === 'index') await renderIndex();
    if (page === 'experience') await renderExperience();
    if (page === 'projet') await renderProjet();

    initReveal();
  } catch(err) {
    console.error('Erreur chargement data.json :', err);
  }
});
