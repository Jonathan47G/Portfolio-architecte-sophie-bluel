import { fetchWorks } from "./appel_work.js";

const galleryModale = document.querySelector(".gallery-modale"); // Création de la const gallery pour la selectionné dans le html
const modaleAdmin = document.querySelector(".modale-admin");
const background = document.querySelector("body");
const boutonOuverture = document.querySelectorAll(".button_admin");
const boutonFermeture = document.querySelectorAll(".fermeture");
const modalePage1 = document.querySelector(".page1");
const modalePage2 = document.querySelector(".page2");

genererWorks();
closeModale();
openModale();

function modaleSuivPrec() {
  const buttonAjouterPhoto = document.querySelector(".ajouter-photo");
  const buttonPrecedent = document.querySelector(".icone-back");
  console.log(buttonAjouterPhoto);
  buttonAjouterPhoto.addEventListener("click", function () {
    modalePage2.style.display = "flex";
    modalePage1.style.display = "none";
  });
  buttonPrecedent.addEventListener("click", function () {
    modalePage2.style.display = "none";
    modalePage1.style.display = "flex";
    console.log("click");
  });
}

function openModale() {
  boutonOuverture.forEach((button) => {
    button.addEventListener("click", function () {
      modalePage2.style.display = "none";
      modaleAdmin.style.display = "flex";
      modalePage1.style.display = "flex";
      background.style.overflow = "hidden";
      modaleSuivPrec()   
    });
  });
}

function closeModale() {
  boutonFermeture.forEach((button) => {
    button.addEventListener("click", function () {
      modaleAdmin.style.display = "none";
      background.style.overflow = "auto";
    });
  });

  window.addEventListener("mousedown", function (event) {
    if (event.target === modaleAdmin) {
      modaleAdmin.style.display = "none";
      document.body.style.overflow = "auto"; // Rétablir la barre de défilement
    }
  });
}

async function genererWorks() {
  // Création d'une fonction pour créer les element
  fetchWorks();

  try {
    const works = await fetchWorks(); //Récupération du retour response.json avec la création d'une variable

    works.forEach((work) => {
      // Foreach parcourt la liste récupérer dans l'api
      const figure = document.createElement("figure"); // Création d'une variable, qui créer les figure (pour respecter le html)
      const img = document.createElement("img"); // Idem mais pour les image
      const figcaption = document.createElement("figcaption"); // Idem mais pour le figcaption
      const trashIcon = document.createElement("i");
      const trashButton = document.createElement("button"); // Création d'un élément de bouton
      img.src = work.imageUrl; // On indique la source des images
      img.alt = work.title; // L'alt de l'image, qui est le titre des works (toujours en se basant sur le html)
      figcaption.textContent = "éditer"; // Figcaption, qui représente les titre
      figure.id = `element-${work.id}`;
      trashIcon.classList.add("fa-solid", "fa-trash-can", "fa-xs");
      trashButton.classList.add("button-delete-work");
      figure.appendChild(img); // On lie img sur figure
      figure.appendChild(figcaption); // Idem
      figure.appendChild(trashIcon);
      figure.appendChild(trashButton);
      galleryModale.appendChild(figure); // Puis on lie les figure sur le conteneur principal, gallery.
      trashButton.appendChild(trashIcon);
    });
    deleteWorks();
  } catch (error) {
    console.log("Erreur lors de la generation des travaux :", error); // On gère l'état en cas d'erreur
  }
}

function deleteWorks() {
  const UserToken = sessionStorage.getItem("token");
  const buttonDeleteWork = document.querySelectorAll(".button-delete-work");

  buttonDeleteWork.forEach((trash) => {
    trash.addEventListener("click", async function (e) {
      e.preventDefault();
      e.stopPropagation();
      const workId = trash.parentElement.id.split("-")[1]; //ID du travail à partir de l'ID de la figure parente
      try {
        let response = await fetch(
          `http://localhost:5678/api/works/${workId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${UserToken}`,
            },
          }
        );
        console.log(response);
        alert(response);
        if (response.ok) {
          // Suppression réussie, mise à jour l'interface utilisateur
          genererWorks();
        } else {
          console.error("Erreur lors de la suppression du travail.");
        }
      } catch (error) {
        console.error("Erreur lors de la suppression du travail :", error);
      }
    });
  });
}


