const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/dashboard", (req, res) => {

    const sqlProduk = "SELECT COUNT(*) AS totalProduk FROM products";
    const sqlOrder = "SELECT COUNT(*) AS totalOrder FROM orders";
    const sqlUser = "SELECT COUNT(*) AS totalUser FROM users";
    
    const sqlPendapatan =
    "SELECT IFNULL(SUM(total),0) AS totalPendapatan FROM orders";

    const sqlPending =
    "SELECT COUNT(*) AS pending FROM orders WHERE status='pending'";

    const sqlProcessing =
    "SELECT COUNT(*) AS processing FROM orders WHERE status='processing'";

    const sqlCompleted =
    "SELECT COUNT(*) AS completed FROM orders WHERE status='completed'";

    const sqlCancelled =
    "SELECT COUNT(*) AS cancelled FROM orders WHERE status='cancelled'";

    const sqlChart = `
    SELECT
        MONTH(created_at) AS bulan,
        SUM(total) AS total
    FROM orders
    GROUP BY MONTH(created_at)
    ORDER BY MONTH(created_at)
    `;

    db.query(sqlProduk, (err, produk) => {

        if (err) return res.status(500).json(err);

        db.query(sqlOrder, (err, order) => {

            if (err) return res.status(500).json(err);

            db.query(sqlUser, (err, user) => {

                if (err)
                    return res.status(500).json(err);
            
                db.query(sqlPendapatan, (err, pendapatan) => {
            
                    if (err)
                        return res.status(500).json(err);

                    db.query(sqlPending, (err, pending) => {

                        if (err)
                            return res.status(500).json(err);
                    
                        db.query(sqlProcessing, (err, processing) => {
                    
                            if (err)
                                return res.status(500).json(err);
                    
                            db.query(sqlCompleted, (err, completed) => {
                    
                                if (err)
                                    return res.status(500).json(err);
                    
                                db.query(sqlCancelled, (err, cancelled) => {

                                    if (err)
                                        return res.status(500).json(err);
                                
                                    db.query(sqlChart, (err, chart) => {
                                
                                        if (err)
                                            return res.status(500).json(err);
                                
                                        res.json({
                                
                                            totalProduk: produk[0].totalProduk,
                                            totalOrder: order[0].totalOrder,
                                            totalUser: user[0].totalUser,
                                            totalPendapatan: pendapatan[0].totalPendapatan,
                                
                                            pending: pending[0].pending,
                                            processing: processing[0].processing,
                                            completed: completed[0].completed,
                                            cancelled: cancelled[0].cancelled,
                                
                                            chart
                                
                                        });
                                
                                    });
                                
                                });

                            });
                    
                        });
                    
                    });
            
                });
            
            });

        });

    });

});

router.get("/order/:id", (req, res) => {

    const sql = `
        SELECT
            orders.id,
            users.fullname,
            orders.total,
            orders.status,
            orders.payment_proof,
            orders.created_at,
            order_items.quantity,
            order_items.subtotal,
            products.product_name,
            products.image
        FROM orders

        JOIN users
            ON orders.user_id = users.id

        JOIN order_items
            ON orders.id = order_items.order_id

        JOIN products
            ON order_items.product_id = products.id

        WHERE orders.id = ?
    `;

    db.query(sql, [req.params.id], (err, result) => {

        if (err)
            return res.status(500).json(err);

        res.json(result);

    });

});


// =========================
// UPDATE STATUS ORDER
// =========================

router.put("/order/:id", (req, res) => {

    const id = req.params.id;
    const { status } = req.body;

    const sql = `
        UPDATE orders
        SET status = ?
        WHERE id = ?
    `;

    db.query(sql, [status, id], (err) => {

        if (err)
            return res.status(500).json(err);

        res.json({

            success: true,
            message: "Status berhasil diupdate"

        });

    });

});

// =========================
// VERIFIKASI PEMBAYARAN
// =========================

router.put("/order/:id/verify", (req, res) => {

    const id = req.params.id;

    const sql = `
        UPDATE orders
        SET status = 'processing'
        WHERE id = ?
        AND status = 'paid'
    `;

    db.query(sql, [id], (err, result) => {

        if (err)
            return res.status(500).json(err);

        if (result.affectedRows === 0) {

            return res.json({

                success: false,
                message: "Pesanan tidak bisa diverifikasi."

            });

        }

        res.json({

            success: true,
            message: "Pembayaran berhasil diverifikasi."

        });

    });

});

// =========================

router.get("/users", (req, res) => {

    const sql = `
        SELECT
            id,
            fullname,
            email,
            role,
            created_at
        FROM users
        ORDER BY id DESC
    `;

    db.query(sql, (err, result) => {

        if (err)
            return res.status(500).json(err);

        res.json(result);

    });

});

// =======================
// Ambil 1 User
// =======================

router.get("/users/:id", (req, res) => {

    const id = req.params.id;

    const sql = `
        SELECT
            id,
            fullname,
            email,
            role
        FROM users
        WHERE id = ?
    `;

    db.query(sql, [id], (err, result) => {

        if (err)
            return res.status(500).json(err);

        if (result.length === 0) {

            return res.status(404).json({
                message: "User tidak ditemukan"
            });

        }

        res.json(result[0]);

    });

});

// =======================
// Update Role User
// =======================

router.put("/users/:id", (req, res) => {

    const id = req.params.id;

    const { role } = req.body;

    const sql = `
        UPDATE users
        SET role = ?
        WHERE id = ?
    `;

    db.query(sql, [role, id], (err) => {

        if (err)
            return res.status(500).json(err);

        res.json({

            success: true,
            message: "Role user berhasil diupdate"

        });

    });

});

// =======================
// Edit User
// =======================

router.put("/users/edit/:id", (req, res) => {

    const id = req.params.id;

    const {
        fullname,
        email
    } = req.body;

    const sql = `
        UPDATE users
        SET
            fullname = ?,
            email = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [
            fullname,
            email,
            id
        ],
        (err) => {

            if (err)
                return res.status(500).json(err);

            res.json({

                success: true,
                message: "User berhasil diupdate"

            });

        }
    );

});

// =======================
// Hapus User
// =======================

router.delete("/users/:id", (req, res) => {

    const id = req.params.id;

    const sql = `
        DELETE FROM users
        WHERE id = ?
    `;

    db.query(sql, [id], (err) => {

        if (err)
            return res.status(500).json(err);

        res.json({

            success: true,
            message: "User berhasil dihapus"

        });

    });

});

module.exports = router;