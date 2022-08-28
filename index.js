const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db.js");
const accountRouter = require("./routes/account.routes.js");
const journalRouter = require("./routes/journal.routes.js");
const cors = require("cors");
const errorHandler = require("./middlewares/error_middleware.js");

// Configurations
dotenv.config();
const app = express();
connectDB();
const port = process.env.PORT || 5000;

// Middlewares
app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Routes
app.use("/api/account", accountRouter);
app.use("/api/journal", journalRouter);

// Error Handler Middleware
app.use(errorHandler);

// Listning to port
app.listen(port, () => console.log(`Server started on port ${port}`));
