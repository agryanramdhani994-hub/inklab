const id = new URLSearchParams(window.location.search).get("id");

// ==============================
// AMBIL DETAIL ORDER
// ==============================

fetch(`http://localhost:5000/api/admin/order/${id}`)
    .then(res => res.json())
    .then(data => {

        const order = data[0];

        document.getElementById("customer").innerHTML =
            `<b>Customer :</b> ${order.fullname}`;

        document.getElementById("tanggal").innerHTML =
            `<b>Tanggal :</b> ${new Date(order.created_at).toLocaleDateString("id-ID")}`;

        document.getElementById("total").innerHTML =
            `Total : Rp ${Number(order.total).toLocaleString("id-ID")}`;

        document.getElementById("status").value =
            order.status;

        // ==============================
        // BUKTI PEMBAYARAN
        // ==============================

        const paymentProof =
            document.getElementById("paymentProof");

        const noProof =
            document.getElementById("noProof");

        const verifyContainer =
            document.getElementById("verifyContainer");

        if (order.payment_proof) {

            paymentProof.src =
                `http://localhost:5000/uploads/${order.payment_proof}`;

            paymentProof.style.display = "block";

            noProof.style.display = "none";

            if (order.status === "paid") {

                verifyContainer.style.display = "block";

            } else {

                verifyContainer.style.display = "none";

            }

        } else {

            paymentProof.style.display = "none";

            noProof.style.display = "block";

            verifyContainer.style.display = "none";

        }

        // ==============================
        // DETAIL PRODUK
        // ==============================

        const table =
            document.getElementById("detailTable");

        table.innerHTML = "";

        data.forEach(item => {

            table.innerHTML += `

            <tr>

                <td>
                    <img
                        src="http://localhost:5000/uploads/${item.image}"
                        width="70">
                </td>

                <td>${item.product_name}</td>

                <td>${item.quantity}</td>

                <td>
                    Rp ${Number(item.subtotal).toLocaleString("id-ID")}
                </td>

            </tr>

            `;

        });

    })

    .catch(err => {

        console.log(err);

        alert("Gagal mengambil data order.");

    });


// ==============================
// UPDATE STATUS
// ==============================

document
.getElementById("updateStatus")
.addEventListener("click", () => {

    if (!confirm("Yakin ingin mengubah status pesanan?")) {

        return;

    }

    const status =
        document.getElementById("status").value;

    const btn =
        document.getElementById("updateStatus");

    btn.disabled = true;

    btn.innerHTML = "Mengupdate...";

    fetch(`http://localhost:5000/api/admin/order/${id}`, {

        method: "PUT",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify({

            status

        })

    })

    .then(res => res.json())

    .then(result => {

        alert(result.message);

        btn.disabled = false;

        btn.innerHTML = "Update Status";

        location.reload();

    })

    .catch(err => {

        console.log(err);

        alert("Server gagal dihubungi.");

        btn.disabled = false;

        btn.innerHTML = "Update Status";

    });

});


// ==============================
// VERIFIKASI PEMBAYARAN
// ==============================

document
.getElementById("verifyPayment")
.addEventListener("click", () => {

    if (!confirm("Verifikasi pembayaran ini?")) {

        return;

    }

    fetch(`http://localhost:5000/api/admin/order/${id}/verify`, {

        method: "PUT"

    })

    .then(res => res.json())

    .then(result => {

        alert(result.message);

        if (result.success) {

            location.reload();

        }

    })

    .catch(err => {

        console.log(err);

        alert("Server gagal dihubungi.");

    });

});