const express = require("express");
const {
  getAll,
  create,
  deleteAccount,
} = require("../controllers/account.controller.js");

const router = express.Router();

router.get("/", getAll);
router.post("/", create);
router.delete("/", deleteAccount);

module.exports = router;
