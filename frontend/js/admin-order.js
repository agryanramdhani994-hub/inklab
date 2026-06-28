function loadOrders() {

    fetch("http://localhost:5000/api/orders")

        .then(res => res.json())

        .then(data => {

            const table =
                document.getElementById("orderTable");

            table.innerHTML = "";

            data.forEach(order => {

                let badge = "secondary";

                if (order.status == "pending")
                    badge = "warning";

                if (order.status == "processing")
                    badge = "info";

                if (order.status == "shipping")
                    badge = "primary";

                if (order.status == "completed")
                    badge = "success";

                table.innerHTML += `

<tr>

<td>${order.id}</td>

<td>${order.fullname}</td>

<td>
Rp ${Number(order.total).toLocaleString("id-ID")}
</td>

<td>

<span class="badge bg-${badge}">
${order.status}
</span>

</td>

<td>
${new Date(order.created_at).toLocaleDateString("id-ID")}
</td>

<td>

<div class="dropdown">

<button
class="btn btn-sm btn-dark dropdown-toggle"
data-bs-toggle="dropdown">

Status

</button>

<ul class="dropdown-menu">

<li>
<a
class="dropdown-item"
href="#"
onclick="ubahStatus(${order.id},'pending')">

Pending

</a>
</li>

<li>

<a
class="dropdown-item"
href="#"
onclick="ubahStatus(${order.id},'processing')">

Processing

</a>

</li>

<li>

<a
class="dropdown-item"
href="#"
onclick="ubahStatus(${order.id},'shipping')">

Shipping

</a>

</li>

<li>

<a
class="dropdown-item"
href="#"
onclick="ubahStatus(${order.id},'completed')">

Completed

</a>

</li>

</ul>

<a
href="admin-detail-order.html?id=${order.id}"
class="btn btn-primary btn-sm mt-2">

Detail

</a>

</div>

</td>

</tr>

`;

            });

        });

}

loadOrders();

function ubahStatus(id, status) {

    fetch(`http://localhost:5000/api/orders/status/${id}`, {

        method: "PUT",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify({

            status

        })

    })

    .then(res => res.json())

    .then(data => {

        alert(data.message);

        loadOrders();

    });

}