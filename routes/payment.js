const express = require("express");
const { StandardCheckoutPayRequest } = require("pg-sdk-node");
const { v4: uuidv4 } = require("uuid");
const phonePeClient = require("../utils/phonepeClient");
const User = require("../models/userModel");
const router = express.Router();

// 🚀 Initiate Payment
router.post("/initiate", async (req, res) => {
  try {
    const { amount, userId } = req.body;

    const merchantTransactionId = `order_${uuidv4()}`;

    // 👇 Use your app's deep link here
      const redirectUrl = `https://api.svkangrowhealth.com/api/payment/verify/${merchantTransactionId}?userId=${userId}`;

    const payRequest = StandardCheckoutPayRequest.builder()
      .merchantOrderId(merchantTransactionId)
      .amount(amount) // in paise
      .redirectUrl(redirectUrl)
      .build();

    const response = await phonePeClient.getClient().pay(payRequest);

    res.status(200).json({
      success: true,
      checkoutUrl: response.redirectUrl, // PhonePe checkout page
      merchantTransactionId,
    });
  } catch (err) {
    console.error("PhonePe Initiate Error:", err.message);
    res.status(500).json({ error: "Payment initiation failed" });
  }
});

// 🚀 Optional backend verify API (recommended)
// router.get("/verify/:txnId", async (req, res) => {
//   try {
//     const { txnId } = req.params;
//  const { userId } = req.query;
//        console.log("Verifying Payment:", txnId, "for User:", userId);

//     const status = await phonePeClient.getClient().getOrderStatus(txnId);
// console.log(status,"status")

//     if (status.state === "COMPLETED") {
      
//         res.redirect(`kangrow://Thankyoupage`);
      
//     } else {

//        res.redirect(`kangrow://FailurePage`);
//     }
//   } catch (err) {
//     console.error("PhonePe Verify Error:", err.message);
//     res.status(500).json({ error: "Error verifying payment" });
//   }
// });

router.get("/verify/:txnId", async (req, res) => {
  try {
    const { txnId } = req.params;
    const { userId } = req.query; // This is the uniqueId
    console.log("Verifying Payment:", txnId, "for User:", userId);

    const status = await phonePeClient.getClient().getOrderStatus(txnId);
    console.log(status, "status");

    if (status.state === "COMPLETED") {
      // Payment successful, update user status to 'subscribe'
      const user = await User.findOne({ uniqueId: userId }); // Search by uniqueId instead of _id
      if (user) {
        user.status = "subscribe"; // Update user status to 'subscribe'
        await user.save(); // Save updated user status
        console.log("User status updated to 'subscribe'");

        // Redirect to ThankYou page (app deep link)
        res.redirect("kangrow://Thankyoupage");
      } else {
        console.error("User not found");
        res.status(404).send("User not found");
      }
    } else {
      // Payment failed, redirect to Failure page
      res.redirect("kangrow://FailurePage");
    }
  } catch (err) {
    console.error("PhonePe Verify Error:", err.message);
    res.status(500).json({ error: "Error verifying payment" });
  }
});



module.exports = router;
