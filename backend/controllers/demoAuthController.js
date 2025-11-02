import jwt from "jsonwebtoken";

// Demo users storage (in-memory for demo purposes)
const demoUsers = new Map();

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if user already exists
    if (demoUsers.has(email)) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Store user (in a real app, password would be hashed)
    const userId = Date.now().toString();
    demoUsers.set(email, {
      id: userId,
      username,
      email,
      password, // In demo mode - don't hash for simplicity
      createdAt: new Date()
    });

    console.log(`✅ Demo user registered: ${username} (${email})`);
    res.json({ message: "Registration successful" });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find user
    const user = demoUsers.get(email);
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    // Check password (in demo mode - plain text comparison)
    if (user.password !== password) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const jwtSecret = process.env.JWT_SECRET || "demo-secret-key-2024";
    const token = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: "7d" });

    console.log(`✅ Demo user logged in: ${user.username} (${email})`);
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get demo stats
export const getDemoStats = async (req, res) => {
  try {
    res.json({
      totalUsers: demoUsers.size,
      users: Array.from(demoUsers.values()).map(user => ({
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt
      }))
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Clear demo data
export const clearDemoData = async (req, res) => {
  try {
    demoUsers.clear();
    console.log("🧹 Demo data cleared");
    res.json({ message: "Demo data cleared successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
