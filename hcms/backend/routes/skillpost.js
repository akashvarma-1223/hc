const express = require("express");
const router = express.Router();
const db = require("../db"); // MySQL database connection
const {auth} = require("../middleware/auth"); // Middleware for authentication

// 🟢 CREATE a new skill post
router.post("/", auth, async (req, res) => {
    const { postType, category, title, description, venue, timings, maxPeople } = req.body;
    const userId = req.user.id;

    if (!postType || !category || !title || !venue || !timings) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        const sql = `
            INSERT INTO skillpost (postType, category, title, description, venue, timings, maxPeople, userId) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.promise().execute(sql, [
            postType, category, title, description, venue, timings, maxPeople || 1, userId
        ]);

        res.status(201).json({ message: "Skill post created successfully", post_id: result.insertId });
    } catch (error) {
        console.error("Error inserting skill post:", error);
        res.status(500).json({ message: "Failed to insert skill post" });
    }
});

// 🔵 GET all skill posts (including username and current participants)
router.get("/", async (req, res) => {
    try {
        const [posts] = await db.promise().execute(`
            SELECT s.*, u.name AS postedBy, 
                (SELECT COUNT(*) FROM skillpost_interests WHERE skillpost_id = s.id) AS currentParticipants
            FROM skillpost s 
            JOIN users u ON s.userId = u.id
            ORDER BY s.created_at DESC
        `);

        res.status(200).json(posts);
    } catch (error) {
        console.error("Error fetching skill posts:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/joined", auth, async (req, res) => {
    const userId = req.user.id; // Get the authenticated user ID

    try {
        const [posts] = await db.promise().execute(`
            SELECT s.*, u.name AS postedBy 
            FROM skillpost s
            JOIN skillpost_interests si ON s.id = si.skillpost_id
            JOIN users u ON s.userId = u.id
            WHERE si.user_id = ?
            ORDER BY s.created_at DESC
        `, [userId]);

        res.status(200).json(posts);
    } catch (error) {
        console.error("Error fetching joined skill posts:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
router.get("/joined/:userId", auth, (req, res) => {
    const { userId } = req.params;

    const sql = `
        SELECT sp.id, sp.postType, sp.category, sp.title, sp.description, 
               sp.venue, sp.timings, sp.maxPeople, sp.currentParticipants, 
               sp.userId AS userId, u.name AS postedBy
        FROM skillpost_interests si
        JOIN skillpost sp ON si.skillpost_id = sp.id
        JOIN users u ON sp.userId = u.id
        WHERE si.user_id = ?
        ORDER BY sp.created_at DESC
    `;

    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error("Error fetching joined skill posts:", err);
            return res.status(500).json({ error: "Server error" });
        }

        res.json(results);
    });
});


// 🟠 GET a single skill post by ID
router.get("/user/:userId", auth, (req, res) => {
    const { userId } = req.params;

    const sql = `SELECT p.id,p.userId AS userId, u.name AS postedBy, p.postType, p.category, 
                        p.title, p.description, p.venue, p.timings, 
                        p.maxPeople, p.currentParticipants, p.created_at
                 FROM skillpost p
                 JOIN users u ON p.userId = u.id
                 WHERE p.userId = ?
                 ORDER BY p.created_at DESC`;

    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error("Error fetching user skill posts:", err);
            return res.status(500).json({ error: "Server error" });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "No skill-sharing posts found for this user" });
        }

        res.json(results);
    });
});





// 🟢 Express Interest in a Skill Post
router.post("/:id/interest", auth, async (req, res) => {
    const { id } = req.params; // Skill post ID
    const userId = req.user.id; // Authenticated user

    try {
        // Check if post exists
        const [[post]] = await db.promise().execute("SELECT maxPeople FROM skillpost WHERE id = ?", [id]);
        if (!post) {
            return res.status(404).json({ message: "Skill post not found" });
        }

        // Check if user already showed interest
        const [[existingInterest]] = await db.promise().execute(
            "SELECT * FROM skillpost_interests WHERE skillpost_id = ? AND user_id = ?",
            [id, userId]
        );

        if (existingInterest) {
            return res.status(400).json({ message: "You have already expressed interest in this post" });
        }

        // Get current participants count
        const [[{ currentParticipants }]] = await db.promise().execute(
            "SELECT COUNT(*) AS currentParticipants FROM skillpost_interests WHERE skillpost_id = ?",
            [id]
        );

        if (currentParticipants >= post.maxPeople) {
            return res.status(400).json({ message: "Maximum participants reached" });
        }

        // Add interest
        await db.promise().execute(
            "INSERT INTO skillpost_interests (skillpost_id, user_id) VALUES (?, ?)",
            [id, userId]
        );

        res.status(201).json({ message: "Interest added successfully" });
    } catch (error) {
        console.error("Error expressing interest:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
router.post("/:id/leave", auth, async (req, res) => {
    const { id } = req.params; // Skill post ID
    const userId = req.user.id; // Authenticated user

    try {
        // Check if user has joined the post
        const [[existingEntry]] = await db.promise().execute(
            "SELECT * FROM skillpost_interests WHERE skillpost_id = ? AND user_id = ?",
            [id, userId]
        );

        if (!existingEntry) {
            return res.status(400).json({ message: "You have not joined this skill-sharing session" });
        }

        // Remove the user from the post
        const [result] = await db.promise().execute(
            "DELETE FROM skillpost_interests WHERE skillpost_id = ? AND user_id = ?",
            [id, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(400).json({ message: "Failed to leave the skill-sharing session" });
        }

        res.status(200).json({ message: "You have successfully left the skill-sharing session" });
    } catch (error) {
        console.error("Error leaving skill post:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// 🔴 Remove Interest in a Skill Post
router.delete("/:id/interest", auth, async (req, res) => {
    const { id } = req.params; // Skill post ID
    const userId = req.user.id;

    try {
        const [result] = await db.promise().execute(
            "DELETE FROM skillpost_interests WHERE skillpost_id = ? AND user_id = ?",
            [id, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(400).json({ message: "You haven't expressed interest in this post" });
        }

        res.status(200).json({ message: "Interest removed successfully" });
    } catch (error) {
        console.error("Error removing interest:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// 🟡 Get all users interested in a specific skill post
router.get("/:id/interested-users", async (req, res) => {
    const { id } = req.params;

    try {
        const [users] = await db.promise().execute(`
            SELECT u.id, u.name, si.interested_at
            FROM skillpost_interests si
            JOIN users u ON si.user_id = u.id
            WHERE si.skillpost_id = ?
        `, [id]);

        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching interested users:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
// 🟢 Join a Skill Post
router.post("/:postId/join", auth, async (req, res) => {
    const { postId } = req.params;
    const userId = req.user.id;

    try {
        // Check if the skill post exists
        const [[post]] = await db.promise().execute(
            "SELECT maxPeople FROM skillpost WHERE id = ?", 
            [postId]
        );

        if (!post) {
            return res.status(404).json({ message: "Skill post not found" });
        }

        // Check if the user has already joined
        const [[existingEntry]] = await db.promise().execute(
            "SELECT * FROM skillpost_interests WHERE skillpost_id = ? AND user_id = ?", 
            [postId, userId]
        );

        if (existingEntry) {
            return res.status(400).json({ message: "You have already joined this skill post" });
        }

        // Get the current number of participants
        const [[{ currentParticipants }]] = await db.promise().execute(
            "SELECT COUNT(*) AS currentParticipants FROM skillpost_interests WHERE skillpost_id = ?", 
            [postId]
        );

        if (currentParticipants >= post.maxPeople) {
            return res.status(400).json({ message: "Maximum participants reached" });
        }

        // Add the user to the skill post
        await db.promise().execute(
            "INSERT INTO skillpost_interests (skillpost_id, user_id) VALUES (?, ?)", 
            [postId, userId]
        );

        res.status(201).json({ message: "Successfully joined the skill post" });
    } catch (error) {
        console.error("Error joining skill post:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


module.exports = router;