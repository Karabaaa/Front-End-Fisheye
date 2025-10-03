function displayModal() {
  const modal = document.getElementById("contact_modal");
  modal.style.display = "flex";
}

function closeModal() {
  const modal = document.getElementById("contact_modal");
  modal.style.display = "none";
}

function submitForm(event) {
  event.preventDefault();

  const first = document.getElementById("first");
  const last = document.getElementById("last");
  const email = document.getElementById("email");
  const message = document.getElementById("message");
  const form = document.getElementById("contact-form");

  const firstV = first.value.trim();
  const lastV = last.value.trim();
  const emailV = email.value.trim();
  const messageV = message.value.trim();

  if (firstV && lastV && emailV && messageV) {
    console.log("Prénom:", firstV);
    console.log("Nom:", lastV);
    console.log("Email:", emailV);
    console.log("Message:", messageV);
    form.reset();
    closeModal();
    return;
  } else {
    alert("Vous devez remplir tous les champs pour valider le formulaire.");
  }
}
