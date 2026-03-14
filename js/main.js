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
    '.service-card, .process__step, .about__feature, .contact__info-card, .about__chart-container'
  );

  revealElements.forEach((el, i) => {
    el.classList.add('reveal');
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

// ---- Plotly Interactive Chart ----
function initPlotlyChart() {
  if (typeof Plotly === 'undefined') {
    // Retry if Plotly hasn't loaded yet
    setTimeout(initPlotlyChart, 500);
    return;
  }

  const chartEl = document.getElementById('plotly-chart');
  if (!chartEl) return;

  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const sinIA = [42, 45, 43, 47, 50, 48, 52, 55, 53, 56, 58, 60];
  const conIA = [42, 50, 58, 68, 75, 85, 92, 105, 115, 128, 140, 155];

  const trace1 = {
    x: months,
    y: sinIA,
    name: 'Sin IA',
    type: 'scatter',
    mode: 'lines+markers',
    line: { color: '#3a3a4a', width: 2, dash: 'dot' },
    marker: { size: 5, color: '#3a3a4a' },
    fill: 'tozeroy',
    fillcolor: 'rgba(58, 58, 74, 0.1)'
  };

  const trace2 = {
    x: months,
    y: conIA,
    name: 'Con Aoudad AI',
    type: 'scatter',
    mode: 'lines+markers',
    line: { color: '#2ecc71', width: 3 },
    marker: { size: 6, color: '#2ecc71' },
    fill: 'tozeroy',
    fillcolor: 'rgba(46, 204, 113, 0.08)'
  };

  const layout = {
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    font: { family: 'Inter, sans-serif', color: '#9595a8', size: 11 },
    margin: { t: 20, r: 20, b: 40, l: 45 },
    xaxis: {
      gridcolor: 'rgba(42, 42, 58, 0.5)',
      linecolor: 'rgba(42, 42, 58, 0.5)',
      tickfont: { size: 10 }
    },
    yaxis: {
      gridcolor: 'rgba(42, 42, 58, 0.5)',
      linecolor: 'rgba(42, 42, 58, 0.5)',
      tickfont: { size: 10 },
      title: { text: 'Productividad %', font: { size: 10 } }
    },
    legend: {
      x: 0.02, y: 0.98,
      bgcolor: 'rgba(0,0,0,0)',
      font: { size: 10 }
    },
    showlegend: true,
    hovermode: 'x unified'
  };

  const config = {
    displayModeBar: false,
    responsive: true
  };

  Plotly.newPlot(chartEl, [trace1, trace2], layout, config);
}

// Init chart when page loads
window.addEventListener('load', initPlotlyChart);

// ---- Formulario de contacto ----
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(contactForm);
  const data = Object.fromEntries(formData);

  if (!data.name || !data.email) {
    alert('Por favor completa los campos obligatorios.');
    return;
  }

  const submitBtn = contactForm.querySelector('.form__submit');
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<i class="ph ph-spinner"></i> Enviando...';
  submitBtn.disabled = true;

  setTimeout(() => {
    submitBtn.innerHTML = '<i class="ph ph-check-circle"></i> ¡Mensaje Enviado!';
    submitBtn.style.background = 'linear-gradient(135deg, #1a9c5a, #55efc4)';

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
