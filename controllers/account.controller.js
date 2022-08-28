const expressAsyncHandler = require("express-async-handler");

const Account = require("../models/account.model.js");

// @desc    Get all accounts
// @route   GET /api/account
// @access  public
const getAll = expressAsyncHandler(async (req, res) => {
  const accounts = await Account.find();

  res.status(200).json(accounts);
});

// @desc    Create new account
// @route   POST /api/account
// @access  public
const create = expressAsyncHandler(async (req, res) => {
  const { name, type } = req.body;
  const account = await Account.create({
    name,
    type,
  });

  res.status(201).json(account);
});

module.exports = {
  getAll,
  create,
};
