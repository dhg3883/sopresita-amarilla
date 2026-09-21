const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const soundtrack = $("#soundtrack");
const soundToggle = $("#soundToggle");
let musicIsPlaying = false;

function createStars() {
  const sky = $("#stars");
  const fragment = document.createDocumentFragment();
  const amount = window.innerWidth < 600 ? 55 : 95;

  for (let index = 0; index < amount; index += 1) {
    const star = document.createElement("i");
    star.className = "star";
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.setProperty("--size", `${(Math.random() * 2.2 + 0.7).toFixed(1)}px`);
    star.style.setProperty("--opacity", (Math.random() * 0.55 + 0.15).toFixed(2));
    star.style.setProperty("--duration", `${(Math.random() * 3 + 2).toFixed(1)}s`);
    star.style.setProperty("--delay", `${(Math.random() * -5).toFixed(1)}s`);
    fragment.appendChild(star);
  }

  sky.appendChild(fragment);
}

function setupRevealAnimations() {
  const elements = $$(".reveal");

  if (reducedMotion || !("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -40px" }
  );

  elements.forEach((element) => observer.observe(element));
}

function updateScrollUI() {
  const scrollTop = window.scrollY;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? Math.min(scrollTop / scrollable, 1) : 0;

  $("#progress").style.transform = `scaleX(${progress})`;
  $(".site-header").classList.toggle("is-scrolled", scrollTop > 32);
}

function syncSoundButton() {
  soundToggle.setAttribute("aria-pressed", String(musicIsPlaying));
  soundToggle.setAttribute("aria-label", musicIsPlaying ? "Pausar música" : "Reproducir música");
}

async function playMusic() {
  try {
    soundtrack.volume = 0.38;
    await soundtrack.play();
    musicIsPlaying = true;
    syncSoundButton();
  } catch (error) {
    musicIsPlaying = false;
    syncSoundButton();
  }
}

function pauseMusic() {
  soundtrack.pause();
  musicIsPlaying = false;
  syncSoundButton();
}

function toggleMusic() {
  if (musicIsPlaying) {
    pauseMusic();
  } else {
    playMusic();
  }
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("is-visible"), 2600);
}

function connectConstellation() {
  const artwork = $(".constellation-art");
  const button = $("#connectStars");
  const isConnected = artwork.classList.toggle("is-connected");

  button.querySelector("span").textContent = isConnected ? "Deseo guardado" : "Encender las estrellas";
  button.setAttribute("aria-pressed", String(isConnected));

  if (isConnected) {
    showToast("El cielo guardó un deseo para ti");
  }
}

function launchPetals() {
  const layer = $("#petalLayer");
  const colors = ["#ffdc4d", "#f4b51d", "#ffc72f", "#ffe873", "#e9a811"];
  const amount = reducedMotion ? 12 : 42;
  const fragment = document.createDocumentFragment();

  layer.replaceChildren();

  for (let index = 0; index < amount; index += 1) {
    const petal = document.createElement("i");
    petal.className = "falling-petal";
    petal.style.left = `${Math.random() * 100}%`;
    petal.style.setProperty("--w", `${Math.round(Math.random() * 10 + 9)}px`);
    petal.style.setProperty("--petal-color", colors[index % colors.length]);
    petal.style.setProperty("--fall-duration", `${(Math.random() * 3.2 + 4).toFixed(2)}s`);
    petal.style.setProperty("--fall-delay", `${(Math.random() * 1.8).toFixed(2)}s`);
    petal.style.setProperty("--drift", `${Math.round(Math.random() * 220 - 110)}px`);
    petal.style.setProperty("--spin", `${Math.round(Math.random() * 760 - 380)}deg`);
    fragment.appendChild(petal);
  }

  layer.appendChild(fragment);
  showToast("El cielo se llenó de flores amarillas");
  window.setTimeout(() => layer.replaceChildren(), 8500);
}

function setupLetter() {
  const dialog = $("#letterDialog");
  const openButton = $("#openLetter");
  const closeButton = $("#closeLetter");

  openButton.addEventListener("click", () => {
    dialog.showModal();
    document.body.classList.add("dialog-open");
  });

  closeButton.addEventListener("click", () => dialog.close());

  dialog.addEventListener("click", (event) => {
    const bounds = dialog.getBoundingClientRect();
    const outside =
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom;

    if (outside) dialog.close();
  });

  dialog.addEventListener("close", () => document.body.classList.remove("dialog-open"));
}

function setupParallax() {
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (!canHover || reducedMotion) return;

  const hero = $(".hero");
  const bouquet = $(".bouquet");
  const moon = $(".moon");

  hero.addEventListener("pointermove", (event) => {
    const x = event.clientX / window.innerWidth - 0.5;
    const y = event.clientY / window.innerHeight - 0.5;
    bouquet.style.setProperty("--mx", `${x * 12}px`);
    bouquet.style.setProperty("--my", `${y * 9}px`);
    moon.style.setProperty("--mx", `${x * -14}px`);
    moon.style.setProperty("--my", `${y * -10}px`);
  });
}

function openExperience() {
  $("#historia").scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
  if (!musicIsPlaying) playMusic();
}

function init() {
  createStars();
  setupRevealAnimations();
  setupLetter();
  setupParallax();
  updateScrollUI();

  $("#year").textContent = new Date().getFullYear();
  $("#openGift").addEventListener("click", openExperience);
  soundToggle.addEventListener("click", toggleMusic);
  $("#connectStars").addEventListener("click", connectConstellation);
  $("#bloomButton").addEventListener("click", launchPetals);
  window.addEventListener("scroll", updateScrollUI, { passive: true });

  window.setTimeout(() => $(".page-loader").classList.add("is-hidden"), 550);
}

document.addEventListener("DOMContentLoaded", init);
