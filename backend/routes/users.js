const router = require("express").Router();
const { authenticate } = require("../middleware/auth");
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/usersController");

router.get("/", authenticate, getUsers);
router.get("/:id", authenticate, getUserById);
router.post("/", authenticate, createUser);
router.put("/:id", authenticate, updateUser);
router.delete("/:id", authenticate, deleteUser);

module.exports = router;
