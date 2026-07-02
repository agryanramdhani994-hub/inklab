// ==========================
// User & Cart
// ==========================

const user = JSON.parse(localStorage.getItem("user"));
const cart = JSON.parse(localStorage.getItem("cart")) || [];

if (!user) {

    alert("Silakan login.");

    window.location.href = "login.html";

}

// ==========================
// Ambil profil
// ==========================

fetch(`http://localhost:5000/api/auth/profile/${user.id}`)
.then(res => res.json())
.then(data => {

    document.getElementById("fullname").value = data.fullname;
    document.getElementById("phone").value = data.phone || "";
    document.getElementById("address").value = data.address || "";

});

// ==========================
// Total
// ==========================

let total = 0;

cart.forEach(item => {

    total += item.harga * item.jumlah;

});

document.getElementById("checkoutTotal").innerHTML =
"Rp " + (total + 15000).toLocaleString("id-ID");

// ==========================
// Buat Pesanan
// ==========================

document
.getElementById("buatPesanan")
.addEventListener("click", () => {

    console.log("BUTTON DIKLIK");

    const btn = document.getElementById("buatPesanan");

    btn.disabled = true;

    btn.innerHTML = "Memproses...";

    const fullname =
document.getElementById("fullname").value;

const phone =
document.getElementById("phone").value;

const address =
document.getElementById("address").value;

if(
fullname==="" ||
phone==="" ||
address===""){
    alert("Lengkapi data pengiriman.");
    
    btn.disabled = false;
    btn.innerHTML = "Buat Pesanan";
    return;
}

// ==========================
// CEK KERANJANG
// ==========================

if(cart.length === 0){

    alert("Keranjang masih kosong.");

    btn.disabled = false;
    btn.innerHTML = "Buat Pesanan";

    return;

}

// ==========================
// DATA PESANAN
// ==========================

    const data = {

        user_id: user.id,
        total: total + 15000,
        cart: cart

    };

    fetch("http://localhost:5000/api/orders/create", {

        method: "POST",

        headers: {

            "Content-Type":"application/json"

        },

        body: JSON.stringify(data)

    })

    .then(res=>res.json())

    .then(result => {

        alert(result.message);
    
        if(result.success){
    
            localStorage.removeItem("cart");
    
            window.location.href = "profile.html";
    
        }else{
    
            btn.disabled = false;
            btn.innerHTML = "Buat Pesanan";
    
        }
    
    })

    .catch(err => {

        console.log(err);
    
        alert("Server tidak dapat dihubungi.");
    
        btn.disabled = false;
    
        btn.innerHTML = "Buat Pesanan";
    
    });   // <-- menutup catch
    
    });   // <-- menutup addEventListener