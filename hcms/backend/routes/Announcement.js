const express = require("express");
const router = express.Router();
const db = require("../db");
const { auth } = require("../middleware/auth");


// Get all announcements
router.get("/", (req, res) => {
  db.query("SELECT * FROM announcements ORDER BY timestamp DESC", (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

// Get announcements by category
router.get("/category/:category", (req, res) => {
  db.query(
    "SELECT * FROM announcements WHERE category = ? ORDER BY timestamp DESC",
    [req.params.category],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }
      res.json(results);
    }
  );
});

// Get a specific announcement
router.get("/:id", (req, res) => {
  db.query(
    "SELECT * FROM announcements WHERE id = ?",
    [req.params.id],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: "Announcement not found" });
      }
      res.json(results[0]);
    }
  );
});

// Create a new announcement (admin only)
router.post("/", auth, (req, res) => {
  const { title, content, category, type, block } = req.body;

  if (!title || !content || !category || !type) {
    return res.status(400).json({ error: "Required fields missing" });
  }

  const insertQuery = `
    INSERT INTO announcements 
    (title, content, category, typec, block, admin_id) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    insertQuery,
    [
      title,
      content,
      category,
      type,
      type === "Block Specific" ? block : null,
      req.user.id,
    ],
    (err, result) => {
      if (err) {
        console.error("DB error:", err);
        return res.status(500).json({ error: "Failed to create announcement" });
      }
      res.status(201).json({
        message: "Announcement created successfully",
        id: result.insertId,
      });
    }
  );
});


module.exports = router;