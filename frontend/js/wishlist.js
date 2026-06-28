let wishlist =
    JSON.parse(localStorage.getItem("wishlist")) || [];

const wishlistItems =
    document.getElementById("wishlistItems");

function tampilWishlist(){

    if(wishlist.length === 0){

        wishlistItems.innerHTML = `

        <div class="text-center py-5">

            <h3>❤️ Wishlist masih kosong</h3>

            <p>Tambahkan produk favorit terlebih dahulu.</p>

        </div>

        `;

        return;

    }

    wishlistItems.innerHTML =
        wishlist.map(createCard).join("");

}

function createCard(item){

    return `

    <div class="card shadow-sm mb-4">

        <div class="row g-0">

            <div class="col-md-3">

                <img
                    src="http://localhost:5000/uploads/${item.image}"
                    class="img-fluid rounded-start"
                    style="height:220px; width:100%; object-fit:cover;">

            </div>

            <div class="col-md-9">

                <div class="card-body">

                    <h4>${item.nama}</h4>

                    <h5 class="text-primary">

                        Rp ${Number(item.harga).toLocaleString("id-ID")}

                    </h5>

                    <button
                        class="btn btn-primary mt-3"
                        onclick="lihatDetail(${item.id})">

                        Lihat Detail

                    </button>

                    <button
                        class="btn btn-success mt-3 ms-2"
                        onclick="tambahKeKeranjang(${item.id})">

                        Tambah ke Keranjang

                    </button>

                    <button
                        class="btn btn-danger mt-3 ms-2"
                        onclick="hapusWishlist(${item.id})">

                        Hapus

                    </button>

                </div>

            </div>

        </div>

    </div>

    `;

}

function lihatDetail(id){

    window.location.href =
        `detail-produk.html?id=${id}`;

}

function hapusWishlist(id){

    wishlist =
        wishlist.filter(item => item.id !== id);

    localStorage.setItem(
        "wishlist",
        JSON.stringify(wishlist)
    );

    tampilWishlist();

}

function tambahKeKeranjang(id){

    const produk =
        wishlist.find(item => item.id === id);

    let cart =
        JSON.parse(localStorage.getItem("cart")) || [];

    const index =
        cart.findIndex(item => item.id === id);

    if(index !== -1){

        cart[index].jumlah++;

    }else{

        cart.push({

            id: produk.id,
            nama: produk.nama,
            harga: Number(produk.harga),
            jumlah: 1

        });

    }

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    alert("Produk berhasil ditambahkan ke keranjang!");

}

tampilWishlist();