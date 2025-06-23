export function initAuth() {
  document.getElementById("signInButton").addEventListener("click", () => {
    alert(
      "Funcionalidade de login simulada. Em uma aplicação real, isso integraria com o Google OAuth."
    );
    document.getElementById("signInButton").innerHTML =
      '<i class="material-icons">account_circle</i> Usuário Teste';
  });
}
