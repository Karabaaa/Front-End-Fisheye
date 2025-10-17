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
  const items = dropdown.querySelectorAll(".dropdown__item");

  let currentIndex = -1; // Index de l'option actuellement focusée

  // Ouverture / fermeture
  const open = () => {
    dropdown.classList.add("is-open");
    btn.setAttribute("aria-expanded", "true");
    currentIndex = -1;
    // Focus sur la première option
    if (items.length > 0) {
      currentIndex = 0;
      items[currentIndex].focus();
    }
  };

  const close = () => {
    dropdown.classList.remove("is-open");
    btn.setAttribute("aria-expanded", "false");
    currentIndex = -1;
  };

  // Navigation avec les flèches
  const navigateItems = (direction) => {
    if (items.length === 0) return;

    if (direction === "down") {
      currentIndex = Math.min(currentIndex + 1, items.length - 1);
    } else if (direction === "up") {
      currentIndex = Math.max(currentIndex - 1, 0);
    }

    items[currentIndex].focus();
  };

  // Sélection d'une option
  const selectItem = (item) => {
    const label = item.textContent.trim();
    const value = item.dataset.value;
    btn.textContent = label;
    hidden.value = value;
    hidden.dispatchEvent(new Event("change", { bubbles: true }));

    // Mettre à jour aria-selected
    items.forEach((i) => i.setAttribute("aria-selected", "false"));
    item.setAttribute("aria-selected", "true");

    close();
    btn.focus();
  };

  // Events souris (existants)
  btn.addEventListener("click", () => {
    const isOpen = dropdown.classList.contains("is-open");
    isOpen ? close() : open();
  });

  document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target)) close();
  });

  // Events clavier sur le bouton
  btn.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "Enter":
      case " ": // Espace
        e.preventDefault();
        const isOpen = dropdown.classList.contains("is-open");
        isOpen ? close() : open();
        break;
      case "ArrowDown":
        e.preventDefault();
        if (!dropdown.classList.contains("is-open")) {
          open();
        } else {
          navigateItems("down");
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        if (!dropdown.classList.contains("is-open")) {
          open();
        } else {
          navigateItems("up");
        }
        break;
      case "Escape":
        e.preventDefault();
        close();
        break;
    }
  });

  // Events clavier sur les options
  items.forEach((item, index) => {
    item.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "Enter":
        case " ": // Espace
          e.preventDefault();
          selectItem(item);
          break;
        case "ArrowDown":
          e.preventDefault();
          navigateItems("down");
          break;
        case "ArrowUp":
          e.preventDefault();
          navigateItems("up");
          break;
        case "Escape":
          e.preventDefault();
          close();
          btn.focus();
          break;
        case "Tab":
          // Laisser le comportement par défaut pour sortir du dropdown
          close();
          break;
      }
    });

    // Events souris (existants)
    item.addEventListener("click", () => selectItem(item));
  });

  // Valeur initiale → déclenche un 1er tri
  if (hidden && hidden.value) {
    hidden.dispatchEvent(new Event("change", { bubbles: true }));
  }
}
