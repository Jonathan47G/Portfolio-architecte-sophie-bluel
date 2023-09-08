const url_loggin = "http://localhost:5678/api/users/login";

adminMod()
const form = document.querySelector("form");
form.addEventListener("submit", function(e) {
e.preventDefault();
runLogin();
});

async function runLogin() {
  try {
    const password = document.getElementById("MotDePasse").value
    const email = document.getElementById("emaillogin").value;
    const token = await login(email, password);

    if (token) {
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('userLoggedIn', 'true');
        alert("Connecté");
        window.location.href = '../FrontEnd/index.html'

    } else {
        alert("Invalide");
        const emailError = document.getElementById("emaillogin");
        const passwordError = document.getElementById("MotDePasse");

        emailError.classList.add("blink");
        passwordError.classList.add("blink");

        setTimeout(() => {
          emailError.classList.remove("blink");
          passwordError.classList.remove("blink");
      }, 2000);
    }
} catch (error) {
    alert("Échec de la connexion : " + error.message);
}
}

async function adminMod() {
  const userLoggedIn = sessionStorage.getItem('userLoggedIn');
  if (userLoggedIn === 'true') {
  const login_logout = document.querySelector(".login_logout");
  login_logout.textContent= ("Logout");
  const conteneur_filtre = document.querySelector(".barre-filtre");
  conteneur_filtre.style.visibility = "hidden";
  const modifier_button = document.querySelectorAll(".admin");
  modifier_button.forEach(button => {
    button.style.display = "flex";
  });
  
  login_logout.addEventListener("click", function(e) {
    e.preventDefault();
    sessionStorage.clear();
    location.reload();
    });

} else {  
  // L'utilisateur n'est pas connecté
  console.log('Utilisateur non connecté');
  localStorage.clear();
}
}

async function login(email, password ) {
  try {
    const logUsers = {
      email: email,
      password: password
    }
      const response = await fetch(url_loggin, {
          method: 'POST',
          body: JSON.stringify(logUsers),
          headers: {
              'Content-Type': 'application/json'
          },
      });

      if (response.status === 200) {
          console.log("200 OK");
          const responseData = await response.json();
          return responseData.token;
      } else if (response.status === 401) {
        console.log("401 Non autorisé");
      } else if (response.status === 404) {
        console.log("404 User not found");
      } else {
          throw new Error("Erreur inattendue");
      }
  } catch (error) {
      console.error("Erreur :", error);
      throw error;
  }
}
