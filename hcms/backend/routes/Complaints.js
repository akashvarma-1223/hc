const express = require("express");
const router = express.Router();
const db = require("../db");
const { auth } = require("../middleware/auth");

router.get("/", auth, (req, res) => {
  if (req.user.role === "admin") {
    db.query("SELECT * FROM complaints ORDER BY submitted DESC", (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }
      res.json(results);
    });
  } else {
    db.query(
      "SELECT * FROM complaints ORDER BY submitted DESC",
      (err, results) => {
        if (err) {
          return res.status(500).json({ error: "Database error" });
        }
        res.json(results);
      }
    );
  }
});

router.get("/status/:status", auth, (req, res) => {
  db.query(
    "SELECT * FROM complaints WHERE status = ? ORDER BY submitted DESC",
    [req.params.status],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }
      res.json(results);
    }
  );
});

router.get("/:id", auth, (req, res) => {
  const query = req.user.role === "admin" 
    ? "SELECT * FROM complaints WHERE id = ?"
    : "SELECT * FROM complaints WHERE id = ? AND user_id = ?";
  
  const params = req.user.role === "admin" 
    ? [req.params.id]
    : [req.params.id, req.user.id];

  db.query(query, params, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Complaint not found" });
    }
    res.json(results[0]);
  });
});

router.post("/", auth, (req, res) => {
  const { roomNo, title, category, description, hblock, date, is_anonymous, typec } = req.body;

  if (!roomNo || !title || !category || !description || !date || !hblock) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const formattedDate = new Date(date);
  if (isNaN(formattedDate.getTime())) {
    return res.status(400).json({ error: "Invalid date format" });
  }

  db.query(
    "INSERT INTO complaints (room, title, category, description, hblock, date, is_anonymous, user_id, typec) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [roomNo, title, category, description, hblock, formattedDate, is_anonymous || false, req.user.id, typec],
  
    (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Failed to create complaint" });
      }

      res.status(201).json({
        message: "Complaint created successfully",
        complaint: {
          id: result.insertId,
          roomNo,
          title,
          category,
          description,
          hblock,
          typec,
          date: formattedDate.toISOString().split("T")[0],
          is_anonymous: is_anonymous || false,
          status: "pending",
          submitted: new Date(),
          user_id: req.user.id,
        },
      });
    }
  );
});

router.put("/:id", auth, (req, res) => {
  const { room, description, hblock, is_anonymous } = req.body;

  if (!room || !description || !hblock) {
    return res.status(400).json({ error: "Required fields missing" });
  }

  db.query(
    "UPDATE complaints SET room = ?, description = ?, hblock = ?, is_anonymous = ? WHERE id = ? AND user_id = ?",
    [room, description, hblock, is_anonymous || false, req.params.id, req.user.id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Failed to update complaint" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Complaint not found or you don't have permission" });
      }
      res.json({ message: "Complaint updated successfully" });
    }
  );
});

router.patch("/:id/status", auth, (req, res) => {
  const { status } = req.body;

  if (!status || !['pending', 'inProgress', 'resolved'].includes(status)) {
    return res.status(400).json({ error: "Valid status required" });
  }

  db.query(
    "UPDATE complaints SET status = ? WHERE id = ?",
    [status, req.params.id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Failed to update status" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Complaint not found" });
      }
      res.json({ message: "Status updated successfully" });
    }
  );
});

router.delete("/:id", auth, (req, res) => {
  const query = req.user.role === "admin" 
    ? "DELETE FROM complaints WHERE id = ?"
    : "DELETE FROM complaints WHERE id = ? AND user_id = ?";
  
  const params = req.user.role === "admin" 
    ? [req.params.id]
    : [req.params.id, req.user.id];

  db.query(query, params, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Failed to delete complaint" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Complaint not found or you don't have permission" });
    }
    res.json({ message: "Complaint deleted successfully" });
  });
});

module.exports = router;
