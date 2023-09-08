const base_url = "http://localhost:5678/api";
const url_endPoint_Works = "/works";
const url_endPoint_Categories = "/categories";
const url_full_Works = `${base_url}${url_endPoint_Works}`;
const url_full_Categories = `${base_url}${url_endPoint_Categories}`;

const gallery = document.querySelector(".gallery"); // Création de la const gallery pour la selectionné dans le html
const conteneur_filtre = document.getElementById("portfolio");
const barre_filtre = document.querySelector(".barre-filtre");

genererCategories(); // On lance le prog
genererWorks(); // On lance le prog

async function genererCategories() {
  // Création d'une fonction pour créer nos boutons
  const categories = await fetchCategories(); //Récupération du retour response.json avec la création d'une variable
  const bouton_All = document.createElement("button"); // On créer un bouton all
  bouton_All.textContent = ("Tout");
  barre_filtre.appendChild(bouton_All);
  bouton_All.classList.add("category-0");
  conteneur_filtre.appendChild(barre_filtre); // Puis on lie la barre filtre à conteneur
  conteneur_filtre.insertBefore(barre_filtre, conteneur_filtre.children[1]); // On modifie l'odre, pour que la barre s'affiche en 2eme.
  bouton_All.addEventListener("click", function () {
    // Réinitialise la visibilité de tous les éléments
    const works = document.querySelectorAll(".gallery figure");
    works.forEach((work) => {
      work.style.display = "block"; // Affiche tous les éléments
    });
  });
  
  try {
    categories.forEach((category) => {
      // Foreach parcourt la liste récupérer dans l'api
      const button_name = document.createElement("button"); // Création d'une variable, qui créer les bouton
      button_name.textContent = category.name; // On indique des nom de bouton
      barre_filtre.appendChild(button_name); // On lie les buttons sur conteneur filtre ( portfolio)
      button_name.classList.add(`category-${category.id}`);
      button_name.addEventListener("click", function () {
        const categoryId = category.id;
        const worksToHide = document.querySelectorAll(".gallery figure:not(.category-" + categoryId + ")");
        const worksToShow = document.querySelectorAll(".category-" + categoryId);
        
        worksToHide.forEach((work) => {
          work.style.display = "none";
        });
        
        worksToShow.forEach((work) => {
          work.style.display = "block";
        });
      });
    });
  } catch (error) {
    console.log("Erreur lors de la generation des travaux :", error); // On gère l'état en cas d'erreur
  }
}

export async function fetchCategories() {
  try {
    const response = await fetch(url_full_Categories);
    if (!response.ok) {
      throw new Error("La requête n'a pas aboutie avec succés.");
    }
    return await response.json();
  } catch (error) {
    console.log("Erreur", error);
    throw error;
  }
}

async function genererWorks() {
  // Création d'une fonction pour créer les element
  try {
    const works = await fetchWorks(); //Récupération du retour response.json avec la création d'une variable

    works.forEach((work) => {
      // Foreach parcourt la liste récupérer dans l'api
      const figure = document.createElement("figure"); // Création d'une variable, qui créer les figure (pour respecter le html)
      const img = document.createElement("img"); // Idem mais pour les image
      const figcaption = document.createElement("figcaption"); // Idem mais pour le figcaption

      img.src = work.imageUrl; // On indique la source des images
      img.alt = work.title; // L'alt de l'image, qui est le titre des works (toujours en se basant sur le html)
      figcaption.textContent = work.title; // Figcaption, qui représente les titre
      const categoryId = work.category.id;
      figure.classList.add(`category-${categoryId}`);

      figure.appendChild(img); // On lie img sur figure
      figure.appendChild(figcaption); // Idem
      gallery.appendChild(figure); // Puis on lie les figure sur le conteneur principal, gallery.
    });
  } catch (error) {
    console.log("Erreur lors de la generation des travaux :", error); // On gère l'état en cas d'erreur
  }
}

export async function fetchWorks() {
  // Utilisation de fetch pour effectuer une requête GET vers l'URL complète
  try {
    const response = await fetch(url_full_Works);
    // Vérification si la réponse est "ok"
    if (!response.ok) {
      // Si la réponse n'est pas "ok", générer une exception avec un message d'erreur
      throw new Error("La requête n'a pas abouti avec succès.");
    }
    return await response.json();
  } catch (error) {
    // Si une erreur se produit à n'importe quel moment, capturer et gérer l'erreur
    console.error("Erreur :", error);
    throw error; // Propagation de l'erreur pour la gestion ultérieure
  }
}






