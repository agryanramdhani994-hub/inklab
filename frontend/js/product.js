let products = [];

const productContainer = document.getElementById("productContainer");

function formatHarga(harga) {
    return "Rp " + Number(harga).toLocaleString("id-ID");
}

function createProduct(product) {

    return `

    <div class="col-lg-4 col-md-6 mb-4">

        <div class="product-card shadow-sm h-100 border-0">

            <div class="product-image position-relative">

                <img
                    src="http://localhost:5000/uploads/${product.image}"
                    alt="${product.product_name}"
                    style="
                        width:100%;
                        height:250px;
                        object-fit:cover;
                        border-radius:10px 10px 0 0;
                    ">

                <span
                    class="badge bg-danger position-absolute"
                    style="
                        top:12px;
                        left:12px;
                        font-size:13px;
                    ">

                    🔥 Free Design

                </span>

            </div>

            <div class="product-body p-3 d-flex flex-column">

                <h5
                    style="
                        min-height:58px;
                        font-weight:600;
                    ">

                    ${product.product_name}

                </h5>

                <h3
                    class="product-price text-primary fw-bold mb-3">

                    ${formatHarga(product.price)}

                </h3>

                <div
                    class="text-warning mb-2"
                    style="font-size:18px;">

                    ★★★★★

                </div>

                <div
                    class="text-muted mb-3"
                    style="
                        font-size:14px;
                        line-height:1.8;
                    ">

                    <div>

                        <i class="bi bi-palette-fill text-primary"></i>

                        Gratis Design

                    </div>

                    <div>

                        <i class="bi bi-truck text-success"></i>

                        Estimasi 2-3 Hari

                    </div>

                </div>

                <a
                    href="detail-produk.html?id=${product.id}"
                    class="btn btn-primary w-100 mb-2">

                    <i class="bi bi-eye"></i>

                    Lihat Detail

                </a>

                <button
                    class="btn btn-outline-danger w-100 mb-2"
                    onclick="toggleWishlist(${product.id})">

                    <i
                        class="bi ${
                            isWishlist(product.id)
                            ? "bi-heart-fill text-danger"
                            : "bi-heart"
                        }">
                    </i>

                    Favorit

                </button>

                <button
                    class="btn btn-success w-100"
                    onclick="tambahKeKeranjang(${product.id})">

                    <i class="bi bi-cart-plus"></i>

                    Tambah ke Keranjang

                </button>

            </div>

        </div>

    </div>

    `;

}

fetch("http://localhost:5000/api/products")

.then(response => response.json())

.then(data => {

    products = data.map(product => ({

        ...product,
    
        category:
            product.product_name.toLowerCase().includes("plakat")
            ? "Plakat"
    
            : product.product_name.toLowerCase().includes("medali")
            ? "Medali"
    
            : product.product_name.toLowerCase().includes("neon")
            ? "Neon Box"
    
            : product.product_name.toLowerCase().includes("akrilik")
            ? "Acrylic"
    
            : product.product_name.toLowerCase().includes("nomor rumah")
            ? "Nomor Rumah"
    
            : "Lainnya"
    
    }));

    // Ambil keyword dari URL
    const params = new URLSearchParams(window.location.search);

    const keyword =
        params.get("q");

    let tampilProduk = products;

    if(keyword){

        tampilProduk = products.filter(product =>

            product.product_name
            .toLowerCase()
            .includes(keyword.toLowerCase())

        );

    }

    if (tampilProduk.length > 0) {

        productContainer.innerHTML =
            tampilProduk.map(createProduct).join("");
    
    } else {
    
        productContainer.innerHTML = `
    
        <div class="col-12 text-center py-5">
    
            <h3>😥 Produk tidak ditemukan</h3>
    
            <p class="text-muted">
    
                Tidak ada produk dengan kata kunci
    
                <strong>"${keyword}"</strong>
    
            </p>
    
            <a
                href="produk.html"
                class="btn btn-primary mt-3">
    
                Lihat Semua Produk
    
            </a>
    
        </div>
    
        `;
    
    }

});

function tambahKeKeranjang(id) {

    const produk = products.find(item => item.id === id);

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const index = cart.findIndex(item => item.id === id);

    if (index !== -1) {

        cart[index].jumlah++;

    } else {

        cart.push({

            id: produk.id,

            nama: produk.product_name,

            harga: Number(produk.price),

            jumlah: 1

        });

    }

    localStorage.setItem("cart", JSON.stringify(cart));

    alert("Produk berhasil ditambahkan ke keranjang!");

}

window.tambahKeKeranjang = tambahKeKeranjang;

const categoryFilters = document.querySelectorAll(".categoryFilter");

categoryFilters.forEach(filter => {

    filter.addEventListener("change", filterProducts);

});

function filterProducts() {

    const checkedCategories = [...document.querySelectorAll(".categoryFilter:checked")]
        .map(item => item.value);

    let filteredProducts = [...products];

    if (checkedCategories.length > 0) {

        filteredProducts = filteredProducts.filter(product =>
            checkedCategories.includes(product.category)
        );

    }

    productContainer.innerHTML =
        filteredProducts.map(createProduct).join("");

}

function isWishlist(id){

    let wishlist =
        JSON.parse(localStorage.getItem("wishlist")) || [];

    return wishlist.some(item => item.id === id);

}

function toggleWishlist(id){

    const produk =
        products.find(item => item.id === id);

    let wishlist =
        JSON.parse(localStorage.getItem("wishlist")) || [];

    const index =
        wishlist.findIndex(item => item.id === id);

    if(index !== -1){

        wishlist.splice(index,1);

    }else{

        wishlist.push({

            id: produk.id,
            nama: produk.product_name,
            harga: produk.price,
            image: produk.image

        });

    }

    localStorage.setItem(
        "wishlist",
        JSON.stringify(wishlist)
    );

    location.reload();

}