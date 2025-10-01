const express = require("express");
const router = express.Router();
const db = require("../db");
const { auth } = require("../middleware/auth");
const multer = require("multer");

// Multer setup: store file in memory as a buffer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// 🔹 GET All Items (include image blob and image_url)
router.get("/", (req, res) => {
  db.query(
    "SELECT id, name, description, location, status, reported_by, additional_details, date, image, user_id FROM lost_found_items ORDER BY date DESC",
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }

      // Convert images to base64 format with the correct MIME type (PNG)
      const processedResults = results.map(item => {
        if (item.image) {
          item.image = `data:image/png;base64,${item.image.toString("base64")}`;
        }
        return item;
      });

      res.json(processedResults);
    }
  );
});

// 🔹 GET a Single Item (with image converted to base64 if needed)
router.get("/:id", (req, res) => {
  db.query(
    "SELECT * FROM lost_found_items WHERE id = ?",
    [req.params.id],
    (err, results) => {
      if (err) {
        console.error("Database error:", err);  // 🔹 Log error
        return res.status(500).json({ error: "Database error Status 500" });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: "Item not found Status 404" });
      }
      
      const item = results[0];

      // Convert the image blob to base64 if present and valid
      if (item.image && Buffer.isBuffer(item.image)) {
        item.image = `data:image/png;base64,${item.image.toString("base64")}`;
      } else if (item.image_url && typeof item.image_url === "string") {
        item.image = item.image_url;
      }

      res.json(item);
    }
  );
});

// 🔹 GET Item Image as a Separate Endpoint
router.get("/image/:id", (req, res) => {
  db.query(
    "SELECT image FROM lost_found_items WHERE id = ?",
    [req.params.id],
    (err, results) => {
      if (err || results.length === 0 || !results[0].image) {
        return res.status(404).json({ error: "Image not found" });
      }
      // Set appropriate Content-Type header (adjust if you expect other image types)
      res.setHeader("Content-Type", "image/png");
      res.send(results[0].image);
    }
  );
});

// 🔹 POST New Lost/Found Item (with image upload as BLOB)
router.post("/", auth, upload.single("image"), (req, res) => {
  const { name, description, location, status, additional_details } = req.body;

  // Validate required fields
  if (!name || !description || !location || !status) {
    return res.status(400).json({ error: "Required fields missing" });
  }

  // Validate image type if an image is uploaded
  if (req.file && req.file.mimetype !== "image/png") {
    return res.status(400).json({ error: "Only PNG images are allowed" });
  }

  // Get image buffer if available
  const image = req.file ? req.file.buffer : null;

  db.query(
    "INSERT INTO lost_found_items (name, description, location, status, reported_by, additional_details, image, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [name, description, location, status, req.user.email, additional_details, image, req.user.id],
    (err, result) => {
      if (err) {
        console.error("Error inserting item:", err);
        return res.status(500).json({ error: "Failed to create item" });
      }
      res.status(201).json({ message: "Item created successfully", id: result.insertId });
    }
  );
});


// 🔹 UPDATE Lost/Found Item (with optional image update)
// router.put("/:id", auth, upload.single("image"), (req, res) => {
//   const { name, description, location, status, additional_details } = req.body;
//   const image = req.file ? req.file.buffer : null;

//   if (!name || !description || !location || !status) {
//     return res.status(400).json({ error: "Required fields missing" });
//   }

//   const query = image
//     ? "UPDATE lost_found_items SET name = ?, description = ?, location = ?, status = ?, additional_details = ?, image = ? WHERE id = ?"
//     : "UPDATE lost_found_items SET name = ?, description = ?, location = ?, status = ?, additional_details = ? WHERE id = ?";

//   const params = image
//     ? [name, description, location, status, additional_details, image, req.params.id]
//     : [name, description, location, status, additional_details, req.params.id];

//   db.query(query, params, (err, result) => {
//     if (err) {
//       return res.status(500).json({ error: "Failed to update item" });
//     }
//     if (result.affectedRows === 0) {
//       return res.status(404).json({ error: "Item not found" });
//     }
//     res.json({ message: "Item updated successfully" });
//   });
// });

// 🔹 UPDATE Status of an Item
router.patch("/:id/status", auth, (req, res) => {
  const { status } = req.body;

  if (!status || !['lost', 'found', 'claimed','With Caretaker'].includes(status)) {
    return res.status(400).json({ error: "Valid status required" });
  }

  db.query(
    "UPDATE lost_found_items SET status = ? WHERE id = ?",
    [status, req.params.id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Failed to update status" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Item not found" });
      }
      res.json({ message: "Status updated successfully" });
    }
  );
});

// 🔹 DELETE Lost/Found Item
router.delete("/:id", auth, (req, res) => {
  db.query(
    "DELETE FROM lost_found_items WHERE id = ?",
    [req.params.id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Failed to delete item" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Item not found" });
      }
      res.json({ message: "Item deleted successfully" });
    }
  );
});

module.exports = router;
