const { v4: uuidv4 } = require("uuid");
const User = require("../models/User");

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    const data = users.map((u) => {
      const obj = u.toJSON();
      delete obj.password;
      return obj;
    });
    return res.json({ success: true, message: "Users fetched successfully", data });
  } catch (err) {
    console.error("getUsers error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.id });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    const obj = user.toJSON();
    delete obj.password;
    return res.json({ success: true, message: "User fetched successfully", data: obj });
  } catch (err) {
    console.error("getUserById error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, role, status, password } = req.body;

    if (!name || !email || !role || !status) {
      return res.status(400).json({ success: false, message: "Name, email, role, and status are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }

    const exists = await User.findOne({ email: email.trim().toLowerCase() });
    if (exists) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    const newUser = await User.create({
      id: uuidv4(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: password || "Pass@123",
      role,
      status,
      createdAt: new Date().toISOString(),
    });

    const obj = newUser.toJSON();
    delete obj.password;
    return res.status(201).json({ success: true, message: "User created successfully", data: obj });
  } catch (err) {
    console.error("createUser error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, email, role, status } = req.body;

    const user = await User.findOne({ id: req.params.id });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (email && email.toLowerCase() !== user.email) {
      const emailExists = await User.findOne({
        email: email.trim().toLowerCase(),
        id: { $ne: req.params.id },
      });
      if (emailExists) {
        return res.status(400).json({ success: false, message: "Email already in use" });
      }
    }

    if (name) user.name = name.trim();
    if (email) user.email = email.trim().toLowerCase();
    if (role) user.role = role;
    if (status) user.status = status;
    user.updatedAt = new Date().toISOString();

    await user.save();

    const obj = user.toJSON();
    delete obj.password;
    return res.json({ success: true, message: "User updated successfully", data: obj });
  } catch (err) {
    console.error("updateUser error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ id: req.params.id });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    return res.json({ success: true, message: "User deleted successfully", data: null });
  } catch (err) {
    console.error("deleteUser error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = { getUsers, getUserById, createUser, updateUser, deleteUser };
