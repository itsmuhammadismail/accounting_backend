const mongoose = require("mongoose");

const journalSchema = mongoose.Schema(
  {
    date: {
      type: Date,
      required: [true, "Please add date"],
    },
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
    },
    particular: {
      type: String,
    },
    amount: Number,
    transaction_type: {
      type: String,
      enum: ["debit", "credit"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Journal", journalSchema);
