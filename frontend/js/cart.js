let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartContainer = document.getElementById("cartItems");
const subtotalElement = document.getElementById("subtotal");
const totalElement = document.getElementById("total");

function tampilCart() {

    cartContainer.innerHTML = "";

    let subtotal = 0;

        // ==========================
    // Jika keranjang kosong
    // ==========================

    if (cart.length === 0) {

        cartContainer.innerHTML = `

        <div class="text-center py-5">

            <i
                class="bi bi-cart-x"
                style="
                    font-size:90px;
                    color:#b5b5b5;
                ">
            </i>

            <h3 class="mt-4">
                Keranjang Belanja Masih Kosong
            </h3>

            <p class="text-muted mb-4">
                Yuk pilih produk favoritmu terlebih dahulu.
            </p>

            <a
                href="produk.html"
                class="btn btn-primary btn-lg">

                <i class="bi bi-bag-fill"></i>

                Belanja Sekarang

            </a>

        </div>

        `;

        subtotalElement.innerHTML = "Rp 0";
        totalElement.innerHTML = "Rp 15.000";

        // Nonaktifkan tombol checkout
        checkoutBtn.disabled = true;
        checkoutBtn.classList.remove("btn-success");
        checkoutBtn.classList.add("btn-secondary");

        return;

    }

    cart.forEach((item, index) => {

        subtotal += item.harga * item.jumlah;

        cartContainer.innerHTML += `

        <div class="card mb-3 shadow-sm">

            <div class="card-body">

                <h5>${item.nama}</h5>

                <p>Harga : Rp ${item.harga.toLocaleString("id-ID")}</p>

                <div class="d-flex align-items-center gap-2">

                    <button
                        class="btn btn-outline-secondary"
                        onclick="kurang(${index})">

                        -

                    </button>

                    <span>${item.jumlah}</span>

                    <button
                        class="btn btn-outline-secondary"
                        onclick="tambah(${index})">

                        +

                    </button>

                </div>

                <p class="mt-3">

                    Subtotal :
                    <strong>

                        Rp ${(item.harga * item.jumlah).toLocaleString("id-ID")}

                    </strong>

                </p>

                <button
                    class="btn btn-danger"
                    onclick="hapus(${index})">

                    Hapus

                </button>

            </div>

        </div>

        `;
    });

    subtotalElement.innerHTML =
        "Rp " + subtotal.toLocaleString("id-ID");

    totalElement.innerHTML =
        "Rp " + (subtotal + 15000).toLocaleString("id-ID");

        // Aktifkan kembali tombol checkout
        checkoutBtn.disabled = false;
        checkoutBtn.classList.remove("btn-secondary");
        checkoutBtn.classList.add("btn-success");

}

function tambah(index){

    cart[index].jumlah++;

    localStorage.setItem("cart", JSON.stringify(cart));

    tampilCart();

}

function kurang(index){

    if(cart[index].jumlah > 1){

        cart[index].jumlah--;

    }

    localStorage.setItem("cart", JSON.stringify(cart));

    tampilCart();

}

function hapus(index){

    cart.splice(index,1);

    localStorage.setItem("cart", JSON.stringify(cart));

    tampilCart();

}

const checkoutBtn = 
document.getElementById("checkoutBtn");

tampilCart();

checkoutBtn.addEventListener("click", () => {

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {

        alert("Silakan login terlebih dahulu.");

        window.location.href = "login.html";

        return;

    }

    if (cart.length === 0) {

        alert("Keranjang masih kosong.");

        return;

    }

    // Simpan data checkout sementara
    localStorage.setItem("checkoutCart", JSON.stringify(cart));

    // Pindah ke halaman checkout
    window.location.href = "checkout.html";

});
