const express = require("express");
const {
  getAll,
  deleteAll,
  create,
  ledger,
  trial,
  incomeStatement,
  balanceSheet,
} = require("../controllers/journal.controller.js");

const router = express.Router();

router.get("/", getAll);
router.delete("/", deleteAll);
router.post("/", create);
router.get("/ledger", ledger);
router.get("/trial", trial);
router.get("/income", incomeStatement);
router.get("/balance", balanceSheet);

module.exports = router;
