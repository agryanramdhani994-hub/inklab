// =======================
// Logout
// =======================

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", function (e) {

        e.preventDefault();

        localStorage.removeItem("admin");

        window.location.href = "login.html";

    });

}