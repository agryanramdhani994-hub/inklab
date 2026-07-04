const express = require("express");
const router = express.Router();
const db = require("../config/db");

const multer = require("multer");
const path = require("path");

// =======================
// Upload Gambar
// =======================

const storage = multer.diskStorage({

    destination: function(req, file, cb){

        cb(null, "uploads/");

    },

    filename: function(req, file, cb){

        cb(
            null,
            Date.now() + path.extname(file.originalname)
        );

    }

});

const upload = multer({
    storage: storage
});

router.get("/", (req, res) => {

    const sql = `
        SELECT
            id,
            product_name,
            description,
            price,
            stock,
            image,
            category_id
        FROM products
        ORDER BY id ASC
    `;

    db.query(sql, (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        console.log("Jumlah produk:", result.length);
        console.log(result);

        res.json(result);

    });

});

// =======================
// Tambah Produk
// =======================

router.post("/", upload.single("image"), (req, res) => {

    const {
        product_name,
        description,
        price,
        stock,
        category_id
    } = req.body;

    const image = req.file
        ? req.file.filename
        : null;

    const sql = `
        INSERT INTO products
        (
            product_name,
            description,
            price,
            stock,
            image,
            category_id
        )
        VALUES (?,?,?,?,?,?)
    `;

    db.query(
        sql,
        [
            product_name,
            description,
            price,
            stock,
            image,
            category_id
        ],
        (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json(err);

            }

            res.json({

                success:true,
                message:"Produk berhasil ditambahkan"

            });

        }
    );

});

// =======================
// Ambil Semua Kategori
// =======================

router.get("/categories/all", (req, res) => {

    const sql = `
        SELECT
            id,
            category_name
        FROM categories
        ORDER BY category_name ASC
    `;

    db.query(sql, (err, result) => {

        if (err)
            return res.status(500).json(err);

        res.json(result);

    });

});

// =======================
// Ambil 1 Produk
// =======================

router.get("/:id", (req, res) => {

    const sql = `
        SELECT *
        FROM products
        WHERE id = ?
    `;

    db.query(
        sql,
        [req.params.id],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            if (result.length === 0) {

                return res.status(404).json({
                    message: "Produk tidak ditemukan"
                });

            }

            res.json(result[0]);

        }
    );

});

router.put("/:id", upload.single("image"), (req, res) => {

    const id = req.params.id;

    const {
        product_name,
        description,
        price,
        stock,
        category_id
    } = req.body;

    db.query(
        "SELECT image FROM products WHERE id=?",
        [id],
        (err, result) => {

            if (err)
                return res.status(500).json(err);

            let image = result[0].image;

            if (req.file) {
                image = req.file.filename;
            }

            const sql = `
                UPDATE products
                SET
                    product_name=?,
                    description=?,
                    price=?,
                    stock=?,
                    image=?,
                    category_id=?
                WHERE id=?
            `;

            db.query(
                sql,
                [
                    product_name,
                    description,
                    price,
                    stock,
                    image,
                    category_id,
                    id
                ],
                (err) => {

                    if (err)
                        return res.status(500).json(err);

                    res.json({
                        success: true,
                        message: "Produk berhasil diupdate"
                    });

                }
            );

        }
    );

});

// =======================
// Hapus Produk
// =======================

router.delete("/:id", (req, res) => {

    const id = req.params.id;

    const sql = `
        DELETE FROM products
        WHERE id = ?
    `;

    db.query(sql, [id], (err, result) => {

        if (err) {

            return res.status(500).json(err);

        }

        res.json({

            success: true,
            message: "Produk berhasil dihapus"

        });

    });

});

module.exports = router;