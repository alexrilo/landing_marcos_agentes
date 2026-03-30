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

// ========== FUNCIONES DE INYECCIÓN DE CONTENIDO ==========

/**
 * Obtiene un valor anidado de un objeto usando notación de puntos
 * Soporta corchetes: "philosophy.pillars[0].title" → obj.philosophy.pillars[0].title
 */
function getNestedValue(obj, path) {
  return path.split(/\.|\[|\]/).filter(Boolean).reduce((current, key) => {
    // Si es un número, intenta convertir a índice de array
    const keyOrIndex = !isNaN(key) && key !== '' ? parseInt(key, 10) : key;
    return current && current[keyOrIndex] !== undefined ? current[keyOrIndex] : null;
  }, obj);
}

/**
 * Inyecta contenido en elementos con atributos data-content
 * Soporta HTML insertado (como etiquetas <i>)
 */
function injectTextContent() {
  const elements = document.querySelectorAll('[data-content]');
  elements.forEach(el => {
    const path = el.getAttribute('data-content');
    const value = getNestedValue(contentData, path);
    if (value !== null) {
      el.innerHTML = value;
    }
  });
}

/**
 * Inyecta atributos src en elementos con data-content-src
 */
function injectImageSources() {
  const elements = document.querySelectorAll('[data-content-src]');
  elements.forEach(el => {
    const path = el.getAttribute('data-content-src');
    const value = getNestedValue(contentData, path);
    if (value !== null) {
      el.src = value;
    }
  });
}

/**
 * Inyecta atributos href en elementos con data-content-href
 */
function injectLinkHrefs() {
  const elements = document.querySelectorAll('[data-content-href]');
  elements.forEach(el => {
    const path = el.getAttribute('data-content-href');
    const value = getNestedValue(contentData, path);
    if (value !== null) {
      el.href = value;
    }
  });
}

/**
 * Inyecta atributos href en elementos con data-content-anchor (para enlaces internos)
 */
function injectAnchorHrefs() {
  const elements = document.querySelectorAll('[data-content-anchor]');
  elements.forEach(el => {
    const path = el.getAttribute('data-content-anchor');
    const value = getNestedValue(contentData, path);
    if (value !== null) {
      el.href = value;
    }
  });
}

/**
 * Actualiza los iconos de Material Symbols
 */
function injectIcons() {
  const elements = document.querySelectorAll('[data-icon]');
  elements.forEach(el => {
    const iconPath = el.getAttribute('data-icon');
    // El icono ya está en el HTML, pero actualizamos si es necesario
    // Esta función reserved para lógica adicional de iconos
  });
}

/**
 * Inyecta contenido de los pilares de filosofía
 */
function injectPhilosophyPillars() {
  const pillars = contentData?.philosophy?.pillars;
  if (!pillars) return;

  const pillarElements = document.querySelectorAll('[data-philosophy-pillar]');
  pillarElements.forEach((el, index) => {
    if (pillars[index]) {
      const pillar = pillars[index];
      // Buscar elementos hijos para título y descripción (soporta corchetes)
      const titleEl = el.querySelector('[data-content^="philosophy.pillars["]');
      const descEl = el.querySelector('[data-content$="description]"]');
      const iconEl = el.querySelector('[data-icon]');

      if (titleEl) titleEl.textContent = pillar.title;
      if (descEl) descEl.textContent = pillar.description;
      if (iconEl) iconEl.setAttribute('data-icon', pillar.icon);
    }
  });
}

/**
 * Genera el contenido HTML de servicios para inyectar dinámicamente
 */
function injectServices() {
  const services = contentData?.services;
  if (!services) return;

  // Actualizar label y título de la sección servicios
  const labelEl = document.querySelector('[data-content="services.label"]');
  const titleEl = document.querySelector('[data-content="services.title"]');
  const subtitleEl = document.querySelector('[data-content="services.subtitle"]');

  if (labelEl) labelEl.textContent = services.label;
  if (titleEl) titleEl.textContent = services.title;
  if (subtitleEl) {
    subtitleEl.innerHTML = services.subtitle;
    subtitleEl.classList.add('italic');
  }
}

/**
 * Genera el contenido HTML de testimonios
 */
function injectTestimonials() {
  const testimonials = contentData?.testimonials;
  if (!testimonials || testimonials.length === 0) return;

  const container = document.querySelector('[data-testimonials-container]');
  if (!container) return;

  testimonials.forEach(item => {
    const card = document.createElement('div');
    card.className = container.dataset.testimonialClass || 'min-w-[86%] sm:min-w-[420px] md:min-w-[450px] bg-surface-container-low p-6 sm:p-8 lg:p-10 rounded-xl snap-center italic';

    // Generate star rating HTML
    const starsHtml = Array(item.rating).fill('<span class="material-symbols-outlined text-yellow-500" style="font-variation-settings: \'FILL\' 1;">star</span>').join('');

    card.innerHTML = `
      <div class="mb-6 flex gap-1">
        ${starsHtml}
      </div>
      <p class="text-lg sm:text-xl font-headline text-emerald-900 mb-8 leading-relaxed">"${item.text}"</p>
      <div class="flex items-center gap-4 not-italic">
        <div class="w-12 h-12 bg-emerald-200 rounded-full flex items-center justify-center font-bold text-emerald-800">
          ${item.initials}
        </div>
        <div>
          <div class="font-bold">${item.author}</div>
          <div class="text-xs text-on-surface-variant uppercase tracking-widest">${item.badge}</div>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

/**
 * Inyecta contenido de las patologías — genera los cards dinámicamente desde content.json
 */
function injectPathologies() {
  const pathologies = contentData?.pathologies?.items;
  if (!pathologies) return;

  const grid = document.getElementById('pathologiesGrid');
  if (!grid) return;

  grid.innerHTML = pathologies.map((item) => {
    const isIcon = item.icon && !item.image;
    const mediaHtml = isIcon
      ? `<span class="material-symbols-outlined text-primary text-6xl">${item.icon}</span>`
      : `<img alt="${item.name}" class="w-28 h-28 object-contain" src="${item.image}" />`;

    return `
      <div class="p-8 sm:p-10 bg-surface-container-low rounded-[2rem] flex flex-col items-center text-center space-y-6 transition-colors editorial-shadow min-h-[280px] sm:min-h-[320px] justify-center hover-surface">
        <div class="w-32 h-32 sm:w-40 sm:h-40 rounded-[2rem] bg-surface-container flex items-center justify-center">
          ${mediaHtml}
        </div>
        <span class="font-headline text-2xl sm:text-3xl">${item.name}</span>
      </div>
    `;
  }).join("");
}

/**
 * Inyecta contenido de pricing cards
 */
function injectPricing() {
  const pricing = contentData?.pricing;
  if (!pricing) return;

  const cards = document.querySelectorAll('[data-pricing-card]');
  cards.forEach((card, index) => {
    if (pricing.items && pricing.items[index]) {
      const item = pricing.items[index];
      const titleEl = card.querySelector('[data-content^="pricing.items["]');
      const descEl = card.querySelector('[data-content$="description]"]');
      const priceEl = card.querySelector('[data-content$="price]"]');
      const ctaLink = card.querySelector('a[data-content-href]');
      const ctaText = card.querySelector('[data-content$=".cta"]');
      const detailsContainer = card.querySelector('.pricing-details');

      if (titleEl) titleEl.textContent = item.title;
      if (descEl) descEl.textContent = item.description;
      if (priceEl) priceEl.textContent = item.price;
      if (ctaLink) ctaLink.href = item.url;
      if (ctaText) ctaText.textContent = item.cta;

      // Actualizar detalles (detalles es un array)
      if (detailsContainer && item.details) {
        detailsContainer.innerHTML = item.details.map(d => `<p>${d}</p>`).join('');
      }
    }
  });
}

/**
 * Actualiza los textos del formulario de contacto
 */
function injectContactForm() {
  const fields = contentData?.contact?.form_fields;
  if (!fields) return;

  // Actualizar placeholders
  fields.forEach(field => {
    const input = document.querySelector(`[data-form-field="${field.name}"]`);
    if (input) {
      input.placeholder = field.placeholder;
      const label = input.closest('form')?.querySelector(`label[for="${field.name}"]`);
      if (label) label.textContent = field.label;
    }
  });
}

/**
 * Inyecta organizaciones en la sección experience
 */
function injectOrganizations() {
  const orgs = contentData?.experience?.organizations;
  if (!orgs) return;

  const cards = document.querySelectorAll('[data-organization]');
  cards.forEach((card, index) => {
    if (orgs[index]) {
      const org = orgs[index];
      const logoEl = card.querySelector('img[data-content-src]');
      const yearEl = card.querySelector('[data-content$=".year"]');
      const nameEl = card.querySelector('[data-content$="name]"]');

      if (logoEl) logoEl.src = org.logo;
      if (yearEl) yearEl.textContent = org.year;
      if (nameEl) nameEl.textContent = org.name;
    }
  });
}

/**
 * Actualiza los datos de contacto (teléfono, WhatsApp, Instagram, etc.)
 */
function injectContactInfo() {
  const contact = contentData?.contact;
  if (!contact) return;

  const phoneEl = document.querySelector('[data-content="contact.phone"]');
  const whatsappEl = document.querySelector('[data-content-href="contact.whatsapp"]');
  const instagramEl = document.querySelector('[data-content-href="contact.instagram"]');
  const socialHandleEl = document.querySelector('[data-content="contact.social_handle"]');
  const locationEl = document.querySelector('[data-content="contact.location"]');
  const labelTitleEl = document.querySelectorAll('[data-content="contact.label"], [data-content="contact.title"]');
  const descEl = document.querySelector('[data-content="contact.description"]');

  if (phoneEl) phoneEl.textContent = contact.phone;
  if (whatsappEl) whatsappEl.href = contact.whatsapp;
  if (instagramEl) instagramEl.href = contact.instagram;
  if (socialHandleEl) socialHandleEl.textContent = contact.social_handle;
  if (locationEl) locationEl.textContent = contact.location;
  labelTitleEl.forEach(el => el.textContent = contact.label);
  if (descEl) descEl.textContent = contact.description;
}

/**
 * Actualiza el pie de página
 */
function injectFooter() {
  const footer = contentData?.footer;
  if (!footer) return;

  const brandEl = document.querySelector('[data-content="footer.brand"]');
  const copyrightEl = document.querySelector('[data-content="footer.copyright"]');
  const linksContainer = document.querySelector('[data-footer-links]');

  if (brandEl) brandEl.textContent = footer.brand;
  if (copyrightEl) copyrightEl.textContent = footer.copyright;

  if (linksContainer && footer.links) {
    // Los links del footer ya están en el HTML, actualizar textos si es necesario
    const linkElements = linksContainer.querySelectorAll('a');
    linkElements.forEach((link, index) => {
      if (footer.links[index]) {
        link.textContent = footer.links[index].text;
        link.href = footer.links[index].anchor;
      }
    });
  }
}

/**
 * Función principal que inyecta todo el contenido
 */
function injectAllContent() {
  if (!contentData) return;

  // 1. Title y meta description
  document.title = contentData.site.title;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', contentData.site.description);

  // 2. Inyecciones básicas
  injectTextContent();
  injectImageSources();
  injectLinkHrefs();
  injectAnchorHrefs();
  injectIcons();

  // 3. Secciones específicas
  injectPhilosophyPillars();
  injectServices();
  injectPathologies();
  renderPathologies();
  injectPricing();
  injectOrganizations();
  injectContactInfo();
  injectFooter();
  injectContactForm();

  // 4. Testimonialesdinámicos
  injectTestimonials();

}

// Cargar JSON con cache-busting
async function loadContent() {
  try {
    // Cache-busting: agregar timestamp
    const timestamp = new Date().getTime();
    const response = await fetch(`content.json?v=${timestamp}`);
    if (!response.ok) throw new Error('No se pudo cargar content.json');
    contentData = await response.json();

    // Actualizar documento
    document.title = contentData.site.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', contentData.site.description);

    return contentData;
  } catch (error) {
    console.error('❌ Error cargando content.json:', error);
    return null;
  }
}

async function renderPathologies() {
  const grid = document.getElementById("pathologiesGrid");
  console.log("Grid encontrado:", !!grid);
  if (!grid) return;

  try {
    // Intentar desde GitHub raw (siempre tiene la última versión)
    // Si falla (ej: local), usar content.json local como fallback
    let content;
    try {
      const ghResponse = await fetch(
        "https://raw.githubusercontent.com/alexrilo/landing_marcos_agentes/main/content.json"
      );
      if (ghResponse.ok) {
        console.log("Contenido cargado desde GitHub");
        content = await ghResponse.json();
      }
    } catch {
      // Fallback local para desarrollo
      const localResponse = await fetch("content.json");
      content = await localResponse.json();
    }

    const items = content.pathologies?.items || [];

    grid.innerHTML = items.map((item) => {
      const isIcon = item.icon && !item.image;
      const mediaHtml = isIcon
        ? `<span class="material-symbols-outlined text-primary text-6xl">${item.icon}</span>`
        : `<img alt="${item.name}" class="w-28 h-28 object-contain" src="${item.image}" />`;

      return `
                <div class="p-8 sm:p-10 bg-surface-container-low rounded-[2rem] flex flex-col items-center text-center space-y-6 transition-colors editorial-shadow min-h-[280px] sm:min-h-[320px] justify-center hover-surface">
                    <div class="w-32 h-32 sm:w-40 sm:h-40 rounded-[2rem] bg-surface-container flex items-center justify-center">
                        ${mediaHtml}
                    </div>
                    <span class="font-headline text-2xl sm:text-3xl">${item.name}</span>
                </div>
            `;
    }).join("");
  } catch (error) {
    console.error("Error cargando patologías:", error);
  }
}

// ========== INICIALIZACIÓN DINÁMICA ==========

document.addEventListener("DOMContentLoaded", async () => {
  // Esperar a que cargue el JSON
  const content = await loadContent();
  if (!content) {
    console.error('No se pudo cargar el contenido. Usando valores por defecto.');
    return;
  }

  // Inyectar todo el contenido desde JSON
  injectAllContent();

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

});
