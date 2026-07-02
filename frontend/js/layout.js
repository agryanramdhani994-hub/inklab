const user = JSON.parse(localStorage.getItem("user"));

const authMenu = document.getElementById("authMenu");

let fotoUser = `
    <i class="bi bi-person-circle"></i>
`;

if (user && user.photo) {

    fotoUser = `
        <img
            src="http://localhost:5000/uploads/${user.photo}"
            style="
                width:35px;
                height:35px;
                border-radius:50%;
                object-fit:cover;
                margin-right:8px;
            ">
    `;

}

if (user && authMenu) {

    authMenu.innerHTML = `

    <div
        style="
            display:flex;
            align-items:center;
            gap:15px;
        "
    >

    <a
        href="profile.html"
        style="
            color:white;
            margin-right:15px;
            font-weight:bold;
            text-decoration:none;
            display:flex;
            align-items:center;
        "
    >
        ${fotoUser}
        
        Halo, ${user.fullname}
    </a>

    <a href="#" id="logoutBtn" class="btn-daftar">
        Logout
    </a>

`;

document
    .getElementById("logoutBtn")
    .addEventListener("click", function(e){

        e.preventDefault();

        localStorage.removeItem("user");

        location.reload();

    });

}

// =======================
// CART BADGE
// =======================

const cartBadge =
    document.getElementById("cartBadge");

if(cartBadge){

    const cart =
        JSON.parse(localStorage.getItem("cart")) || [];

    let totalItem = 0;

    cart.forEach(item=>{

        totalItem += item.jumlah;

    });

    cartBadge.innerText = totalItem;

    if(totalItem === 0){

        cartBadge.style.display = "none";

    }

}

const wishlistBadge =
    document.getElementById("wishlistBadge");

if(wishlistBadge){

    const wishlist =
        JSON.parse(localStorage.getItem("wishlist")) || [];

    wishlistBadge.innerText = wishlist.length;

    if(wishlist.length === 0){

        wishlistBadge.style.display = "none";

    }

}

// ======================================
// REFRESH NAVBAR
// ======================================

function refreshNavbar() {

    console.log("refreshNavbar dipanggil");

    const cartBadge =
        document.getElementById("cartBadge");

    console.log(cartBadge);

    if (cartBadge) {

        const cart =
            JSON.parse(localStorage.getItem("cart")) || [];

        let total = 0;

        cart.forEach(item => {

            total += item.jumlah;

        });

        cartBadge.innerText = total;

        cartBadge.style.display =
            total > 0 ? "flex" : "none";

    }

    // -----------------
    // WISHLIST BADGE
    // -----------------

    const wishlistBadge =
        document.getElementById("wishlistBadge");

    if (wishlistBadge) {

        const wishlist =
            JSON.parse(localStorage.getItem("wishlist")) || [];

        wishlistBadge.innerText = wishlist.length;

        wishlistBadge.style.display =
            wishlist.length > 0 ? "flex" : "none";

    }

}

// ======================
// TOAST
// ======================

function showToast(message, type = "success") {

    const toastEl = document.getElementById("liveToast");
    const toastBody = document.getElementById("toastMessage");

    if (!toastEl || !toastBody) return;

    toastBody.innerText = message;

    toastEl.classList.remove(
        "text-bg-success",
        "text-bg-danger",
        "text-bg-warning",
        "text-bg-primary"
    );

    toastEl.classList.add("text-bg-" + type);

    const toast = new bootstrap.Toast(toastEl);

    toast.show();

}

window.showToast = showToast;
window.refreshNavbar = refreshNavbar;