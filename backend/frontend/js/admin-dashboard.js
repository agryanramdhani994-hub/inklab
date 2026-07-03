fetch("http://localhost:5000/api/admin/dashboard")
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

    document.getElementById("pending").innerText =
        data.pending;

    document.getElementById("processing").innerText =
        data.processing;

    document.getElementById("completed").innerText =
        data.completed;

    document.getElementById("cancelled").innerText =
        data.cancelled;

    // ==========================
    // CHART
    // ==========================

    const ctx =
        document
        .getElementById("dashboardChart");

        const bulan = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "Mei",
            "Jun",
            "Jul",
            "Ags",
            "Sep",
            "Okt",
            "Nov",
            "Des"
        ];
        
        const labelChart = data.chart.map(item =>
            bulan[item.bulan - 1]
        );
        
        const totalChart = data.chart.map(item =>
            item.total
        );
        
        new Chart(ctx, {
        
            type: "line",
        
            data: {
        
                labels: labelChart,
        
                datasets: [{
        
                    label: "Pendapatan",
        
                    data: totalChart,
        
                    tension: 0.3,
        
                    fill: false
        
                }]
        
            },
        
            options: {
        
                responsive: true,
        
                plugins: {
        
                    legend: {
        
                        display: true
        
                    }
        
                }
        
            }
        
        });

})
.catch(err=>console.log(err));