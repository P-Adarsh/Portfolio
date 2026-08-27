/* =========================================================
   PORTFOLIO SCRIPT
   Sections: Nav, Scroll Progress, Network Canvas, Typewriter,
             Scroll Reveal, Active Link, Contact Form, Back-to-top
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =======================================================
     1. DECLARE ALL DOM REFERENCES FIRST
     Every element and NodeList that a function below reads
     must exist before onScroll() can ever be called — this
     is what fixes the "Cannot access 'sections' before
     initialization" error (a temporal-dead-zone bug caused
     by calling onScroll() ahead of the `sections` const).
     ======================================================= */
  const yearEl = document.getElementById("year");
  const nav = document.getElementById("nav");
  const scrollProgress = document.getElementById("scrollProgress");
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  const backToTop = document.getElementById("backToTop");
  const sections = document.querySelectorAll("section[id]");
  const navLinkEls = document.querySelectorAll(".nav-link[href^='#']");

  /* ---------- Footer year ---------- */
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* =======================================================
     2. DEFINE FUNCTIONS (no calls yet — just declarations)
     ======================================================= */

  /* Active nav-link highlighting based on scroll position */
  function updateActiveLink() {
    let currentId = sections[0] ? sections[0].id : "";
    const scrollPos = window.scrollY + 150;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = section.id;
      }
    });

    navLinkEls.forEach((link) => {
      link.classList.toggle("active-link", link.getAttribute("href") === "#" + currentId);
    });
  }

  /* Show/hide the floating back-to-top button */
  function toggleBackToTop() {
    backToTop.classList.toggle("show", window.scrollY > 500);
  }

  /* Sticky nav background + scroll progress bar, on every scroll tick */
  function onScroll() {
    const scrollY = window.scrollY;
    nav.classList.toggle("scrolled", scrollY > 40);

    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
    scrollProgress.style.width = pct + "%";

    updateActiveLink();
    toggleBackToTop();
  }

  /* =======================================================
     3. ATTACH LISTENERS, THEN RUN THE INITIAL CALL
     ======================================================= */
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll(); // safe now — every value onScroll touches is already declared above

  /* ---------- Mobile nav toggle ---------- */
  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    navToggle.classList.toggle("open", isOpen);
    navToggle.setAttribute("aria-expanded", isOpen);
  });

  /* Close mobile menu after clicking any nav link */
  navLinks.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      navToggle.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  /* ---------- Scroll reveal (IntersectionObserver) ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );
  revealEls.forEach((el) => revealObserver.observe(el));

  /* ---------- Typewriter effect for hero role ---------- */
  const typewriterEl = document.getElementById("typewriter");
  const roles = [
    "Computer Science Engineering Student",
    "AI & Machine Learning Enthusiast",
    "Data Analytics Practitioner",
    "Aspiring Software Developer"
  ];
  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function typeLoop() {
    if (!typewriterEl) return;
    const current = roles[roleIndex];

    if (!deleting) {
      charIndex++;
      typewriterEl.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(typeLoop, 1600);
        return;
      }
    } else {
      charIndex--;
      typewriterEl.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }
    setTimeout(typeLoop, deleting ? 35 : 60);
  }
  typeLoop();

  /* ---------- Back to top button click handler ---------- */
  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ---------- Contact form validation (client-side only) ---------- */
  const form = document.getElementById("contactForm");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const messageInput = document.getElementById("message");
  const formSuccess = document.getElementById("formSuccess");

  const errors = {
    name: document.getElementById("nameError"),
    email: document.getElementById("emailError"),
    message: document.getElementById("messageError"),
  };

  function validateField(input, errorEl, message, testFn) {
    const valid = testFn(input.value.trim());
    input.classList.toggle("invalid", !valid);
    errorEl.textContent = valid ? "" : message;
    return valid;
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    formSuccess.classList.remove("show");

    const validName = validateField(nameInput, errors.name, "Please enter your name.", (v) => v.length >= 2);
    const validEmail = validateField(emailInput, errors.email, "Please enter a valid email.", isValidEmail);
    const validMessage = validateField(messageInput, errors.message, "Message should be at least 10 characters.", (v) => v.length >= 10);

    if (validName && validEmail && validMessage) {
      formSuccess.classList.add("show");
      form.reset();
      setTimeout(() => formSuccess.classList.remove("show"), 5000);
    }
  });

  [nameInput, emailInput, messageInput].forEach((input) => {
    input.addEventListener("input", () => {
      input.classList.remove("invalid");
    });
  });

  /* ---------- Hero profile image with fallback ---------- */
  const profileImage = document.getElementById("profileImage");
  const profileFallback = document.getElementById("profileFallback");

  if (profileImage) {
    profileImage.addEventListener("load", function () {
      profileImage.style.display = "block";
      if (profileFallback) {
        profileFallback.classList.remove("show");
      }
    });

    profileImage.addEventListener("error", function () {
      profileImage.style.display = "none";
      if (profileFallback) {
        profileFallback.classList.add("show");
      }
    });

    // Race-condition guard: if the image finished loading (or failed)
    // before this script ran, the "load"/"error" events above will
    // never fire again. img.complete tells us the browser is already
    // done with it either way, so we resolve the state immediately.
    if (profileImage.complete) {
      if (profileImage.naturalWidth > 0) {
        profileImage.style.display = "block";
      } else {
        profileImage.style.display = "none";
        if (profileFallback) {
          profileFallback.classList.add("show");
        }
      }
    }
  }

  /* ---------- Hero network canvas animation ---------- */
  const canvas = document.getElementById("networkCanvas");
  if (canvas && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const ctx = canvas.getContext("2d");
    let width, height, nodes;

    const NODE_COUNT_DESKTOP = 55;
    const NODE_COUNT_MOBILE = 26;
    const LINK_DIST = 130;

    function resize() {
      const hero = canvas.parentElement;
      width = canvas.width = hero.offsetWidth;
      height = canvas.height = hero.offsetHeight;
      initNodes();
    }

    function initNodes() {
      const count = width < 760 ? NODE_COUNT_MOBILE : NODE_COUNT_DESKTOP;
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
      }));
    }

    function step() {
      ctx.clearRect(0, 0, width, height);

      // update + draw nodes
      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        ctx.beginPath();
        ctx.arc(n.x, n.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(79, 209, 197, 0.65)";
        ctx.fill();
      });

      // draw links
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK_DIST) {
            const opacity = (1 - dist / LINK_DIST) * 0.35;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(79, 209, 197, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(step);
    }

    window.addEventListener("resize", resize);
    resize();
    requestAnimationFrame(step);
  }

});
