import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import pool from "./db/index.js";
import axios from "axios";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// EJS setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Middleware to parse urlencoded form data
app.use(express.urlencoded({ extended: true }));

// Welcome page route at "/"
app.get("/", (req, res) => {
  res.render("welcome");
});

// Main book app page route at "/books"
app.get("/books", async (req, res) => {
  const sort = req.query.sort || "date_added";
  const validSorts = ["date_added", "rating", "title"];
  const orderBy = validSorts.includes(sort) ? sort : "date_added";

  try {
    const result = await pool.query(`SELECT * FROM books ORDER BY ${orderBy} DESC`);
    res.render("index", { books: result.rows });
  } catch (err) {
    console.error("DB Error:", err);
    res.status(500).send("Error retrieving books.");
  }
});

// Add book route
app.post("/books/add", async (req, res) => {
  const { title, author, date_read, rating, notes } = req.body;

  let cover_url = "https://via.placeholder.com/120x180.png?text=No+Cover";

  try {
    let searchUrl = `https://openlibrary.org/search.json?title=${encodeURIComponent(title)}`;
    if (author && author.trim() !== "") {
      searchUrl += `&author=${encodeURIComponent(author)}`;
    }

    const response = await axios.get(searchUrl);

    if (
      response.data.docs &&
      response.data.docs.length > 0 &&
      response.data.docs[0].cover_i
    ) {
      const coverId = response.data.docs[0].cover_i;
      cover_url = `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`;
    }
  } catch (error) {
    console.log("Open Library API error, using default cover:", error.message);
  }

  try {
    await pool.query(
      `INSERT INTO books (title, author, date_read, rating, notes, cover_url)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [title, author, date_read || null, rating || null, notes, cover_url]
    );
    res.redirect("/books");
  } catch (dbError) {
    console.error("Database insert error:", dbError);
    res.status(500).send("Error adding the book.");
  }
});

// Delete book route
app.post("/books/:id/delete", async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM books WHERE id=$1", [id]);
    res.redirect("/books");
  } catch (err) {
    console.error("DB Error (delete):", err);
    res.status(500).send("Error deleting book.");
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
