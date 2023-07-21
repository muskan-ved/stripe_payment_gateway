const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
const paymentRouter = require("./routes/payment.router");
const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(paymentRouter);

app.listen(port, () => {
  console.log(`Server Connected Successfully at ${port}`);
});
