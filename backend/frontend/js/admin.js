fetch("http://localhost:5000/api/admin/dashboard")

.then(response => response.json())

.then(data => {

    document.getElementById("totalProduk").innerText =
        data.totalProduk;

    document.getElementById("totalOrder").innerText =
        data.totalOrder;

    document.getElementById("totalUser").innerText =
        data.totalUser;

})

.catch(err => {

    console.log(err);

});