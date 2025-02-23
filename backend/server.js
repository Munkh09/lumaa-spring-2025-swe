require('dotenv').config();
const express = require('express');
const pool = require('./db');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const bcrypt = require('bcrypt');
const cors = require('cors');
const requireAuth = require('./middleware/requireAuth') 

const app = express();

app.use(express.json());
app.use(cors());

// 1. Register User
app.post("/auth/register", async (req, res) => {
    const { username, password } = req.body;

    // 1. check if both username and password are provided
    if (!username || !password) {
        return res.status(400).json({ error: 'All fields must be filled' });
    }

    // 2. check if password has at least (8 chars, 1 low, 1 up, 1 num, 1 symbol)
    if (!validator.isStrongPassword(password)) {
        return res.status(400).json({ error: 'Password should contain at least 8 characters, 1 uppercase and 1 lowercase letters, 1 number, and 1 symbol' });
    }

    try {
        // 3. hash the password with salt = 10
        const hashed_password = await bcrypt.hash(password, 10);

        // 4. insert the user in the database
        const result = await pool.query('INSERT INTO users (username, hashed_password) VALUES ($1, $2) RETURNING id;', [username, hashed_password]);

        // 5. create accessToken using the userId
        const userId = result.rows[0].id;
        const accessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "30m" });

        res.status(201).json({ userId: userId, username: username, token: accessToken });

    } catch (error) {
        console.log("Login error:", error);
        // check if username already exists
        if (error.code === '23505') {
            return res.status(409).json({ error: 'Username already exists' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 2. Login user
app.post("/auth/login", async (req, res) => {
    const { username, password } = req.body;

    // 1. check if both username and password are provided
    if (!username || !password) {
        return res.status(400).json({ error: 'All fields must be filled' });
    }

    try {
        // 2. check if the username exists in the database
        const userResult = await pool.query('SELECT * FROM users WHERE username = $1;', [username]);

        if (userResult.rows.length === 0) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        const user = userResult.rows[0];

        // 3. check if the password matches
        const match = await bcrypt.compare(password, user.hashed_password);

        if (!match) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        // 4. Create an access token based on userId
        const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "30m" });
        res.status(200).json({
            userId: user.id,
            username: user.username,
            token: accessToken
        });

    } catch (error) {
        console.log("Login error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


// 3. CRUD - Protected Routes
app.get("/tasks", requireAuth, async (req, res) => {
    try {
        const userId = req.userId
        const result = await pool.query("SELECT * FROM tasks WHERE user_id = $1;", [userId]);
        res.status(200).send(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})



app.post("/tasks", requireAuth, async (req, res) => {
    const { title, description, isComplete } = req.body
    const userId = req.userId 
    try {
        if (title === "") {
            throw new Error("Title is missing");
        }
        const result = await pool.query('INSERT INTO tasks (title, description, is_complete, user_id) VALUES ($1, $2, $3, $4) RETURNING *;', [title, description, isComplete, userId]);
        res.status(200).json({ addedTask: result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})

app.delete("/tasks/:id", requireAuth, async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json({ deletedTask: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
})

app.put('/tasks/:id', requireAuth, async (req, res) => {
    const { id } = req.params;
    const { title, description, isComplete } = req.body;

    if (!title) {
        return res.status(400).json({ error: 'Title is required' });
    }

    try {
        const result = await pool.query(
            'UPDATE tasks SET title = $1, description = $2, is_complete = $3 WHERE id = $4 RETURNING *',
            [title, description, isComplete, id]
        )

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.status(200).json({ updatedTask: result.rows[0] });
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ error: 'Server error' });
    }
})

app.listen(process.env.PORT, () => {
    console.log(`API is listening for requests on port ${process.env.PORT}`);
});










