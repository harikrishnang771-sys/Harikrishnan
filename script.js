// ===== Firebase Imports =====
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-analytics.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-database.js";

// ===== Firebase Config =====
const firebaseConfig = {
  apiKey: "AIzaSyCtwSx9B0PnctoJzfQk9FEwjH9OgI35jAM",
  authDomain: "harikrishnan-1.firebaseapp.com",
  databaseURL: "https://harikrishnan-1-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "harikrishnan-1",
  storageBucket: "harikrishnan-1.appspot.com",
  messagingSenderId: "751204686985",
  appId: "1:751204686985:web:980541ae8b85ba4986fa58",
  measurementId: "G-C32S89D31W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);

document.addEventListener('DOMContentLoaded', () => {

  // ===== Sidebar toggle =====
  const brand = document.querySelector('.brand');
  const navLinks = document.querySelector('.navlinks');
  if (brand && navLinks) {
    brand.addEventListener('click', () => navLinks.classList.toggle('show'));
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => navLinks.classList.remove('show'));
    });
  }

  // ===== Active nav highlighting =====
  const path = window.location.pathname.split("/").pop() || 'index.html';
  document.querySelectorAll('.navlinks a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === path);
  });

  // ===== Footer year =====
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // ===== RPS / NG toggle =====
  const rps = document.getElementById("rps");
  const ng = document.getElementById("ng");
  const rpsBtn = document.querySelector(".rps-show");
  const ngBtn = document.querySelector(".ng-show");

  if (rps && ng && rpsBtn && ngBtn) {
    rps.style.display = "none";
    ng.style.display = "none";
    rpsBtn.textContent = "Show";
    ngBtn.textContent = "Show";

    function togglePre(button, pre, otherPre, otherBtn) {
      if (pre.style.display === "none" || pre.style.display === "") {
        pre.style.display = "block";
        button.textContent = "Hide";
        otherPre.style.display = "none";
        otherBtn.textContent = "Show";
      } else {
        pre.style.display = "none";
        button.textContent = "Show";
      }
    }

    rpsBtn.addEventListener("click", () => togglePre(rpsBtn, rps, ng, ngBtn));
    ngBtn.addEventListener("click", () => togglePre(ngBtn, ng, rps, rpsBtn));
  }

  // ===== Gmail link =====
  const emailLink = document.getElementById("emailLink");
  if (emailLink) {
    emailLink.href = "mailto:harikrishnan@gmail.com";
    emailLink.textContent = "harikrishnan@gmail.com";
  }

  // ===== Firebase Contact Form =====
  const form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const message = document.getElementById("message").value.trim();
      const code = document.getElementById("code").value.trim();

      try {
        await push(ref(db, "contacts"), { name, email, message, code, timestamp: Date.now() });
        alert("✅ Message sent!");
        form.reset();
      } catch (err) {
        console.error("❌ Firebase error:", err);
        alert("⚠ Failed to send. Check console.");
      }
    });
  }

}); // DOMContentLoaded end

// ===== Canvas background =====
const canvas = document.getElementById('bgCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let W = canvas.width = innerWidth;
  let H = canvas.height = innerHeight;
  const DPR = Math.max(1, window.devicePixelRatio || 1);
  canvas.width = Math.floor(W * DPR);
  canvas.height = Math.floor(H * DPR);
  canvas.style.width = W + 'px';
  canvas.style.height = H + 'px';
  ctx.scale(DPR, DPR);

  const PARTICLE_COUNT = Math.max(60, Math.floor((W * H) / 25000));
  const particles = [];

  function rand(min, max) { return Math.random() * (max - min) + min; }
  function flow(x, y, t) {
    const nx = x / W, ny = y / H;
    return {
      vx: Math.sin(nx * 3 + t * 0.6) * 0.6 + Math.cos(ny * 6 - t * 0.4) * 0.4,
      vy: Math.cos(ny * 3 - t * 0.7) * 0.6 + Math.sin(nx * 6 + t * 0.5) * 0.4
    };
  }

  function resetParticles() {
    particles.length = 0;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: rand(0, W), y: rand(0, H),
        size: rand(1.2, 3.6),
        drift: rand(0.2, 1.2),
        life: rand(10, 40),
        hueOffset: Math.random() * 3
      });
    }
  }
  resetParticles();

  const gradientNodes = [
    { x: 0.1, y: 0.2, r: 0.45, c: [0, 180, 255] },
    { x: 0.8, y: 0.15, r: 0.4, c: [170, 70, 255] },
    { x: 0.35, y: 0.8, r: 0.5, c: [255, 100, 210] }
  ];

  let running = true;
  function resize() {
    W = canvas.width = innerWidth;
    H = canvas.height = innerHeight;
    canvas.width = Math.floor(W * DPR);
    canvas.height = Math.floor(H * DPR);
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.scale(DPR, DPR);
    resetParticles();
  }
  window.addEventListener('resize', () => { clearTimeout(window._bgResize); window._bgResize = setTimeout(resize, 120); });

  function drawGradient(t) {
    ctx.fillStyle = '#050610';
    ctx.fillRect(0, 0, W, H);
    for (let i = 0; i < gradientNodes.length; i++) {
      const n = gradientNodes[i];
      const a = 0.4 + 0.6 * Math.sin(t * 0.0002 * (i + 1) + i);
      const gx = (0.15 + 0.7 * (i / (gradientNodes.length - 1))) + Math.sin(t * 0.00013 * (i + 1)) * 0.06;
      const gy = 0.18 + Math.cos(t * 0.00011 * (i + 2)) * 0.06;
      const gr = Math.min(1.0, n.r * (0.9 + 0.15 * Math.sin(t * 0.00009 * (i + 3))));
      const grad = ctx.createRadialGradient(gx * W, gy * H, 0, gx * W, gy * H, gr * Math.max(W, H));
      const c = n.c;
      grad.addColorStop(0, `rgba(${c[0]},${c[1]},${c[2]},${0.12 + a * 0.22})`);
      grad.addColorStop(0.4, `rgba(${c[0]},${c[1]},${c[2]},${0.06 + a * 0.14})`);
      grad.addColorStop(1, 'rgba(3,8,23,0)');
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
    }
    ctx.globalCompositeOperation = 'source-over';
  }

  function drawParticles(t) {
    for (let p of particles) {
      const f = flow(p.x, p.y, t * 0.001);
      p.x += f.vx * p.drift;
      p.y += f.vy * p.drift * 0.9;
      p.life -= 0.03;
      if (p.x < -20) p.x = W + 20;
      if (p.x > W + 20) p.x = -20;
      if (p.y < -20) p.y = H + 20;
      if (p.y > H + 20) p.y = -20;
      if (p.life <= 0) { p.x = rand(0, W); p.y = rand(0, H); p.life = rand(8, 40); p.size = rand(1.2, 3.6); }
      const hue = 200 + 60 * Math.sin((t * 0.002) + p.hueOffset);
      const alpha = 0.08 + Math.max(0, Math.min(0.6, (p.life / 40)));
      ctx.beginPath();
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 16);
      g.addColorStop(0, `rgba(255,255,255,${0.18 * alpha})`);
      g.addColorStop(0.2, `hsla(${hue},100%,60%,${0.12 * alpha})`);
      g.addColorStop(0.5, `hsla(${(hue + 120) % 360},80%,55%,${0.06 * alpha})`);
      g.addColorStop(1, 'rgba(3,8,23,0)');
      ctx.fillStyle = g;
      ctx.fillRect(p.x - p.size * 16, p.y - p.size * 16, p.size * 32, p.size * 32);
    }
  }

  function drawLines(t) {
    ctx.save();
    ctx.globalAlpha = 0.06;
    ctx.strokeStyle = '#00eeff';
    ctx.lineWidth = 1;
    for (let i = 0; i < 6; i++) {
      const y = H * (i / 6) + Math.sin(t * 0.0004 + i) * 18;
      ctx.beginPath();
      ctx.moveTo(-50, y);
      ctx.quadraticCurveTo(W * 0.5, y + Math.sin(t * 0.0006 + i) * 40, W + 50, y);
      ctx.stroke();
    }
    ctx.restore();
  }

  function frame(now) {
    if (!running) return;
    drawGradient(now);
    drawParticles(now);
    drawLines(now);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  document.addEventListener('visibilitychange', () => {
    running = document.visibilityState === 'visible';
    if (running) requestAnimationFrame(frame);
  });
}

  // Run when page finishes loading
  window.addEventListener("load", function() {
    // Show popup after 2 seconds
    setTimeout(() => {
      document.getElementById("diwaliPopup").classList.add("active");
    }, 2000);

    // Close button event listener
    const closeBtn = document.getElementById("closePopupBtn");
    closeBtn.addEventListener("click", function() {
      document.getElementById("diwaliPopup").classList.remove("active");
    });
  });
