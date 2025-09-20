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

  const photographMedias = document.createElement("div");
  photographMedias.classList.add("photograph-medias");

  const folder = getFolderName(photographer.id);

  medias.forEach((media) => {
    const mediaModel = mediaTemplate(media, folder);
    const mediaCardDOM = mediaModel.getMediaDOM();
    photographMedias.appendChild(mediaCardDOM);
  });

  photographerHeader.after(photographMedias);
}

async function getMediaCardDOM() {}

async function init() {
  const data = await fetchData();
  displayData(data);
}

init();
