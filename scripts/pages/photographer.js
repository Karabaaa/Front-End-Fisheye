//Mettre le code JavaScript lié à la page photographer.html

async function fetchData() {
  const params = new URLSearchParams(window.location.search);
  const idParam = params.get("id");
  const photographerId = Number(idParam);
  //console.log(params, idParam, photographerId);

  const res = await fetch("./data/photographers.json");
  const data = await res.json();
  const photographer = data.photographers.find((p) => p.id === photographerId);
  const medias = data.media.filter((m) => m.photographerId === photographerId);

  return { photographer, medias };
}

async function displayData(data) {
  const { photographer, medias } = data;
  const header = photographHeader(photographer);
  const photographerHeader = header.getHeaderDOM();
  const sortSelect = document.getElementById("sort-select");
  const sortBar = document.querySelector(".sort-bar");
  const photographMedias = document.createElement("div");
  photographMedias.classList.add("photograph-medias");

  const folder = getFolderName(photographer.id);

  let totalLikes = computeTotalLikes(medias);
  const badge = createInfoBadge(photographer.price, totalLikes);
  document.addEventListener("likechange", () => {
    const newTotal = computeTotalLikes(medias);
    badge.setLikes(newTotal);
    const sortSelect = document.getElementById("sort-select");
    if (sortSelect?.value === "popularity") {
      render();
    }
  });

  function render() {
    const criterion = sortSelect.value;
    const sorted = sortMedias(medias, criterion);
    photographMedias.innerHTML = "";
    sorted.forEach((media, index) => {
      const card = mediaTemplate(media, folder);
      card.dataset.index = String(index);
      photographMedias.appendChild(card);
    });
    sortBar.after(photographMedias);

    buildGallery(sorted, folder);
  }

  sortSelect.addEventListener("change", render);
  render();
}

function computeTotalLikes(medias) {
  return medias.reduce((sum, m) => {
    const saved = JSON.parse(localStorage.getItem(`likes:${m.id}`) || "null");
    const count = saved?.count ?? Number(m.likes || 0);
    return sum + count;
  }, 0);
}

function createInfoBadge(price, initialLikes) {
  const badge = document.createElement("div");
  badge.className = "info-badge";

  const totalLikes = document.createElement("div");
  totalLikes.className = "total-likes";
  const heart = document.createElement("img");
  heart.src = "./assets/icons/heart-black.svg";
  heart.alt = "likes";
  const count = document.createElement("span");
  count.className = "likes-count";
  count.textContent = String(initialLikes);
  totalLikes.append(count, heart);

  const rate = document.createElement("div");
  rate.className = "rate";
  rate.textContent = `${price}€ / jour`;

  badge.append(totalLikes, rate);
  document.body.appendChild(badge);

  return {
    element: badge,
    setLikes(n) {
      count.textContent = String(n);
    },
    setPrice(p) {
      rate.textContent = `${p}€ / jour`;
    },
  };
}

function computeTitle(a, b) {
  const ta = (a.title || "").toLocaleLowerCase();
  const tb = (b.title || "").toLocaleLowerCase();
  if (ta < tb) return -1;
  if (ta > tb) return 1;
  return 0;
}

function currentLikes(media) {
  const saved = JSON.parse(localStorage.getItem(`likes:${media.id}`) || "null");
  return saved?.count ?? Number(media.likes || 0);
}

function sortMedias(medias, criterion) {
  const list = [...medias];
  switch (criterion) {
    case "popularity":
      return list.sort((a, b) => currentLikes(b) - currentLikes(a));
    case "date":
      return list.sort((a, b) => new Date(b.date) - new Date(a.date));
    case "title":
      return list.sort(computeTitle);
    default:
      return list;
  }
}

async function init() {
  const data = await fetchData();
  displayData(data);
}

init();
setupCustomSortDropdown();

function setupCustomSortDropdown() {
  const dropdown = document.querySelector(".dropdown");
  if (!dropdown) return;

  const btn = dropdown.querySelector(".dropdown__btn");
  const menu = dropdown.querySelector(".dropdown__menu");
  const hidden = dropdown.querySelector("#sort-select");

  // Ouverture / fermeture
  const open = () => dropdown.classList.add("is-open");
  const close = () => dropdown.classList.remove("is-open");

  btn.addEventListener("click", () => {
    const isOpen = dropdown.classList.contains("is-open");
    isOpen ? close() : open();
  });
  document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target)) close();
  });
  btn.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      open();
      menu.querySelector(".dropdown__item")?.focus();
    }
  });

  // Sélection d’une option
  dropdown.querySelectorAll(".dropdown__item").forEach((item) => {
    item.addEventListener("click", () => {
      const label = item.textContent.trim();
      const value = item.dataset.value;
      btn.textContent = label; // ← libellé maj
      hidden.value = value; // ← “valeur du select”
      hidden.dispatchEvent(new Event("change", { bubbles: true }));

      close(); // ← ferme le menu
      btn.focus();
    });
  });

  // Valeur initiale → déclenche un 1er tri
  if (hidden && hidden.value) {
    hidden.dispatchEvent(new Event("change", { bubbles: true }));
  }
}
