function displayLightbox() {
  const lightbox = document.getElementById("lightbox");
  lightbox.style.display = "flex";
  lightbox.setAttribute("aria-hidden", "false");
}

function closeLightbox() {
  const lightbox = document.getElementById("lightbox");
  lightbox.style.display = "none";
  lightbox.setAttribute("aria-hidden", "true");
}

let gallery = [];
let currentIndex = 0;

function buildGallery(medias, folder) {
  gallery = medias.map((m) => {
    const isImage = !!m.image;
    return {
      type: isImage ? "image" : "video",
      src: isImage
        ? `./assets/photos/${folder}/${m.image}`
        : `./assets/photos/${folder}/${m.video}`,
      title: m.title || "",
    };
  });
}

function openLightboxAt(index) {
  if (!gallery.length) return;
  currentIndex = ((index % gallery.length) + gallery.length) % gallery.length;
  displayLightbox();
  renderLightbox();
}

function previous() {
  if (!gallery.length) return;
  pauseVideoIfAny();
  currentIndex = (currentIndex - 1 + gallery.length) % gallery.length;
  renderLightbox();
}

function next() {
  if (!gallery.length) return;
  pauseVideoIfAny();
  currentIndex = (currentIndex + 1) % gallery.length;
  renderLightbox();
}

function pauseVideoIfAny() {
  const video = document.querySelector("#lightbox .picture video");
  if (video && !video.paused) {
    video.pause();
  }
}

function renderLightbox() {
  const container = document.querySelector("#lightbox .picture");

  if (!container || !gallery.length) return;

  const item = gallery[currentIndex];

  container.innerHTML = "";

  const wrap = document.createElement("div");
  wrap.className = "media-wrap";

  const box = document.createElement("div");
  box.className = "media-box";

  if (item.type === "image") {
    const img = document.createElement("img");
    img.src = item.src;
    img.alt = item.title || "Photo";
    box.appendChild(img);
  } else {
    const video = document.createElement("video");
    video.src = item.src;
    video.title = item.title || "Vidéo";
    video.controls = true;
    video.autoplay = true;
    box.appendChild(video);
  }
  wrap.appendChild(box);

  if (item.title) {
    const caption = document.createElement("p");
    caption.textContent = item.title;
    caption.className = "lb-caption";
    wrap.appendChild(caption);
  }

  container.appendChild(wrap);
}
