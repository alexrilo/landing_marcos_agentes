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

function setBodyScrollLock(isLocked) {
    document.body.style.overflow = isLocked ? "hidden" : "";
}

function getFocusableElements(container) {
    return Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR)).filter((element) => {
        return !element.hasAttribute("hidden") && !element.closest("[hidden]");
    });
}

function trapFocus(container, event) {
    if (event.key !== "Tab") {
        return;
    }

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

function setPageInteractivity(isLocked) {
    const mainContent = document.getElementById("mainContent");
    const menuButton = document.getElementById("menuButton");

    if (mainContent) {
        mainContent.inert = isLocked;
        mainContent.setAttribute("aria-hidden", String(isLocked));
    }

    if (menuButton) {
        if (isLocked) {
            menuButton.setAttribute("tabindex", "-1");
        } else {
            menuButton.removeAttribute("tabindex");
        }
    }
}

function restoreFocus() {
    if (lastFocusedElement instanceof HTMLElement) {
        lastFocusedElement.focus();
    }

    lastFocusedElement = null;
}

function closeMenu({ returnFocus = true } = {}) {
    const sideMenu = document.getElementById("sideMenu");
    const menuOverlay = document.getElementById("menuOverlay");
    const menuButton = document.getElementById("menuButton");

    if (!sideMenu || !menuOverlay || !menuButton) {
        return;
    }

    sideMenu.classList.remove("open");
    sideMenu.setAttribute("aria-hidden", "true");
    sideMenu.hidden = true;
    sideMenu.inert = true;
    menuOverlay.classList.add("hidden");
    menuOverlay.hidden = true;
    menuButton.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
    setPageInteractivity(false);
    setBodyScrollLock(false);

    if (returnFocus) {
        restoreFocus();
    }
}

function openMenu() {
    const sideMenu = document.getElementById("sideMenu");
    const menuOverlay = document.getElementById("menuOverlay");
    const closeMenuBtn = document.getElementById("closeMenuBtn");
    const menuButton = document.getElementById("menuButton");

    if (!sideMenu || !menuOverlay || !menuButton) {
        return;
    }

    lastFocusedElement = document.activeElement;
    sideMenu.hidden = false;
    sideMenu.inert = false;
    sideMenu.classList.add("open");
    sideMenu.setAttribute("aria-hidden", "false");
    menuOverlay.hidden = false;
    menuOverlay.classList.remove("hidden");
    menuButton.classList.add("is-open");
    menuButton.setAttribute("aria-expanded", "true");
    setPageInteractivity(true);
    setBodyScrollLock(true);

    if (closeMenuBtn) {
        closeMenuBtn.focus();
    }
}

function toggleMenu() {
    const sideMenu = document.getElementById("sideMenu");
    const isOpen = sideMenu?.classList.contains("open");

    if (isOpen) {
        closeMenu();
        return;
    }

    openMenu();
}

function closeActiveModal() {
    if (!activeModal) {
        return;
    }

    activeModal.classList.add("hidden");
    activeModal.hidden = true;
    activeModal.setAttribute("aria-hidden", "true");
    setPageInteractivity(false);
    setBodyScrollLock(false);
    activeModal = null;
    restoreFocus();
}

function openModal(modalId, triggerElement) {
    const modal = document.getElementById(modalId);
    const modalContent = modal?.querySelector(".modal-content");

    if (!modal || !modalContent) {
        return;
    }

    lastFocusedElement = triggerElement ?? document.activeElement;
    modal.hidden = false;
    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
    setPageInteractivity(true);
    setBodyScrollLock(true);
    activeModal = modal;
    modalContent.focus();
}

document.addEventListener("DOMContentLoaded", () => {
    const menuButton = document.getElementById("menuButton");
    const closeMenuBtn = document.getElementById("closeMenuBtn");
    const menuOverlay = document.getElementById("menuOverlay");
    const menuLinks = document.querySelectorAll(".side-nav a");
    const accordionButton = document.getElementById("toggleFormaciones");
    const accordionContent = document.getElementById("formacionesContent");
    const modalTriggers = document.querySelectorAll(".open-modal");
    const modalCloseButtons = document.querySelectorAll(".close-modal");
    const allSections = document.querySelectorAll(".section, .trust-strip");
    const contactForm = document.getElementById("contactForm");
    const formFeedback = document.getElementById("formFeedback");

    menuButton?.addEventListener("click", toggleMenu);
    closeMenuBtn?.addEventListener("click", () => closeMenu());
    menuOverlay?.addEventListener("click", () => closeMenu());
    menuLinks.forEach((link) => {
        link.addEventListener("click", () => closeMenu({ returnFocus: false }));
    });

    if (accordionButton && accordionContent) {
        const accordionArrow = accordionButton.querySelector(".accordion-arrow");

        accordionButton.addEventListener("click", () => {
            const willOpen = accordionButton.getAttribute("aria-expanded") !== "true";
            accordionButton.setAttribute("aria-expanded", String(willOpen));
            accordionContent.hidden = !willOpen;
            accordionContent.classList.toggle("open", willOpen);

            if (accordionArrow) {
                accordionArrow.textContent = willOpen ? "−" : "+";
            }
        });
    }

    modalTriggers.forEach((trigger) => {
        trigger.addEventListener("click", () => {
            const modalId = trigger.getAttribute("data-modal");

            if (modalId) {
                openModal(modalId, trigger);
            }
        });
    });

    modalCloseButtons.forEach((button) => {
        button.addEventListener("click", closeActiveModal);
    });

    document.querySelectorAll(".modal-overlay").forEach((modal) => {
        modal.addEventListener("click", (event) => {
            if (event.target === modal) {
                closeActiveModal();
            }
        });
    });

    document.addEventListener("keydown", (event) => {
        const sideMenu = document.getElementById("sideMenu");
        const menuIsOpen = sideMenu?.classList.contains("open");

        if (event.key === "Escape") {
            if (activeModal) {
                closeActiveModal();
                return;
            }

            if (menuIsOpen) {
                closeMenu();
            }
        }

        if (activeModal) {
            const modalContent = activeModal.querySelector(".modal-content");

            if (modalContent) {
                trapFocus(modalContent, event);
            }
        } else if (menuIsOpen && sideMenu) {
            trapFocus(sideMenu, event);
        }
    });

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
        allSections.forEach((section) => {
            section.classList.add("reveal", "is-visible");
        });
    } else {
        const revealObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        revealObserver.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12
            }
        );

        allSections.forEach((section) => {
            section.classList.add("reveal");
            revealObserver.observe(section);
        });
    }

    if (window.emailjs) {
        emailjs.init("AG_yRzE18h_xu1dXe");
    }

    if (contactForm && formFeedback) {
        contactForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const submitButton = contactForm.querySelector('button[type="submit"]');
            const formData = {
                name: contactForm.querySelector('input[name="nombre"]').value,
                email: contactForm.querySelector('input[name="email"]').value,
                message: contactForm.querySelector('textarea[name="mensaje"]').value
            };

            submitButton.disabled = true;
            formFeedback.textContent = "Enviando mensaje...";
            formFeedback.className = "form-feedback";

            try {
                await emailjs.send("service_st2be2e", "template_zsfjio9", formData);
                contactForm.reset();
                formFeedback.textContent = "Mensaje enviado correctamente. Marcos te respondera lo antes posible.";
                formFeedback.classList.add("is-success");
            } catch (error) {
                formFeedback.textContent = "No se pudo enviar el mensaje. Prueba de nuevo o contacta por WhatsApp.";
                formFeedback.classList.add("is-error");
            } finally {
                submitButton.disabled = false;
            }
        });
    }
});
