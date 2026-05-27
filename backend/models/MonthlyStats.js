const mongoose = require("mongoose");

const monthlyStatsSchema = new mongoose.Schema(
  {
    month: { type: String, required: true },
    users: { type: Number, required: true },
    revenue: { type: Number, required: true },
  },
  {
    toJSON: {
      transform: (_doc, ret) => {
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

module.exports = mongoose.model("MonthlyStats", monthlyStatsSchema);
