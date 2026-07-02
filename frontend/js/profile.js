const currentUser = JSON.parse(localStorage.getItem("user"));
let currentOrderId = null;

if (!currentUser) {
    window.location.href = "login.html";
}

fetch(`http://localhost:5000/api/auth/profile/${currentUser.id}`)
    .then(response => response.json())
    .then(data => {

        document.getElementById("profileName").innerText = data.fullname;
        document.getElementById("profileEmail").innerText = data.email;
        document.getElementById("profileRole").innerText = data.role;

        // Foto Profil
        const photo = document.querySelector(".rounded-circle");

        if (data.photo) {
            photo.src = `http://localhost:5000/uploads/${data.photo}`;
        } else {
            photo.src = "https://via.placeholder.com/150";
        }

        // =======================
        // NOMOR HP
        // =======================

        document.getElementById("profilePhone").innerText =
            data.phone || "-";

        // =======================
        // ALAMAT
        // =======================

        document.getElementById("profileAddress").innerText =
            data.address || "-";

        document.getElementById("editFullname").value = data.fullname;
        document.getElementById("editPhone").value = data.phone || "";
        document.getElementById("editAddress").value = data.address || "";

        const tanggal = new Date(data.created_at);

        document.getElementById("profileDate").innerText =
            tanggal.toLocaleDateString("id-ID");

            fetch(`http://localhost:5000/api/orders/user/${currentUser.id}`)

.then(res => res.json())

.then(orders => {

    const table = document.getElementById("orderTable");

    table.innerHTML = "";

    if (orders.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="3" class="text-center">
                    Belum ada pesanan.
                </td>
            </tr>
        `;

        return;

    }

    orders.forEach(order => {

        let badge = "secondary";

        if (order.status == "pending")
            badge = "warning";

        if (order.status == "processing")
            badge = "info";

        if (order.status == "completed")
            badge = "success";

        table.innerHTML += `

        <tr>

            <td>#${order.id}</td>

            <td>
                <span class="badge bg-${badge}">
                     ${order.status}
                 </span>
             </td>

            <td>
                Rp ${Number(order.total).toLocaleString("id-ID")}
            </td>

            <td>
                <button
                class="btn btn-sm btn-primary"
                onclick="lihatDetail(${order.id},'${order.status}')">

                Lihat Detail

                </button>
            </td>

        </tr>

        `;

    });

});

    })
    .catch(err => console.log(err));

    function lihatDetail(orderId, status) {

        currentOrderId = orderId;

        if(status === "pending"){
            document.getElementById("paymentSection").style.display = "block";
        }else{
            document.getElementById("paymentSection").style.display = "none";
        }

        fetch(`http://localhost:5000/api/orders/detail/${orderId}`)
    
            .then(res => res.json())
    
            .then(items => {

                document.getElementById("detailOrderId").innerText =
                    "Order #" + orderId;

                document.getElementById("detailInfo").innerText =
                    items.length + " item";
    
                const detail = document.getElementById("detailOrder");

                let total = 0;
    
                detail.innerHTML = "";
    
                items.forEach(item => {

                    total += Number(item.subtotal);
    
                    detail.innerHTML += `
    
                    <div class="card mb-3">
    
                        <div class="row g-0">
    
                            <div class="col-md-3">
    
                                <img
                                    src="http://localhost:5000/uploads/${item.image}"
                                    class="img-fluid rounded-start">
    
                            </div>
    
                            <div class="col-md-9">
    
                                <div class="card-body">
    
                                    <h5>${item.product_name}</h5>
    
                                    <p>
                                        Jumlah :
                                        ${item.quantity}
                                    </p>
    
                                    <p>
                                        Subtotal :
                                        Rp ${Number(item.subtotal).toLocaleString("id-ID")}
                                    </p>
    
                                </div>
    
                            </div>
    
                        </div>
    
                    </div>
    
                    `;
    
                });

                document.getElementById("detailTotal").innerText =
                "Rp " + total.toLocaleString("id-ID");
    
                const modal =
                    new bootstrap.Modal(document.getElementById("detailModal"));
    
                modal.show();
    
            });
    
    }

    document
    .getElementById("saveProfile")
    .addEventListener("click", () => {

    const formData = new FormData();

    formData.append(
        "fullname",
        document.getElementById("editFullname").value
    );

    formData.append(
        "phone",
        document.getElementById("editPhone").value
    );

    formData.append(
        "address",
        document.getElementById("editAddress").value
    );

    const foto =
        document.getElementById("editPhoto").files[0];

    if (foto) {
        formData.append("photo", foto);
    }

    fetch(
        `http://localhost:5000/api/auth/profile/${currentUser.id}`,
        {
            method: "PUT",
            body: formData
        }
    )

    .then(res => res.json())
.then(data => {

    // Update localStorage agar navbar ikut berubah
    currentUser.fullname =
        document.getElementById("editFullname").value;

    if (foto) {
        currentUser.photo = data.photo || currentUser.photo;
    }

    localStorage.setItem(
        "user",
        JSON.stringify(currentUser)
    );

    alert(data.message);

    location.reload();

});

});

document
.getElementById("uploadPayment")
.addEventListener("click", () => {

    const file =
        document.getElementById("paymentFile").files[0];

    if(!file){

        alert("Silakan pilih file terlebih dahulu.");

        return;

    }

    const formData = new FormData();

    formData.append("payment", file);

    fetch(
        `http://localhost:5000/api/orders/upload-payment/${currentOrderId}`,
        {
            method:"POST",
            body:formData
        }
    )

    .then(res=>res.json())

    .then(data=>{

        alert(data.message);

        location.reload();

    })

    .catch(err=>console.log(err));

});

// =====================
// LOGOUT
// =====================

document
    .getElementById("logoutBtn")
    .addEventListener("click", () => {

        const yakin = confirm("Yakin ingin logout?");

        if (!yakin) return;

        localStorage.removeItem("user");

        window.location.href = "login.html";

    });