const id = new URLSearchParams(window.location.search).get("id");

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

    const table = document.getElementById("detailTable");

    table.innerHTML = "";

    data.forEach(item => {

        table.innerHTML += `

        <tr>

            <td>

                <img
                    src="http://localhost:5000/uploads/${item.image}"
                    width="70">

            </td>

            <td>

                ${item.product_name}

            </td>

            <td>

                ${item.quantity}

            </td>

            <td>

                Rp ${Number(item.subtotal).toLocaleString("id-ID")}

            </td>

        </tr>

        `;

    });

});

document
.getElementById("updateStatus")
.addEventListener("click", () => {

    const status =
        document.getElementById("status").value;

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

    });

});