const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], required: true },
    status: { type: String, enum: ["active", "inactive"], required: true },
    createdAt: { type: String },
    updatedAt: { type: String },
  },
  {
    // Strip _id and __v from JSON output so the API response is identical
    // to the old JSON-file format the frontend already expects.
    toJSON: {
      transform: (_doc, ret) => {
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

module.exports = mongoose.model("User", userSchema);
