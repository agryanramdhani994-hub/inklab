// ===============================
// Nomor WhatsApp Admin
// ===============================

const nomorAdmin = "6289662394806";

// ===============================
// Ambil Produk dari Database
// ===============================

fetch("http://localhost:5000/api/products")

.then(res => res.json())

.then(products => {

    // Produk paling laris (6 pertama)
    const bestSeller = products.slice(0, 6);

    // Rekomendasi (6 berikutnya)
    const recommend = products.slice(6, 12);

    document.getElementById("bestSellerProducts").innerHTML =
        bestSeller.map(createCard).join("");

    document.getElementById("recommendProducts").innerHTML =
        recommend.map(createCard).join("");

    // Simpan untuk pencarian
    window.allProducts = products;

});

// ===============================
// Card Produk
// ===============================

function createCard(product){

    return `

<div class="col-lg-2 col-md-4 mb-4">

    <a
        href="detail-produk.html?id=${product.id}"
        style="
            text-decoration:none;
            color:inherit;
        ">

        <div class="product-card">

            <div class="product-image">

                <img
                    src="http://localhost:5000/uploads/${product.image}"
                    alt="${product.product_name}"
                    style="
                        width:100%;
                        height:220px;
                        object-fit:cover;
                        border-radius:10px;
                    ">

            </div>

            <div class="product-body">

                <h6>

                    ${product.product_name}

                </h6>

                <p class="product-price">

                    Rp ${Number(product.price).toLocaleString("id-ID")}

                </p>

                <p class="rating">

                    ★★★★★

                </p>

                <button
                    class="order-btn">

                    Order Sekarang

                </button>

            </div>

        </div>

    </a>

</div>

`;

}

// ===============================
// Order WhatsApp
// ===============================

function orderNow(nama, harga){

    const pesan =

`Halo Admin InkLab 👋

Saya ingin memesan produk berikut.

📦 Produk :
${nama}

💰 Harga :
Rp ${harga}

Mohon informasi lebih lanjut mengenai pemesanan.

Terima kasih.`;

    window.open(

        `https://wa.me/${nomorAdmin}?text=${encodeURIComponent(pesan)}`,

        "_blank"

    );

}

// ===============================
// Search
// ===============================

const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("keydown", function(e){

    if(e.key === "Enter"){

        const keyword = this.value.trim();

        if(keyword !== ""){

            window.location.href =
            `produk.html?q=${encodeURIComponent(keyword)}`;

        }

    }

});

searchInput.addEventListener("input", function(){

    const keyword = this.value.toLowerCase();

    if(!window.allProducts) return;

    const hasil =
        window.allProducts.filter(product=>

            product.product_name
            .toLowerCase()
            .includes(keyword)

        );

    document.getElementById("bestSellerProducts").innerHTML =
        hasil.slice(0,6).map(createCard).join("");

    document.getElementById("recommendProducts").innerHTML =
        hasil.slice(6,12).map(createCard).join("");

    const info =
        document.getElementById("searchResultInfo");

    if(keyword===""){

        info.innerHTML="";

        document.getElementById("bestSellerProducts").innerHTML =
            window.allProducts.slice(0,6).map(createCard).join("");

        document.getElementById("recommendProducts").innerHTML =
            window.allProducts.slice(6,12).map(createCard).join("");

        return;

    }

    if(hasil.length>0){

        info.innerHTML=
        `Menampilkan <b>${hasil.length}</b> hasil untuk "<b>${this.value}</b>"`;

    }else{

        info.innerHTML=
        `❌ Tidak ditemukan produk untuk "<b>${this.value}</b>"`;

    }

    document
        .getElementById("produk-laris")
        .scrollIntoView({

            behavior:"smooth"

        });

// ===============================
// Scroll To Top
// ===============================

const scrollBtn =
document.getElementById("scrollTopBtn");

if(scrollBtn){

    window.addEventListener("scroll",()=>{

        if(window.scrollY > 300){

            scrollBtn.style.display="block";

        }else{

            scrollBtn.style.display="none";

        }

    });

    scrollBtn.addEventListener("click",()=>{

        window.scrollTo({

            top:0,

            behavior:"smooth"

        });

    });

}

});