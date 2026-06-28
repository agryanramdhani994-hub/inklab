const express = require("express");
const router = express.Router();
const db = require("../config/db");

const multer = require("multer");
const path = require("path");

console.log("✅ AUTH ROUTES LOADED");

// =======================
// MULTER UPLOAD FOTO
// =======================

const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },

    filename: (req, file, cb) => {

        cb(
            null,
            Date.now() + path.extname(file.originalname)
        );

    }

});

const upload = multer({
    storage
});

// =======================
// REGISTER
// =======================

router.post("/register", (req, res) => {

    const { fullname, email, password } = req.body;

    const sql =
        "INSERT INTO users(fullname,email,password) VALUES(?,?,?)";

    db.query(sql, [fullname, email, password], (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json({
            success: true,
            message: "Register berhasil"
        });

    });

});

// =======================
// LOGIN
// =======================

router.post("/login", (req, res) => {

    const { email, password } = req.body;

    const sql =
        "SELECT * FROM users WHERE email=? AND password=?";

    db.query(sql, [email, password], (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        if (result.length > 0) {

            res.json({
                success: true,
                message: "Login berhasil",
                user: result[0]
            });

        } else {

            res.json({
                success: false,
                message: "Email atau password salah"
            });

        }

    });

});

// =======================
// GET PROFILE
// =======================

router.get("/profile/:id", (req, res) => {

    const id = req.params.id;

    const sql = `
        SELECT 
        id, 
        fullname, 
        email,
        phone,
        address,
        photo, 
        role, 
        created_at 
        FROM users 
        WHERE id=?
        `;

    db.query(sql, [id], (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        if (result.length === 0) {
            return res.status(404).json({
                message: "User tidak ditemukan"
            });
        }

        res.json(result[0]);

    });

});

// =======================
// UPDATE PROFILE
// =======================

router.put(
    "/profile/:id",
    upload.single("photo"),
    (req, res) => {

        const id = req.params.id;

        const {
            fullname,
            phone,
            address
        } = req.body;

        let sql;
        let params;

        if (req.file) {

            sql = `
                UPDATE users
                SET
                    fullname=?,
                    phone=?,
                    address=?,
                    photo=?
                WHERE id=?
            `;

            params = [
                fullname,
                phone,
                address,
                req.file.filename,
                id
            ];

        } else {

            sql = `
                UPDATE users
                SET
                    fullname=?,
                    phone=?,
                    address=?
                WHERE id=?
            `;

            params = [
                fullname,
                phone,
                address,
                id
            ];

        }

        db.query(sql, params, (err) => {

            if (err)
                return res.status(500).json(err);

            res.json({
                success: true,
                message: "Profil berhasil diperbarui"
            });

        });

    }
);

// =======================
// CHECKOUT
// =======================

router.post("/checkout", (req, res) => {

    const { user_id, total, cart } = req.body;

    const sqlOrder =
    "INSERT INTO orders(user_id,total,status) VALUES(?,?,?)";

    db.query(sqlOrder, [user_id, total, "pending"], (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }
    
        const orderId = result.insertId;

        if (cart.length === 0) {

            return res.json({
                success: true,
                message: "Checkout berhasil"
            });
        
        }

        let selesai = 0;

cart.forEach(item => {

const sqlItem =
    "INSERT INTO order_items(order_id,product_id,quantity,subtotal) VALUES(?,?,?,?)";

db.query(
    sqlItem,
    [
        orderId,
        item.id,
        item.jumlah,
        item.harga * item.jumlah
    ],
    (err) => {

        if (err) {

            console.log(err);
            
            return res.status(500).json(err);
        }

        selesai++;


    if (selesai === cart.length) {

    res.json({
        success: true,
        message: "Checkout berhasil"
    });

}

    }
);

});
    
    });

});

module.exports = router;