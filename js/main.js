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

// ---- Validación de formulario ----
const contactForm = document.getElementById('contact-form');
const phoneInput = document.getElementById('phone');
const emailInput = document.getElementById('email');
const nameInput = document.getElementById('name');

// Bloquear caracteres especiales en teléfono — solo números
phoneInput.addEventListener('input', () => {
  phoneInput.value = phoneInput.value.replace(/[^0-9]/g, '');

  // Limitar a 15 dígitos (máximo internacional)
  if (phoneInput.value.length > 15) {
    phoneInput.value = phoneInput.value.slice(0, 15);
  }

  validatePhone();
});

phoneInput.addEventListener('keydown', (e) => {
  // Permitir: backspace, delete, tab, escape, enter, flechas
  const allowed = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
    'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'];
  if (allowed.includes(e.key)) return;

  // Permitir Ctrl/Cmd + A, C, V, X
  if ((e.ctrlKey || e.metaKey) && ['a', 'c', 'v', 'x'].includes(e.key.toLowerCase())) return;

  // Bloquear todo excepto números
  if (!/^[0-9]$/.test(e.key)) {
    e.preventDefault();
  }
});

// Bloquear pegar caracteres no numéricos
phoneInput.addEventListener('paste', (e) => {
  e.preventDefault();
  const pasted = (e.clipboardData || window.clipboardData).getData('text');
  const cleaned = pasted.replace(/[^0-9]/g, '');
  phoneInput.value = (phoneInput.value + cleaned).slice(0, 15);
  validatePhone();
});

function validatePhone() {
  const errorEl = document.getElementById('phone-error');
  const val = phoneInput.value.trim();

  if (!val) {
    showError(phoneInput, errorEl, 'Ingresa tu número de teléfono.');
    return false;
  }
  if (val.length < 7) {
    showError(phoneInput, errorEl, 'El número debe tener al menos 7 dígitos.');
    return false;
  }
  clearError(phoneInput, errorEl);
  return true;
}

// Validación de email en tiempo real
const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

emailInput.addEventListener('input', () => {
  validateEmail();
});

emailInput.addEventListener('blur', () => {
  validateEmail();
});

function validateEmail() {
  const errorEl = document.getElementById('email-error');
  const val = emailInput.value.trim();

  if (!val) {
    showError(emailInput, errorEl, 'Ingresa tu correo electrónico.');
    return false;
  }
  if (!val.includes('@')) {
    showError(emailInput, errorEl, 'Agrega un correo válido. Ejemplo: tu@email.com');
    return false;
  }
  if (!emailRegex.test(val)) {
    showError(emailInput, errorEl, 'El formato del correo no es válido. Verifica que incluya @ y un dominio.');
    return false;
  }
  clearError(emailInput, errorEl);
  return true;
}

// Validación de nombre
nameInput.addEventListener('blur', () => {
  validateName();
});

function validateName() {
  const errorEl = document.getElementById('name-error');
  const val = nameInput.value.trim();

  if (!val) {
    showError(nameInput, errorEl, 'Ingresa tu nombre completo.');
    return false;
  }
  if (val.length < 2) {
    showError(nameInput, errorEl, 'El nombre debe tener al menos 2 caracteres.');
    return false;
  }
  clearError(nameInput, errorEl);
  return true;
}

// Helpers de error
function showError(input, errorEl, message) {
  input.classList.add('form__input--invalid');
  input.classList.remove('form__input--valid');
  errorEl.textContent = message;
}

function clearError(input, errorEl) {
  input.classList.remove('form__input--invalid');
  input.classList.add('form__input--valid');
  errorEl.textContent = '';
}

// ---- Envío de formulario (FormSubmit AJAX) ----
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Validar todos los campos antes de enviar
  const isNameValid = validateName();
  const isEmailValid = validateEmail();
  const isPhoneValid = validatePhone();

  if (!isNameValid || !isEmailValid || !isPhoneValid) {
    // Enfocar el primer campo con error
    if (!isNameValid) nameInput.focus();
    else if (!isEmailValid) emailInput.focus();
    else if (!isPhoneValid) phoneInput.focus();
    return;
  }

  // Combinar código + teléfono para enviar completo
  const phoneCode = document.getElementById('phone-code').value;
  const fullPhone = phoneCode + ' ' + phoneInput.value;

  const formData = new FormData(contactForm);
  const data = Object.fromEntries(formData);
  data.phone = fullPhone; // Reemplazar con teléfono completo

  const submitBtn = contactForm.querySelector('.form__submit');
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<i class="ph ph-spinner"></i> Enviando...';
  submitBtn.disabled = true;

  fetch(contactForm.action, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(result => {
      if (result.success) {
        submitBtn.innerHTML = '<i class="ph ph-check-circle"></i> ¡Mensaje Enviado!';
        submitBtn.style.background = 'linear-gradient(135deg, #1a9c5a, #55efc4)';
        contactForm.reset();
        // Limpiar estados de validación
        contactForm.querySelectorAll('.form__input--valid, .form__input--invalid').forEach(el => {
          el.classList.remove('form__input--valid', 'form__input--invalid');
        });
        contactForm.querySelectorAll('.form__error').forEach(el => {
          el.textContent = '';
        });
      } else {
        submitBtn.innerHTML = '<i class="ph ph-warning"></i> Error al enviar';
        submitBtn.style.background = 'linear-gradient(135deg, #c0392b, #e74c3c)';
      }

      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.style.background = '';
        submitBtn.disabled = false;
      }, 3000);
    })
    .catch(() => {
      submitBtn.innerHTML = '<i class="ph ph-warning"></i> Error de conexión';
      submitBtn.style.background = 'linear-gradient(135deg, #c0392b, #e74c3c)';

      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.style.background = '';
        submitBtn.disabled = false;
      }, 3000);
    });
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
