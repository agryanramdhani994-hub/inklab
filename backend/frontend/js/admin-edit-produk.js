const id = new URLSearchParams(window.location.search).get("id");

// =========================
// Ambil Data Produk
// =========================

function loadProduct() {

    fetch(`http://localhost:5000/api/products/${id}`)
    .then(res => res.json())
    .then(product => {

        document.getElementById("product_name").value = product.product_name;
        document.getElementById("description").value = product.description;
        document.getElementById("price").value = product.price;
        document.getElementById("stock").value = product.stock;
        document.getElementById("category_id").value = product.category_id;

        document.getElementById("preview").src =
            `http://localhost:5000/uploads/${product.image}`;

    });

}

// =========================
// Load Kategori
// =========================

fetch("http://localhost:5000/api/products/categories/all")
.then(res => res.json())
.then(categories => {

    const select = document.getElementById("category_id");

    select.innerHTML = "";

    categories.forEach(cat => {

        select.innerHTML += `
            <option value="${cat.id}">
                ${cat.category_name}
            </option>
        `;

    });

    // Setelah kategori selesai dimuat,
    // baru load data produk
    loadProduct();

});

// =========================
// Update Produk
// =========================

document
.getElementById("editForm")
.addEventListener("submit", function (e) {

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

    if (document.getElementById("image").files.length > 0) {

        formData.append(
            "image",
            document.getElementById("image").files[0]
        );

    }

    fetch(`http://localhost:5000/api/products/${id}`, {

        method: "PUT",
        body: formData

    })

    .then(res => res.json())

    .then(result => {

        alert(result.message);

        if (result.success) {

            window.location.href = "admin-produk.html";

        }

    })

    .catch(err => {

        console.log(err);
        alert("Gagal mengupdate produk.");

    });

});