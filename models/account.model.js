const mongoose = require("mongoose");

const accountSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add name of account"],
      unique: true,
    },
    type: {
      type: String,
      enum: ["asset", "expense", "drawing", "liability", "revenue", "capital"],
      default: "asset",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Account", accountSchema);
