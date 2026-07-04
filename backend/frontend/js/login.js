const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {

        const response = await fetch("/api/auth/login", {

            method: "POST",
        
            headers: {
                "Content-Type": "application/json"
            },
        
            body: JSON.stringify({
                email,
                password
            })
        
        });

        const data = await response.json();

        if (data.success) {

            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            if (data.user.role === "admin") {

                window.location.href = "admin-dashboard.html";

            } else {

                 window.location.href = "index.html";

            }

        } else {

            alert(data.message);

        }

    } catch (err) {

        console.error(err);

        alert("Gagal terhubung ke server.");

    }

});