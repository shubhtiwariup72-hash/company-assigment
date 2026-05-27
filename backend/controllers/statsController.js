const User = require("../models/User");
const Product = require("../models/Product");
const MonthlyStats = require("../models/MonthlyStats");

const getStats = async (req, res) => {
  try {
    const [totalUsers, activeUsers, products, monthlyStats] = await Promise.all([
      User.countDocuments({}),
      User.countDocuments({ status: "active" }),
      Product.find({ status: "active" }),
      MonthlyStats.find({}).sort({ _id: 1 }),
    ]);

    const totalProducts = await Product.countDocuments({});
    const revenue = parseFloat(
      products.reduce((sum, p) => sum + p.price, 0).toFixed(2)
    );

    return res.json({
      success: true,
      message: "Stats fetched successfully",
      data: {
        totalUsers,
        activeUsers,
        totalProducts,
        revenue,
        monthlyStats: monthlyStats.map((s) => s.toJSON()),
      },
    });
  } catch (err) {
    console.error("getStats error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = { getStats };
