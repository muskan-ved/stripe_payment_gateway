const express = require("express");
const { PaymentAccept, GetpaymentDetailsBycheckoutSessionIdPayment, CreateStripeAccount, StripeAccountLink, StripeAcceptPaymentGettingPercent, GetAllConnectedVendorsAccount, GetSessionAllPaymentInfo } = require("../controllers/stripeSessionController");

const router = express.Router();
router.post("/acceptpayment", PaymentAccept);
router.post("/getpaymentdetails", GetpaymentDetailsBycheckoutSessionIdPayment);
router.post("/createstripeaccount", CreateStripeAccount);
router.post("/stripeaccountlink", StripeAccountLink);
router.post("/stripeacceptpaymentgettingpercent", StripeAcceptPaymentGettingPercent);
router.post("/getallpaymentinfo", GetSessionAllPaymentInfo);
router.get("/getallconnectedvendorsaccount", GetAllConnectedVendorsAccount);



module.exports = router;
