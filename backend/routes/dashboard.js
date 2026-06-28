const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/", (req, res) => {

    const sql = `
        SELECT
            (SELECT COUNT(*) FROM products) AS totalProduk,
            (SELECT COUNT(*) FROM users) AS totalUser,
            (SELECT COUNT(*) FROM orders) AS totalOrder,
            (SELECT IFNULL(SUM(total),0) FROM orders) AS totalPendapatan
    `;

    db.query(sql, (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json(result[0]);

    });

});

module.exports = router;