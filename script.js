// ===================== NAVBAR HAMBURGER =====================
function toggleMenu() {
  const links = document.querySelector('.nav-links');
  links.classList.toggle('open');
}

// Close menu on link click
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    document.querySelector('.nav-links').classList.remove('open');
  });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 50) {
    navbar.style.boxShadow = '0 4px 30px rgba(0,0,0,0.12)';
  } else {
    navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.08)';
  }
});

// ===================== MODALS =====================
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

function closeModalOutside(event, id) {
  if (event.target === document.getElementById(id)) {
    closeModal(id);
  }
}

// Close modals with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal.open').forEach(modal => {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    });
  }
});

// ===================== FORM SUBMIT =====================
function enviarFormulario(e) {
  e.preventDefault();
  closeModal('contacto-modal');
  showToast();
  e.target.reset();
}

function showToast() {
  const toast = document.getElementById('toast');
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
}

// ===================== SCROLL ANIMATIONS =====================
const observerOptions = {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
  const animateEls = document.querySelectorAll(
    '.servicio-card, .equipo-card, .test-card, .stat-item, .nosotros-img, .nosotros-text, .galeria-grid img'
  );
  animateEls.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity 0.5s ease ${i * 0.07}s, transform 0.5s ease ${i * 0.07}s`;
    observer.observe(el);
  });
});

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.servicio-card, .equipo-card, .test-card, .stat-item, .nosotros-img, .nosotros-text, .galeria-grid img').forEach(el => {
    el.classList.add('anim-target');
  });
});

IntersectionObserver.prototype.originalCallback = IntersectionObserver.prototype.callback;
const visibilityObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.servicio-card, .equipo-card, .test-card, .stat-item, .nosotros-img, .nosotros-text, .galeria-grid img').forEach(el => {
    visibilityObserver.observe(el);
  });
});
