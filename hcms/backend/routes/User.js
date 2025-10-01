const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");
const { auth } = require("../middleware/auth");

router.get("/me", auth, (req, res) => {
  res.json({ userId: req.user.id,username: req.user.username,block:req.user.hostelblock});
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  console.log(req.body);

  db.query("SELECT * FROM users WHERE username = ?", [username], async (err, results) => {
    if (err || results.length === 0) {
      return res.status(401).json({ error: "Invalid Username" });
    }
    console.log(results);

    const user = results[0];
    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log(passwordMatch);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = jwt.sign({ username: user.username, id: user.id, email: user.email, role: user.role }, "manhaasapp", {
      expiresIn: "1h",
    });

    res.json({ message: "Login successful", token, user: { username: user.username, id: user.id, email: user.email, role: user.role} });
  });
});

// Get full profile details
router.get("/profile", auth, (req, res) => {
  db.query("SELECT * FROM users WHERE id = ?", [req.user.id], (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    const user = results[0];
    res.json({
      name: user.name,
      rollnumber: user.rollnumber,
      roomNo: user.roomNo,
      hostelblock: user.hostelblock,
      email: user.email,
    });
  });
});
router.get("/:id", (req, res) => {
  const userId = req.params.id;

  db.query("SELECT * FROM users WHERE id = ?", [userId], (err, results) => {
    if (err) {
      console.error("Error fetching user by ID:", err);
      return res.status(500).json({ message: "Server error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(results[0]);
  });
});


module.exports = router;
