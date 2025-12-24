const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();
const axios = require("axios");

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

function generateRegNo(year, college, branch, serial) {
  const serialStr = serial.toString().padStart(3, "0");
  return `${year}${college}${branch}${serialStr}`;
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function startFetchJob({
  admission_year,
  college_code,
  branch_code,
  serial_start,
  serial_end,
  exam_year,
  semester,
  exam_held
}) {
  for (let serial = serial_start; serial <= serial_end; serial++) {

    const regNo = generateRegNo(
      admission_year,
      college_code,
      branch_code,
      serial
    );

    try {
      const { data } = await axios.get(
        "https://beu-bih.ac.in/backend/v1/result/get-result",
        {
          params: {
            year: exam_year,
            redg_no: regNo,
            semester,
            exam_held
          }
        }
      );

      if (data.status !== 200) continue;

      await pool.query(
        `
        INSERT INTO raw_api_results
        (registration_no, admission_year, college_code, branch_code, reg_no_serial, response)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (registration_no)
        DO UPDATE SET
          response = EXCLUDED.response,
          fetched_at = CURRENT_TIMESTAMP
        `,
        [
          regNo,
          admission_year,
          college_code,
          branch_code,
          serial,
          data
        ]
      );

      await sleep(400);

    } catch (err) {
      console.error("Failed for reg_no:", regNo, err.message);
    }
  }
}

app.post("/api/fetch-results", async (req, res) => {
  const {
    admission_year,
    college_code,
    branch_code,
    serial_start,
    serial_end,
    exam_year,
    semester,
    exam_held
  } = req.body;

  if (!admission_year || !college_code || !branch_code) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  if (serial_start > serial_end) {
    return res.status(400).json({ message: "Invalid serial range" });
  }

  // fire-and-forget background job
  startFetchJob({
    admission_year,
    college_code,
    branch_code,
    serial_start,
    serial_end,
    exam_year,
    semester,
    exam_held
  });

  res.json({ message: "Result fetching started" });
});

// 👇 VERY IMPORTANT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running"));