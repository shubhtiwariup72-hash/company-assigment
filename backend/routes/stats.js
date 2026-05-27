const router = require("express").Router();
const { authenticate } = require("../middleware/auth");
const { getStats } = require("../controllers/statsController");

router.get("/", authenticate, getStats);

module.exports = router;
