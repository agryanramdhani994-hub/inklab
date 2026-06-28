const form = document.getElementById("registerForm");

console.log("Register JS Loaded");

form.addEventListener("submit", async function (e) {

    e.preventDefault();

    const fullname = document.getElementById("fullname").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    console.log(fullname, email, password);

    try {

        const response = await fetch("http://localhost:5000/api/auth/register", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                fullname,
                email,
                password
            })

        });

        const data = await response.json();

        alert(data.message);

        form.reset();

    } catch (err) {

        console.error(err);

        alert("Gagal koneksi ke server.");

    }

});