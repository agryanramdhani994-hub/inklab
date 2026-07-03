// =======================
// Load Semua User
// =======================

function loadUsers() {

    fetch("http://localhost:5000/api/admin/users")

    .then(res => res.json())

    .then(data => {

        const table = document.getElementById("userTable");

        table.innerHTML = "";

        data.forEach(user => {

            table.innerHTML += `

            <tr>

                <td>${user.id}</td>

                <td>${user.fullname}</td>

                <td>${user.email}</td>

                <td>

                    <select
                        class="form-select roleSelect"
                        data-id="${user.id}">

                        <option
                            value="admin"
                            ${user.role === "admin" ? "selected" : ""}>

                            admin

                        </option>

                        <option
                            value="user"
                            ${user.role === "user" ? "selected" : ""}>

                            user

                        </option>

                    </select>

                </td>

                <td>

                    ${new Date(user.created_at).toLocaleDateString("id-ID")}

                </td>

                <td>

                    <button
                        class="btn btn-success btn-sm saveRole"
                        data-id="${user.id}">

                        Role

                    </button>

                    <button
                        class="btn btn-warning btn-sm editUser"
                        data-id="${user.id}">

                        Edit

                    </button>

                    <button
                        class="btn btn-danger btn-sm deleteUser"
                        data-id="${user.id}">

                        Hapus

                    </button>

                </td>

            </tr>

            `;

        });

    })

    .catch(err => {

        console.log(err);

        alert("Gagal mengambil data user.");

    });

}

// =======================
// Simpan Role User
// =======================

document.addEventListener("click", function (e) {

    if (!e.target.classList.contains("saveRole")) return;

    const id = e.target.dataset.id;

    const role = document.querySelector(
        `.roleSelect[data-id="${id}"]`
    ).value;

    fetch(`http://localhost:5000/api/admin/users/${id}`, {

        method: "PUT",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify({

            role: role

        })

    })

    .then(res => res.json())

    .then(result => {

        alert(result.message);

        loadUsers();

    })

    .catch(err => {

        console.log(err);

        alert("Gagal mengubah role.");

    });

});

// =======================
// Buka Modal Edit
// =======================

document.addEventListener("click", function (e) {

    if (!e.target.classList.contains("editUser")) {
        return;
    }

    const id = e.target.dataset.id;

    fetch(`http://localhost:5000/api/admin/users/${id}`)

    .then(res => res.json())

    .then(user => {

        document.getElementById("editId").value = user.id;

        document.getElementById("editFullname").value = user.fullname;

        document.getElementById("editEmail").value = user.email;

        const modal = new bootstrap.Modal(
            document.getElementById("editUserModal")
        );

        modal.show();

    })

    .catch(err => {

        console.log(err);

        alert("Gagal mengambil data user.");

    });

});

// =======================
// Simpan Edit User
// =======================

document
.getElementById("saveEditUser")
.addEventListener("click", function () {

    const id = document.getElementById("editId").value;

    const fullname =
        document.getElementById("editFullname").value;

    const email =
        document.getElementById("editEmail").value;

    fetch(`http://localhost:5000/api/admin/users/edit/${id}`, {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            fullname,
            email
        })

    })

    .then(res => res.json())

    .then(result => {

        alert(result.message);

        const modal =
            bootstrap.Modal.getInstance(
                document.getElementById("editUserModal")
            );

        modal.hide();

        location.reload();

    })

    .catch(err => {

        console.log(err);

        alert("Gagal mengupdate user.");

    });

});

// =======================
// Hapus User
// =======================

document.addEventListener("click", function (e) {

    if (!e.target.classList.contains("deleteUser")) {
        return;
    }

    const id = e.target.dataset.id;

    if (!confirm("Yakin ingin menghapus user ini?")) {
        return;
    }

    fetch(`http://localhost:5000/api/admin/users/${id}`, {

        method: "DELETE"

    })

    .then(res => res.json())

    .then(result => {

        alert(result.message);

        location.reload();

    })

    .catch(err => {

        console.log(err);

        alert("Gagal menghapus user.");

    });

});

// =======================
// Jalankan
// =======================

loadUsers();