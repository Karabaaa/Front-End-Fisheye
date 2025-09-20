function photographerTemplate(data) {
  const { name, city, country, tagline, price, portrait, id } = data;

  const picture = `./assets/photos/photographers/${portrait}`;

  function getUserCardDOM() {
    const article = document.createElement("article");
    const img = document.createElement("img");
    img.setAttribute("src", picture);
    const h2 = document.createElement("h2");
    const location = document.createElement("h3");
    const tag = document.createElement("p");
    tag.classList.add("tag");
    const rate = document.createElement("p");
    rate.classList.add("rate");
    h2.textContent = name;
    location.textContent = `${city}, ${country}`;
    tag.textContent = tagline;
    rate.textContent = `${price}€/jour`;
    const link = document.createElement("a");
    link.href = `photographer.html?id=${id}`;
    link.append(img, h2);
    article.append(link, location, tag, rate);

    return article;
  }
  return { name, city, country, tagline, price, portrait, id, getUserCardDOM };
}

function photographHeader(data) {
  const { name, city, country, tagline, price, portrait, id } = data;

  const picture = `./assets/photos/photographers/${portrait}`;

  function getHeaderDOM() {
    const photographHeader = document.querySelector(".photograph-header");
    const button = document.querySelector(".contact_button");
    const text = document.createElement("div");
    text.classList.add("textContent");

    const img = document.createElement("img");
    img.setAttribute("src", picture);
    const h2 = document.createElement("h2");
    const location = document.createElement("h3");
    const tag = document.createElement("p");
    tag.classList.add("tag");
    h2.textContent = name;
    location.textContent = `${city}, ${country}`;
    tag.textContent = tagline;

    text.append(h2, location, tag);
    photographHeader.append(text, button, img);

    return photographHeader;
  }
  return { name, city, country, tagline, price, portrait, id, getHeaderDOM };
}

function mediaTemplate(media, folder) {
  const { title, image, likes } = media;

  const picture = `./assets/photos/${folder}/${image}`;

  function getMediaDOM() {
    const photographMedia = document.createElement("div");
    photographMedia.classList.add("photograph-media");
    const img = document.createElement("img");
    img.setAttribute("src", picture);
    const mediaTitle = document.createElement("h3");
    mediaTitle.textContent = title;
    const like = document.createElement("p");
    like.textContent = likes;
    const textContainer = document.createElement("div");
    textContainer.classList.add("media-content");
    textContainer.append(mediaTitle, like);
    photographMedia.append(img, textContainer);

    return photographMedia;
  }
  return { getMediaDOM };
}

function getFolderName(photographerId) {
  switch (photographerId) {
    case 243:
      return "Mimi";
    case 930:
      return "Ellie Rose";
    case 82:
      return "Tracy";
    case 527:
      return "Nabeel";
    case 925:
      return "Rhode";
    case 195:
      return "Marcel";
    default:
      return "";
  }
}
