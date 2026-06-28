// =======================
// Ambil daftar kategori
// =======================

fetch("http://localhost:5000/api/products/categories/all")
.then(res => res.json())
.then(categories => {

    const select =
    document.getElementById("category_id");

    select.innerHTML =
    `<option value="">-- Pilih Kategori --</option>`;

    categories.forEach(category => {

        select.innerHTML += `
            <option value="${category.id}">
                ${category.category_name}
            </option>
        `;

    });

})
.catch(err => {

    console.log(err);

});

const form = document.getElementById("formProduk");

form.addEventListener("submit", function (e) {

    e.preventDefault();

    const formData = new FormData();

    formData.append(
        "product_name",
        document.getElementById("product_name").value
    );

    formData.append(
        "description",
        document.getElementById("description").value
    );

    formData.append(
        "price",
        document.getElementById("price").value
    );

    formData.append(
        "stock",
        document.getElementById("stock").value
    );

    formData.append(
        "category_id",
        document.getElementById("category_id").value
    );

    formData.append(
        "image",
        document.getElementById("image").files[0]
    );

    fetch("http://localhost:5000/api/products", {

        method: "POST",

        body: formData

    })

    .then(response => response.json())

    .then(result => {

        alert(result.message);

        if (result.success) {

            window.location.href = "admin-produk.html";

        }

    })

    .catch(err => {

        console.log(err);

        alert("Gagal menambahkan produk.");

    });

});