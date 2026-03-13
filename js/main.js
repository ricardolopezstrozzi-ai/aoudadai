/* ================================================
   AOUDAD AI - JavaScript Principal
   ================================================ */

// ---- Menú móvil ----
const navToggle = document.getElementById('nav-toggle');
const navClose = document.getElementById('nav-close');
const navMenu = document.getElementById('nav-menu');

function openMenu() {
  navMenu.classList.add('nav__menu--open');
  navToggle.setAttribute('aria-expanded', 'true');
}

function closeMenu() {
  navMenu.classList.remove('nav__menu--open');
  navToggle.setAttribute('aria-expanded', 'false');
}

navToggle.addEventListener('click', openMenu);
navClose.addEventListener('click', closeMenu);

// Cerrar al hacer click en un link
document.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', closeMenu);
});

// Cerrar al hacer click fuera
document.addEventListener('click', (e) => {
  if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
    closeMenu();
  }
});

// ---- Header scroll effect ----
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header.classList.add('header--scrolled');
  } else {
    header.classList.remove('header--scrolled');
  }
});

// ---- Active nav link on scroll ----
const sections = document.querySelectorAll('section[id]');

function highlightNavLink() {
  const scrollY = window.scrollY + 100;

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');
    const link = document.querySelector(`.nav__link[href="#${sectionId}"]`);

    if (link) {
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    }
  });
}

window.addEventListener('scroll', highlightNavLink);

// ---- Scroll reveal animations ----
function initRevealAnimations() {
  const revealElements = document.querySelectorAll(
    '.service-card, .process__step, .about__feature, .contact__info-card, .about__card'
  );

  revealElements.forEach((el, i) => {
    el.classList.add('reveal');
    // Stagger within parent groups
    const siblings = el.parentElement.children;
    const index = Array.from(siblings).indexOf(el);
    el.setAttribute('data-delay', Math.min(index + 1, 4));
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visible');
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  revealElements.forEach(el => observer.observe(el));
}

initRevealAnimations();

// ---- Formulario de contacto ----
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(contactForm);
  const data = Object.fromEntries(formData);

  // Validación básica
  if (!data.name || !data.email) {
    alert('Por favor completa los campos obligatorios.');
    return;
  }

  // Simulación de envío
  const submitBtn = contactForm.querySelector('.form__submit');
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<i class="ph ph-spinner"></i> Enviando...';
  submitBtn.disabled = true;

  setTimeout(() => {
    submitBtn.innerHTML = '<i class="ph ph-check-circle"></i> ¡Mensaje Enviado!';
    submitBtn.style.background = 'linear-gradient(135deg, #27c93f, #00cec9)';

    setTimeout(() => {
      submitBtn.innerHTML = originalText;
      submitBtn.style.background = '';
      submitBtn.disabled = false;
      contactForm.reset();
    }, 2500);
  }, 1500);
});

// ---- Smooth scroll para links internos ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;

    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
