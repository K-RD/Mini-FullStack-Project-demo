const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

app.get("/", (req, res) => {
    res.send("Backend running successfully");
});

app.post("/search", async (req, res) => {
    const { name } = req.body;
    const result = await pool.query(
        "SELECT * FROM students WHERE name ILIKE $1",
        [`%${name}%`]
    );
    res.json(result.rows);
});

// 👇 VERY IMPORTANT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running"));