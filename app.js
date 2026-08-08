// ===== MENU TOGGLE =====
let menuIcon = document.querySelector("#menu-icon");
let navbar = document.querySelector(".navbar");

menuIcon.onclick = () => {
  menuIcon.classList.toggle("bx-x");
  navbar.classList.toggle("active");
};

// ===== ACTIVE NAV ON SCROLL =====
let sections = document.querySelectorAll("section");
let navLinks = document.querySelectorAll("header nav a");

window.onscroll = () => {
  sections.forEach((sec) => {
    let top = window.scrollY;
    let offset = sec.offsetTop - 150;
    let height = sec.offsetHeight;
    let id = sec.getAttribute("id");

    if (top >= offset && top < offset + height) {
      navLinks.forEach((link) => link.classList.remove("active"));
      document.querySelector(`header nav a[href*="${id}"]`)?.classList.add("active");
    }
  });

  // Sticky header
  let header = document.querySelector("header");
  header.classList.toggle("sticky", window.scrollY > 100);

  // Close menu on scroll
  menuIcon.classList.remove("bx-x");
  navbar.classList.remove("active");

  // Scroll progress bar
  const scrollProgress = document.getElementById("scroll-progress");
  const scrollTop = document.documentElement.scrollTop;
  const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;
  scrollProgress.style.width = scrollPercent + "%";

  // Trigger skill bars when about section is visible
  animateSkillBars();
};

// ===== SKILL BAR ANIMATION =====
let skillsAnimated = false;

function animateSkillBars() {
  if (skillsAnimated) return;
  const aboutSection = document.querySelector(".about");
  if (!aboutSection) return;

  const rect = aboutSection.getBoundingClientRect();
  if (rect.top < window.innerHeight * 0.8) {
    document.querySelectorAll(".skill-progress").forEach((bar) => {
      bar.classList.add("animated");
    });
    skillsAnimated = true;
  }
}

// Run once on load in case user is already scrolled
animateSkillBars();

// ===== SCROLL REVEAL =====
ScrollReveal({
  distance: "60px",
  duration: 1800,
  delay: 200,
  easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
});

ScrollReveal().reveal(".home-content, .heading, .section-subtitle", { origin: "top" });
ScrollReveal().reveal(".home-img, .project-box, .contact-form, .contact-item", { origin: "bottom" });
ScrollReveal().reveal(".home-content h1, .about-img", { origin: "left" });
ScrollReveal().reveal(".home-content p, .about-content, .contact-info-title, .contact-info-subtitle", { origin: "right" });

// ===== TYPED.JS =====
const typed = new Typed(".multiple-text", {
  strings: ["Frontend Developer", "Web Developer", "React.js Developer", "UI/UX Enthusiast"],
  typeSpeed: 80,
  backSpeed: 60,
  backDelay: 1500,
  loop: true,
});

// ===== PARTICLES CANVAS =====
(function () {
  const canvas = document.getElementById("particles-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let particles = [];
  const PARTICLE_COUNT = 60;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resize();
  window.addEventListener("resize", resize);

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.5 + 0.1;
      // Random color: violet or cyan
      this.color = Math.random() > 0.5
        ? `rgba(124, 58, 237, ${this.opacity})`
        : `rgba(6, 182, 212, ${this.opacity})`;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
        this.reset();
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  // Init particles
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }

  // Draw connecting lines between nearby particles
  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const alpha = (1 - dist / 120) * 0.12;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(124, 58, 237, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    drawConnections();
    requestAnimationFrame(animate);
  }

  animate();
})();

// ===== TOAST HELPER =====
function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  const icon = document.getElementById("toast-icon");
  const msg = document.getElementById("toast-msg");

  icon.className = type === "success" ? "bx bx-check-circle" : "bx bx-error-circle";
  msg.textContent = message;

  toast.className = `toast ${type}`;
  // Force reflow so transition triggers fresh each time
  void toast.offsetWidth;
  toast.classList.add("show");

  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.classList.remove("show");
  }, 4000);
}

// ===== EMAIL FORM =====
document.getElementById("contact-form").addEventListener("submit", function (e) {
  e.preventDefault(); // ← stops page reload

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const subject = document.getElementById("subject").value.trim();
  const message = document.getElementById("message").value.trim();

  if (!name || !email || !subject || !message) {
    showToast("Please fill in all fields before sending.", "error");
    return;
  }

  const btn = document.getElementById("submit-btn");
  btn.disabled = true;
  btn.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i> Sending...';

  const params = { name, email, subject, message };

  emailjs
    .send("service_fu8ihxm", "template_wm9gmt9", params)
    .then(() => {
      showToast("Message sent! I'll get back to you soon. 🎉", "success");
      document.getElementById("contact-form").reset();
    })
    .catch((err) => {
      console.error("EmailJS error:", err);
      showToast("Failed to send. Please try again or email me directly.", "error");
    })
    .finally(() => {
      btn.disabled = false;
      btn.innerHTML = '<i class="bx bx-send"></i> Send Message';
    });
});
