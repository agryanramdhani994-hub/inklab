fetch("http://localhost:5000/api/dashboard")
.then(res => res.json())
.then(data => {

    document.getElementById("produk").innerText =
        data.totalProduk;

    document.getElementById("user").innerText =
        data.totalUser;

    document.getElementById("order").innerText =
        data.totalOrder;

    document.getElementById("pendapatan").innerText =
        "Rp " +
        Number(data.totalPendapatan)
        .toLocaleString("id-ID");



    // ==========================
    // CHART
    // ==========================

    const ctx =
        document
        .getElementById("dashboardChart");

    new Chart(ctx,{

        type:"bar",

        data:{

            labels:[
                "Produk",
                "User",
                "Order"
            ],

            datasets:[{

                label:"Jumlah",

                data:[
                    data.totalProduk,
                    data.totalUser,
                    data.totalOrder
                ]

            }]

        },

        options:{

            responsive:true,

            plugins:{

                legend:{
                    display:false
                }

            }

        }

    });

})
.catch(err=>console.log(err));