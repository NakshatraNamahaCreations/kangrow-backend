const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

// Route to initiate payment for a user
router.post("/initiate/:userId", paymentController.initiatePayment);

// Route to handle payment callback
router.get("/callback/:userId", paymentController.handlePaymentCallback);

module.exports = router;



