const expressAsyncHandler = require("express-async-handler");

const Journal = require("../models/journal.model.js");
const Account = require("../models/account.model.js");

// @desc    Get all journal entries
// @route   GET /api/journal
// @access  public
const getAll = expressAsyncHandler(async (req, res) => {
  const journals = await Journal.find();

  res.status(200).json(journals);
});

// @desc    Delete all journal entries
// @route   DELETE /api/journal
// @access  public
const deleteAll = expressAsyncHandler(async (req, res) => {
  const journals = await Journal.deleteMany({});

  res.status(200).json(journals);
});

// @desc    Create new journal entry
// @route   POST /api/journal
// @access  public
const create = expressAsyncHandler(async (req, res) => {
  const { date, credit, debit } = req.body;

  for (let i = 0; i < debit.length; i++) {
    await Journal.create({
      date,
      account: debit[i].account,
      amount: debit[i].amount,
      particular: debit[i].particular,
      transaction_type: "debit",
    });
  }
  for (let i = 0; i < credit.length; i++) {
    await Journal.create({
      date,
      account: credit[i].account,
      amount: credit[i].amount,
      particular: credit[i].particular,
      transaction_type: "credit",
    });
  }

  res.status(201).json({ message: "Journal entry added successfully" });
});

// @desc    Get ledger of an account
// @route   GET /api/journal/ledger/:id
// @access  public
const ledger = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;

  const debitAccounts = await Journal.find({
    account: id,
    transaction_type: "debit",
  }).populate("account");
  const creditAccounts = await Journal.find({
    account: id,
    transaction_type: "credit",
  }).populate("account");

  let debitAmount = 0;
  for (let d of debitAccounts) {
    debitAmount += d.amount;
  }

  let creditAmount = 0;
  for (let c of creditAccounts) {
    creditAmount += c.amount;
  }

  let balance = {
    type: "debit",
    amount: Math.abs(creditAmount - debitAmount),
  };

  if (debitAmount > creditAmount) {
    balance.type = "credit";
  }

  const ledger = {
    debit: debitAccounts,
    credit: creditAccounts,
    balance: balance,
  };

  res.status(200).json(ledger);
});

// @desc    Get trial balance of accounts
// @route   GET /api/journal/trial
// @access  public
const trial = expressAsyncHandler(async (req, res) => {
  const accounts = await Account.find();

  let trialBalance = [];

  for (let i = 0; i < accounts.length; i++) {
    const debitAccounts = await Journal.find({
      account: accounts[i]._id,
      transaction_type: "debit",
    }).populate("account");
    const creditAccounts = await Journal.find({
      account: accounts[i]._id,
      transaction_type: "credit",
    }).populate("account");

    let debitAmount = 0;
    for (let d of debitAccounts) {
      debitAmount += d.amount;
    }

    let creditAmount = 0;
    for (let c of creditAccounts) {
      creditAmount += c.amount;
    }

    let balance = {
      type: "debit",
      amount: Math.abs(creditAmount - debitAmount),
    };

    if (debitAmount > creditAmount) {
      balance.type = "credit";
    }

    trialBalance.push({
      account: accounts[i].name,
      balance: balance.amount,
      type: balance.type,
    });
  }

  res.status(200).json(trialBalance);
});

// @desc    Get Income statement
// @route   GET /api/journal/income
// @access  public
const incomeStatement = expressAsyncHandler(async (req, res) => {
  const revenueAccounts = await Account.find({ type: "revenue" });
  const expenseAccounts = await Account.find({ type: "expense" });

  let revenuesArray = [];
  let totalRevenue = 0;

  for (let i = 0; i < revenueAccounts.length; i++) {
    const creditAccounts = await Journal.find({
      account: revenueAccounts[i]._id,
      transaction_type: "credit",
    }).populate("account");

    let amount = 0;
    for (let c of creditAccounts) {
      amount += c.amount;
      totalRevenue += c.amount;
    }

    revenuesArray.push({
      account: revenueAccounts[i].name,
      amount: amount,
    });
  }

  let expenseArray = [];
  let totalExpense = 0;

  for (let i = 0; i < expenseAccounts.length; i++) {
    const debitAccounts = await Journal.find({
      account: expenseAccounts[i]._id,
      transaction_type: "debit",
    }).populate("account");

    let amount = 0;
    for (let d of debitAccounts) {
      amount += d.amount;
      totalExpense += d.amount;
    }

    expenseArray.push({
      account: expenseAccounts[i].name,
      amount: amount,
    });
  }

  res.status(200).json({
    revenue: revenuesArray,
    expense: expenseArray,
    totar_revenue: totalRevenue,
    total_expense: totalExpense,
  });
});

// @desc    Get Balance Sheet
// @route   GET /api/journal/balance
// @access  public
const balanceSheet = expressAsyncHandler(async (req, res) => {
  const assetAccounts = await Account.find({ type: "asset" });
  const liabilityAccouns = await Account.find({
    $or: [{ type: "liability" }, { type: "capital" }],
  });

  let assetArray = [];
  let totalAsset = 0;

  for (let i = 0; i < assetAccounts.length; i++) {
    const creditAccounts = await Journal.find({
      account: assetAccounts[i]._id,
      transaction_type: "credit",
    }).populate("account");

    let amount = 0;
    for (let c of creditAccounts) {
      amount += c.amount;
      totalAsset += c.amount;
    }

    assetArray.push({
      account: assetAccounts[i].name,
      amount: amount,
    });
  }

  let liabilityArray = [];
  let totalLiability = 0;

  for (let i = 0; i < liabilityAccouns.length; i++) {
    const debitAccounts = await Journal.find({
      account: liabilityAccouns[i]._id,
      transaction_type: "debit",
    }).populate("account");

    let amount = 0;
    for (let d of debitAccounts) {
      amount += d.amount;
      totalLiability += d.amount;
    }

    liabilityArray.push({
      account: liabilityAccouns[i].name,
      amount: amount,
    });
  }

  res.status(200).json({
    assets: assetArray,
    liabilities: liabilityArray,
    totar_asset: totalAsset,
    total_liability: totalLiability,
  });
});

module.exports = {
  getAll,
  deleteAll,
  create,
  ledger,
  trial,
  incomeStatement,
  balanceSheet,
};
