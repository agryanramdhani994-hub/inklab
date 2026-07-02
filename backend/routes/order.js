const express = require("express");
const router = express.Router();
const db = require("../config/db");

const multer = require("multer");
const path = require("path");

// ===============================
// Upload Bukti Pembayaran
// ===============================

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        cb(null, "uploads/");

    },

    filename: (req, file, cb) => {

        cb(
            null,
            Date.now() +
            path.extname(file.originalname)
        );

    }

});

const upload = multer({
    storage
});

router.get("/", (req, res) => {

    const sql = `
        SELECT
            orders.id,
            users.fullname,
            orders.total,
            orders.status,
            orders.created_at
        FROM orders
        LEFT JOIN users
            ON orders.user_id = users.id
        ORDER BY orders.id DESC
    `;

    db.query(sql, (err, result) => {

        if (err)
            return res.status(500).json(err);

        res.json(result);

    });

});

// =======================
// Ambil Order Milik User
// =======================

router.get("/user/:id", (req, res) => {

    const userId = req.params.id;

    const sql = `
        SELECT
            id,
            total,
            status,
            created_at
        FROM orders
        WHERE user_id = ?
        ORDER BY id DESC
    `;

    db.query(sql, [userId], (err, result) => {

        if (err)
            return res.status(500).json(err);

        res.json(result);

    });

});

// ======================================
// DETAIL ORDER
// ======================================

router.get("/detail/:id", (req, res) => {

    const id = req.params.id;

const sql = `
    SELECT
        oi.id,
        p.product_name,
        p.image,
        oi.quantity,
        oi.subtotal,

        o.status,
        o.payment_proof,
        o.total

    FROM order_items oi

    JOIN products p
        ON oi.product_id = p.id

    JOIN orders o
        ON oi.order_id = o.id

    WHERE oi.order_id = ?
`;

    db.query(sql, [id], (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json(result);

    });

});

// ======================================
// BUAT PESANAN
// ======================================

router.post("/create", (req, res) => {

    const {
        user_id,
        total,
        cart
    } = req.body;

    if (!cart || cart.length === 0) {

        return res.json({
            success: false,
            message: "Keranjang kosong."
        });

    }

    const sqlOrder = `
        INSERT INTO orders
        (user_id,total,status)
        VALUES (?,?,?)
    `;

    db.query(
        sqlOrder,
        [user_id, total, "pending"],
        (err, result) => {

            if (err)
                return res.status(500).json(err);

            const orderId = result.insertId;

            let selesai = 0;

            cart.forEach(item => {

                const sqlItem = `
                    INSERT INTO order_items
                    (order_id,product_id,quantity,subtotal)
                    VALUES (?,?,?,?)
                `;

                db.query(
                    sqlItem,
                    [
                        orderId,
                        item.id,
                        item.jumlah,
                        item.harga * item.jumlah
                    ],
                    (err2) => {

                        if (err2)
                            return res.status(500).json(err2);

                        selesai++;

                        if (selesai === cart.length) {

                            res.json({

                                success: true,
                                message: "Pesanan berhasil dibuat."

                            });

                        }

                    }
                );

            });

        }

    );

});

// ======================================
// UPDATE STATUS ORDER
// ======================================

router.put("/status/:id", (req, res) => {

    const id = req.params.id;
    const { status } = req.body;

    const sql = `
        UPDATE orders
        SET status=?
        WHERE id=?
    `;

    db.query(sql, [status, id], (err) => {

        if (err)
            return res.status(500).json(err);

        res.json({
            success: true,
            message: "Status berhasil diubah."
        });

    });

});

// ======================================
// Upload Bukti Pembayaran
// ======================================

router.post(
    "/upload-payment/:id",
    upload.single("payment"),
    (req, res) => {

        const id = req.params.id;

        if (!req.file) {

            return res.json({

                success: false,
                message: "File belum dipilih"

            });

        }

        const sql = `
            UPDATE orders
            SET
                payment_proof = ?,
                status = 'paid'
            WHERE id = ?
        `;

        db.query(

            sql,

            [

                req.file.filename,
                id

            ],

            (err) => {

                if (err)
                    return res.status(500).json(err);

                res.json({

                    success: true,
                    message: "Bukti pembayaran berhasil diupload."

                });

            }

        );

    }
);

module.exports = router;