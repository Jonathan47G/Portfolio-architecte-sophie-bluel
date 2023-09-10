import { fetchWorks } from "./appel_work.js";
import { fetchCategories } from "./appel_work.js";
import { genererWorks } from "./appel_work.js";
import { nettoyageTravaux } from "./appel_work.js";

const galleryModale = document.querySelector(".gallery-modale"); // Création de la const gallery pour la selectionné dans le html
const modaleAdmin = document.querySelector(".modale-admin");
const background = document.querySelector("body");
const boutonOuverture = document.querySelector(".button_admin");
const boutonFermeture = document.querySelectorAll(".fermeture");
const modalePage1 = document.querySelector(".page1");
const modalePage2 = document.querySelector(".page2");

OuvertureDeLaModale();
genererTravauxModale();
closeModale();
recuperationCategorie();
upLoadImage();
envoieDesTravaux();

function OuvertureDeLaModale() {
  boutonOuverture.addEventListener("click", function () {
    modalePage2.style.display = "none";
    modaleAdmin.style.display = "flex";
    modalePage1.style.display = "flex";
    background.style.overflow = "hidden";
    modaleSuivPrec();
    remiseZeroImageUpload();
    gestionnaireInputDesChampFormulaire ();
  });
}

async function genererTravauxModale() {
  // Création d'une fonction pour créer les element
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
    trash.addEventListener("click", async (e) => {
      const workId = trash.parentElement.id.split("-")[1]; //ID du travail à partir de l'ID de la figure parente
      e.preventDefault();
      e.stopPropagation();
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
        e.preventDefault();
        e.stopPropagation();
        if (response.ok) {
          // Suppression réussie, mise à jour l'interface utilisateur
          const figureToDelete = document.getElementById(`element-${workId}`);
          if (figureToDelete) {
            figureToDelete.remove();
          } else {
            console.error(`Élément avec l'ID element-${workId} non trouvé.`);
          }
          nettoyageTravaux();
          await genererWorks();
        } else {
          console.error("Erreur lors de la suppression du travail.");
        }
      } catch (error) {
        console.error("Erreur lors de la suppression du travail :", error);
      }
    });
  });
}

function modaleSuivPrec() {
  const buttonAjouterPhoto = document.querySelector(".ajouter-photo");
  const buttonPrecedent = document.querySelector(".icone-back");
  buttonAjouterPhoto.addEventListener("click", function () {
    modalePage2.style.display = "flex";
    modalePage1.style.display = "none";
  });

  buttonPrecedent.addEventListener("click", function () {
    modalePage2.style.display = "none";
    modalePage1.style.display = "flex";
    remiseZeroImageUpload();
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

function remiseZeroImageUpload() {
  const uploadedImage = document.getElementById("uploaded-image");
  const conteneurContenuUpload = document.querySelector(
    ".image-remplisage-upload"
  );
  document.getElementById("title-ajout").value = ""; // Réinitialisez le champ de titre à une chaîne vide
  document.getElementById("file-input").value = ""; // Réinitialisez le champ de fichier à une chaîne vide
  document.getElementById("categorie-ajout").value = "";
  uploadedImage.src = "";
  uploadedImage.style.display = "none";
  conteneurContenuUpload.style.display = "flex";
}

async function recuperationCategorie() {
  const categorieOption = document.getElementById("categorie-ajout");
  const categories = await fetchCategories();
  categories.forEach((idcategorie) => {
    const optionCategorie = document.createElement("option");
    categorieOption.appendChild(optionCategorie);
    optionCategorie.textContent = idcategorie.name;
    optionCategorie.value = idcategorie.id;
  });
}

function upLoadImage() {
  const uploadButton = document.getElementById("upload-btn");
  const fileInput = document.getElementById("file-input");
  const uploadedImage = document.getElementById("uploaded-image");
  const conteneurContenuUpload = document.querySelector(
    ".image-remplisage-upload"
  );
  uploadButton.addEventListener("click", function () {
    fileInput.click();
  });
  // Récupérez le premier fichier sélectionné par l'utilisateur
  fileInput.addEventListener("change", function () {
    const uploadedFile = fileInput.files[0];
    if (uploadedFile) {
      const imageUrl = URL.createObjectURL(uploadedFile);
      uploadedImage.src = imageUrl;
      uploadedImage.style.display = "block";
      conteneurContenuUpload.style.display = "none";
    }
  });
}

async function envoieDesTravaux() {
  const buttonValider = document.querySelector(".button-valider");
  buttonValider.addEventListener("click", async function () {
    const fileInput = document.getElementById("file-input");
    const titreWorkAdd = document.getElementById("title-ajout").value;
    const categorieSelect = document.getElementById("categorie-ajout").value;
    const UserId = sessionStorage.getItem("token");
    const uploadedFile = fileInput.files[0];
    if (fileInput && titreWorkAdd && categorieSelect) {
      const donneeFormulaireEnvoie = new FormData();
      donneeFormulaireEnvoie.append("title", titreWorkAdd); 
      donneeFormulaireEnvoie.append("image", uploadedFile);
      donneeFormulaireEnvoie.append("category", categorieSelect);
      const apiUrl = "http://localhost:5678/api/works";

      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          body: donneeFormulaireEnvoie,
          headers: {
            Authorization: `Bearer ${UserId}`,
          },
        });
        if (response.ok) {
          alert("Travaux envoyé");
          nettoyageTravaux();
          genererWorks();
          remiseZeroImageUpload();
          nettoyageTravauxModale();
          genererTravauxModale();
        } else {
          console.error("Erreur lors de l'envoi des données à l'API");
        }
      } catch (error) {
        console.error("Erreur lors de l'envoi des données à l'API :", error);
      }
    } else {
      alert("Veuillez sélectionner une image, un titre et une catégorie");
    }
  });
}

function nettoyageTravauxModale() {
  while (galleryModale.firstChild) {
    galleryModale.removeChild(galleryModale.firstChild);
  }
}

function gestionnaireInputDesChampFormulaire () {
  const titreWorkAddInput = document.getElementById("title-ajout");
  const categorieSelectInput = document.getElementById("categorie-ajout");
  const fileInput = document.getElementById("file-input");
  titreWorkAddInput.addEventListener("input", changerCouleurButtonEnvoyer);
  categorieSelectInput.addEventListener("input", changerCouleurButtonEnvoyer);
  fileInput.addEventListener("input", changerCouleurButtonEnvoyer);
}

function changerCouleurButtonEnvoyer () {
  const titreWorkAddInput = document.getElementById("title-ajout");
  const titreWorkAdd = titreWorkAddInput.value.trim();
  const categorieSelectInput = document.getElementById("categorie-ajout");
  const categorieSelect = categorieSelectInput.value.trim();
  const fileInput = document.getElementById("file-input");
  const fichierSelectionne = fileInput.files[0];
  const buttonValider = document.querySelector(".button-valider");

  if (titreWorkAdd !== "" && categorieSelect !== "" && fichierSelectionne) {
    buttonValider.style.backgroundColor = "#1D6154";
  } else {
    buttonValider.style.backgroundColor = ""; 
  }
}

