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
    const button = document.querySelector("main .contact_button");
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
  const { id, title, image, video, likes } = media;

  const picture = `./assets/photos/${folder}/${image ?? video}`;
  const mediaKey = `likes:${id}`;

  const loadLikeState = (key) => {
    return JSON.parse(localStorage.getItem(key)) || null;
  };
  const saveLikeState = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const saved = loadLikeState(mediaKey);
  let liked = saved?.liked ?? false;
  let likeCount = saved?.count ?? Number(likes || 0);

  const wrapper = document.createElement("article");
  wrapper.className = "photograph-media";

  let mediaElement;

  if (image) {
    const img = document.createElement("img");
    img.setAttribute("src", picture);
    img.setAttribute("alt", title ?? "Image");
    mediaElement = img;
  } else if (video) {
    const vid = document.createElement("video");
    const src = document.createElement("source");
    src.setAttribute("src", picture);
    vid.setAttribute("aria-label", `${title ?? "Vidéo"}`);
    vid.setAttribute("type", "video/mp4");
    vid.controls = true;
    vid.appendChild(src);
    mediaElement = vid;
  }

  mediaElement.classList.add("media");
  mediaElement.tabIndex = 0;
  mediaElement.addEventListener("click", (e) => {
    displayLightbox(mediaElement);

    const card = e.currentTarget.closest(".photograph-media");
    const index = Number(card.dataset.index);
    openLightboxAt(index);
  });

  const mediaTitle = document.createElement("h3");
  mediaTitle.textContent = title;

  const like = document.createElement("span");
  like.textContent = String(likeCount);

  const textContainer = document.createElement("div");
  textContainer.classList.add("media-content");

  const likesContainer = document.createElement("div");
  likesContainer.classList.add("likes-container");

  const heartButton = document.createElement("button");
  heartButton.classList.add("heart-button");
  heartButton.type = "button";
  heartButton.setAttribute(
    "aria-label",
    liked ? "Retirer le like" : "Ajouter un like"
  );
  heartButton.setAttribute("aria-pressed", String(liked));

  const heart = document.createElement("img");
  heart.setAttribute("src", "./assets/icons/heart.svg");
  heart.alt = "like";
  heart.classList.add("heart");
  heartButton.appendChild(heart);
  heartButton.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    liked = !liked;
    likeCount += liked ? 1 : -1;
    like.textContent = String(likeCount);
    saveLikeState(mediaKey, { liked, count: likeCount });
    document.dispatchEvent(
      new CustomEvent("likechange", {
        detail: { mediaId: id },
      })
    );
  });
  likesContainer.append(like, heartButton);
  textContainer.append(mediaTitle, likesContainer);
  wrapper.append(mediaElement, textContainer);

  return wrapper;
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
