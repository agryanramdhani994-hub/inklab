function loadProducts() {

    fetch("http://localhost:5000/api/products")
    .then(res => res.json())
    .then(data => {

        const table = document.getElementById("productTable");

        table.innerHTML = "";

        data.forEach(item => {

            table.innerHTML += `
                <tr>

                    <td>${item.id}</td>

                    <td>${item.product_name}</td>

                    <td>
                        Rp ${Number(item.price).toLocaleString("id-ID")}
                    </td>

                    <td>

                        <a
                            href="admin-edit-produk.html?id=${item.id}"
                            class="btn btn-warning btn-sm">

                            Edit

                        </a>

                        <button
                            class="btn btn-danger btn-sm"
                            onclick="deleteProduct(${item.id})">

                            Hapus

                        </button>

                    </td>

                </tr>
            `;

        });

    });

}

// =========================
// Hapus Produk
// =========================

function deleteProduct(id){

    const yakin = confirm("Yakin ingin menghapus produk ini?");

    if(!yakin){

        return;

    }

    fetch(`http://localhost:5000/api/products/${id}`,{

        method:"DELETE"

    })

    .then(res=>res.json())

    .then(result=>{

        alert(result.message);

        loadProducts();

    });

}

loadProducts();