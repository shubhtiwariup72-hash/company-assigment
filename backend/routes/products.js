const router = require("express").Router();
const { authenticate } = require("../middleware/auth");
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productsController");

router.get("/", authenticate, getProducts);
router.get("/:id", authenticate, getProductById);
router.post("/", authenticate, createProduct);
router.put("/:id", authenticate, updateProduct);
router.delete("/:id", authenticate, deleteProduct);

module.exports = router;
