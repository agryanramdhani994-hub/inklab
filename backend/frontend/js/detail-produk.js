let produk = null;

const params = new URLSearchParams(window.location.search);
const id = Number(params.get("id"));

fetch("http://localhost:5000/api/products")

.then(response => response.json())

.then(data => {

    produk = data.find(item => item.id == id);

    if (!produk) {

        alert("Produk tidak ditemukan");
        return;

    }

    document.getElementById("detailNama").innerText =
        produk.product_name;

    document.getElementById("detailHarga").innerText =
        "Rp " + Number(produk.price).toLocaleString("id-ID");

    document.getElementById("detailDeskripsi").innerText =
        produk.description;

    document.getElementById("detailImage").src =
        `http://localhost:5000/uploads/${produk.image}`;

    // ==========================
    // Rating
    // ==========================

    const rating = document.getElementById("detailRating");

    if (rating) {

        rating.innerHTML = `
            <span class="text-warning fs-5">
                ★★★★★
            </span>

            <span class="text-muted ms-2">
                (4.9 / 5)
            </span>
        `;

    }

    // ==========================
    // Keunggulan Produk
    // ==========================

    const fitur = document.getElementById("detailFitur");

    if (fitur) {

        fitur.innerHTML = `

            <div class="mb-2">
                <i class="bi bi-palette-fill text-primary"></i>
                Gratis Design
            </div>

            <div class="mb-2">
                <i class="bi bi-award-fill text-success"></i>
                Bahan Premium
            </div>

            <div class="mb-2">
                <i class="bi bi-truck text-warning"></i>
                Estimasi 2-3 Hari
            </div>

            <div class="mb-2">
                <i class="bi bi-check-circle-fill text-success"></i>
                Bisa Custom Logo
            </div>

        `;

    }

});

function tambahKeKeranjang() {

    const jumlah = Number(
        document.getElementById("jumlah").value
    );

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const index = cart.findIndex(item => item.id === produk.id);

    if (index !== -1) {

        cart[index].jumlah += jumlah;

    } else {

        cart.push({

            id: produk.id,
            nama: produk.product_name,
            harga: Number(produk.price),
            jumlah: jumlah

        });

    }

    localStorage.setItem("cart", JSON.stringify(cart));

    alert("Produk berhasil ditambahkan ke keranjang!");

}

function beliSekarang() {

    const jumlah =
        Number(document.getElementById("jumlah").value);

    const checkout = [

        {
            id: produk.id,
            nama: produk.product_name,
            harga: Number(produk.price),
            jumlah: jumlah
        }

    ];

    localStorage.setItem(
        "checkoutCart",
        JSON.stringify(checkout)
    );

    window.location.href = "checkout.html";

}

// ==========================
// Tombol Jumlah
// ==========================

function tambahJumlah(){

    const input = document.getElementById("jumlah");

    input.value = Number(input.value) + 1;

}

function kurangJumlah(){

    const input = document.getElementById("jumlah");

    if(Number(input.value) > 1){

        input.value = Number(input.value) - 1;

    }

}