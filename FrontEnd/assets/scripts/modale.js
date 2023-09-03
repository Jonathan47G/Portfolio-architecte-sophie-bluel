import { fetchWorks } from './appel_work.js';

fetchWorks();
genererWorks();
openModale();
closeModale();

const galleryModale = document.querySelector(".gallery-modale"); // Création de la const gallery pour la selectionné dans le html
const modaleAdmin = document.querySelector(".modale-admin");
const background = document.querySelector('body');


async function genererWorks() {
    // Création d'une fonction pour créer les element
    try {
      const works = await fetchWorks(); //Récupération du retour response.json avec la création d'une variable
  
      works.forEach((work) => {
        console.log("work", work);
        // Foreach parcourt la liste récupérer dans l'api
        const figure = document.createElement("figure"); // Création d'une variable, qui créer les figure (pour respecter le html)
        const img = document.createElement("img"); // Idem mais pour les image
        const figcaption = document.createElement("figcaption"); // Idem mais pour le figcaption
        const trashIcon = document.createElement("i");
  
        img.src = work.imageUrl; // On indique la source des images
        img.alt = work.title; // L'alt de l'image, qui est le titre des works (toujours en se basant sur le html)
        figcaption.textContent = "éditer"; // Figcaption, qui représente les titre
        const categoryId = work.category.id;
        figure.classList.add(`category-${categoryId}`);
        trashIcon.classList.add('fa-solid', 'fa-trash-can', 'fa-xs');
  
        figure.appendChild(img); // On lie img sur figure
        figure.appendChild(figcaption); // Idem
        galleryModale.appendChild(figure); // Puis on lie les figure sur le conteneur principal, gallery.
        figure.appendChild(trashIcon);
      });
    } catch (error) {
      console.log("Erreur lors de la generation des travaux :", error); // On gère l'état en cas d'erreur
    };
  };

function openModale() {
    const boutonOuverture = document.querySelectorAll(".button_admin")
    boutonOuverture.forEach(button => {
        button.addEventListener ("click", function() {
            modaleAdmin.style.display = "flex";
            background.style.overflow = "hidden";
        });
    });
};

function closeModale() {
  const boutonFermeture = document.querySelector(".fermeture");

  boutonFermeture.addEventListener ("click", function() {
    modaleAdmin.style.display = "none";
    background.style.overflow = "auto";
  });
  window.addEventListener("mousedown", function (event) {
    if (event.target === modaleAdmin) {
        modaleAdmin.style.display = "none";
        document.body.style.overflow = "auto"; // Rétablir la barre de défilement
    }
});
}
