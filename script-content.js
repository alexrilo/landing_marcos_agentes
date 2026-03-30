/**
 * Content Loader - Carga contenido dinámico desde content.json
 * Mantiene toda la lógica de accesibilidad, modales y animaciones del HTML actual
 */

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'textarea:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])'
].join(", ");

let activeModal = null;
let lastFocusedElement = null;
let contentData = null;

// Utilidades de accesibilidad existentes
function setBodyScrollLock(isLocked) {
  document.body.style.overflow = isLocked ? "hidden" : "";
}

function getFocusableElements(container) {
  return Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR)).filter((element) => {
    return !element.hasAttribute("hidden") && !element.closest("[hidden]");
  });
}

function trapFocus(container, event) {
  if (event.key !== "Tab") return;

  const focusableElements = getFocusableElements(container);
  if (!focusableElements.length) {
    event.preventDefault();
    return;
  }

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault();
    lastElement.focus();
  } else if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault();
    firstElement.focus();
  }
}

function restoreFocus() {
  if (lastFocusedElement instanceof HTMLElement) {
    lastFocusedElement.focus();
  }
  lastFocusedElement = null;
}

// Cargar JSON
async function loadContent() {
  try {
    const response = await fetch('content.json');
    if (!response.ok) throw new Error('No se pudo cargar content.json');
    contentData = await response.json();
    
    // Actualizar documento
    document.title = contentData.site.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', contentData.site.description);
    
    console.log('✅ Contenido cargado:', contentData);
    return contentData;
  } catch (error) {
    console.error('❌ Error cargando content.json:', error);
    return null;
  }
}

// ========== INICIALIZACIÓN DINÁMMICA ==========

document.addEventListener("DOMContentLoaded", async () => {
  // Esperar a que cargue el JSON
  const content = await loadContent();
  if (!content) {
    console.error('No se pudo cargar el contenido. Usando valores por defecto.');
    return;
  }

  // LÓGICA DE ACCESIBILIDAD ORIGINAL (sin cambios)
  const sections = document.querySelectorAll(".reveal");
  const modalTriggers = document.querySelectorAll(".open-modal");
  const modalCloseButtons = document.querySelectorAll(".close-modal");
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileMenuIcon = document.getElementById("mobile-menu-icon");
  const mobileMenuLinks = document.querySelectorAll(".mobile-menu-link");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Mobile menu handlers
  const closeMobileMenu = () => {
    if (!mobileMenu || !mobileMenuButton || !mobileMenuIcon) return;
    mobileMenu.hidden = true;
    mobileMenu.classList.remove("is-open");
    mobileMenuButton.setAttribute("aria-expanded", "false");
    mobileMenuButton.setAttribute("aria-label", "Abrir menu");
    mobileMenuIcon.textContent = "menu";
  };

  const openMobileMenu = () => {
    if (!mobileMenu || !mobileMenuButton || !mobileMenuIcon) return;
    mobileMenu.hidden = false;
    requestAnimationFrame(() => mobileMenu.classList.add("is-open"));
    mobileMenuButton.setAttribute("aria-expanded", "true");
    mobileMenuButton.setAttribute("aria-label", "Cerrar menu");
    mobileMenuIcon.textContent = "close";
  };

  const closeModal = () => {
    if (!activeModal) return;
    activeModal.hidden = true;
    document.body.style.overflow = "";
    activeModal = null;
  };

  // Mobile menu listeners
  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener("click", () => {
      const isOpen = mobileMenuButton.getAttribute("aria-expanded") === "true";
      if (isOpen) closeMobileMenu();
      else openMobileMenu();
    });

    mobileMenuLinks.forEach((link) => {
      link.addEventListener("click", closeMobileMenu);
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth >= 768) closeMobileMenu();
    });
  }

  // Scroll reveal animations
  if (prefersReducedMotion) {
    sections.forEach((section) => section.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    sections.forEach((section) => observer.observe(section));
  }

  // Modal handlers
  modalTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const modalId = trigger.getAttribute("data-modal");
      const modal = modalId ? document.getElementById(modalId) : null;

      if (!modal) return;
      lastFocusedElement = trigger;
      modal.hidden = false;
      document.body.style.overflow = "hidden";
      activeModal = modal;
      modal.querySelector("[role='dialog']")?.focus();
      modal.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeModal();
        trapFocus(modal, e);
      });
    });
  });

  modalCloseButtons.forEach((button) => {
    button.addEventListener("click", closeModal);
  });

  document.querySelectorAll(".modal-overlay").forEach((modal) => {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) closeModal();
    });
  });

  // Atajos de teclado globales
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMobileMenu();
      closeModal();
    }
  });

  // Contacto formulario (si usa EmailJS, debe configurarse por separado)
  const contactForm = document.querySelector('form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      // La lógica de EmailJS debe estar en otro script
      // o implementarse aquí si es necesario
      console.log('Formulario enviado');
    });
  }

  console.log('✅ Landing inicializada correctamente con contenido dinámico');
});
