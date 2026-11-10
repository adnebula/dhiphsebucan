/* ============================================
   CONFIGURACIÓN
   ============================================ */
const WHATSAPP_NUMBER = '584129602145';

/* ============================================
   AÑO DINÁMICO
   ============================================ */
document.getElementById('year').textContent = new Date().getFullYear();

/* ============================================
   HEADER SCROLL
   ============================================ */
const header = document.getElementById('header');
const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 40);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ============================================
   NAVEGACIÓN MÓVIL
   ============================================ */
const navToggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');

navToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  navToggle.classList.toggle('is-open', open);
  navToggle.setAttribute('aria-expanded', open);
});

nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    navToggle.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

/* ============================================
   CARRUSELES
   ============================================ */
document.querySelectorAll('.carousel').forEach(carousel => {
  const track = carousel.querySelector('.carousel__track');
  const prev = carousel.querySelector('.carousel__btn--prev');
  const next = carousel.querySelector('.carousel__btn--next');
  if (!track || !prev || !next) return;

  const getStep = () => {
    const item = track.querySelector('.carousel__item');
    return item ? item.offsetWidth + 16 : track.clientWidth * 0.8;
  };

  prev.addEventListener('click', () => track.scrollBy({ left: -getStep(), behavior: 'smooth' }));
  next.addEventListener('click', () => track.scrollBy({ left: getStep(), behavior: 'smooth' }));

  // Drag con mouse (desktop)
  let isDown = false, startX, scrollLeft;
  track.addEventListener('mousedown', e => {
    isDown = true;
    startX = e.pageX - track.offsetLeft;
    scrollLeft = track.scrollLeft;
    track.style.cursor = 'grabbing';
  });
  track.addEventListener('mouseleave', () => { isDown = false; track.style.cursor = ''; });
  track.addEventListener('mouseup', () => { isDown = false; track.style.cursor = ''; });
  track.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    track.scrollLeft = scrollLeft - (x - startX) * 1.5;
  });
});

/* ============================================
   LIGHTBOX
   ============================================ */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCounter = document.getElementById('lightboxCounter');
const btnClose = document.getElementById('lightboxClose');
const btnPrev = document.getElementById('lightboxPrev');
const btnNext = document.getElementById('lightboxNext');

let currentGroup = [];
let currentIndex = 0;

function openLightbox(group, index) {
  currentGroup = group;
  currentIndex = index;
  updateLightbox();
  lightbox.classList.add('is-open');
  document.body.style.overflow = 'hidden';
}

function updateLightbox() {
  if (!currentGroup.length) return;
  const src = currentGroup[currentIndex];
  lightboxImg.src = src;
  lightboxCounter.textContent = `${currentIndex + 1} / ${currentGroup.length}`;
}

function closeLightbox() {
  lightbox.classList.remove('is-open');
  document.body.style.overflow = '';
}

function navigate(dir) {
  if (!currentGroup.length) return;
  currentIndex = (currentIndex + dir + currentGroup.length) % currentGroup.length;
  updateLightbox();
}

document.querySelectorAll('.carousel__item').forEach(item => {
  item.addEventListener('click', () => {
    // Obtener todas las imágenes del mismo carrusel
    const group = Array.from(item.closest('.carousel__track').querySelectorAll('.carousel__item'))
      .map(el => el.dataset.src || el.querySelector('img').src);
    const index = Array.from(item.closest('.carousel__track').querySelectorAll('.carousel__item')).indexOf(item);
    openLightbox(group, index);
  });
});

btnClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
btnPrev.addEventListener('click', () => navigate(-1));
btnNext.addEventListener('click', () => navigate(1));

document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('is-open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') navigate(-1);
  if (e.key === 'ArrowRight') navigate(1);
});

/* ============================================
   FORMULARIO → WHATSAPP
   ============================================ */
const form = document.getElementById('visitForm');

const validators = {
  nombre: v => v.trim().length >= 3 ? '' : 'Ingresa tu nombre completo.',
  telefono: v => /^[+\d\s()-]{7,20}$/.test(v.trim()) ? '' : 'Ingresa un teléfono válido.',
  correo: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Ingresa un correo válido.'
};

function validateField(field) {
  const input = form.elements[field];
  const errorEl = form.querySelector(`[data-error="${field}"]`);
  const error = validators[field](input.value);
  errorEl.textContent = error;
  input.classList.toggle('is-invalid', !!error);
  return !error;
}

['nombre', 'telefono', 'correo'].forEach(field => {
  const input = form.elements[field];
  input.addEventListener('blur', () => validateField(field));
  input.addEventListener('input', () => {
    if (input.classList.contains('is-invalid')) validateField(field);
  });
});

form.addEventListener('submit', e => {
  e.preventDefault();

  const ok = ['nombre', 'telefono', 'correo'].every(validateField);
  if (!ok) {
    const firstInvalid = form.querySelector('.is-invalid');
    if (firstInvalid) firstInvalid.focus();
    return;
  }

  const nombre = form.elements.nombre.value.trim();
  const telefono = form.elements.telefono.value.trim();
  const correo = form.elements.correo.value.trim();

  const mensaje =
    `Hola, estoy interesado en el PH SEBUCÁN COUNTRY (Triplex 600m²).%0A%0A` +
    `*Solicitud de Visita:*%0A` +
    `• Nombre: ${encodeURIComponent(nombre)}%0A` +
    `• Teléfono: ${encodeURIComponent(telefono)}%0A` +
    `• Correo: ${encodeURIComponent(correo)}%0A%0A` +
    `Quedo atento a la aprobación de mi perfil para coordinar la visita.`;

  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${mensaje}`, '_blank', 'noopener');

  form.reset();
  ['nombre', 'telefono', 'correo'].forEach(f => {
    form.querySelector(`[data-error="${f}"]`).textContent = '';
    form.elements[f].classList.remove('is-invalid');
  });
});

/* ============================================
   ANIMACIONES REVEAL ON SCROLL
   ============================================ */
const revealEls = document.querySelectorAll(
  '.feature, .price-card, .gallery-group, .property-intro__image, .cta__text, .form, .location__map'
);

revealEls.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity .7s ease, transform .7s ease';
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => observer.observe(el));
