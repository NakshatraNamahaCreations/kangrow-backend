const mongoose = require("mongoose");
const User = mongoose.model("User");
const fetch = require("node-fetch");

// Environment variables for PhonePe credentials
const CLIENT_ID = "SU2509091920287287979611";
const CLIENT_SECRET = "cf10fdbb-3698-4e2a-b1d6-78dec9ba4a9f";
const PHONEPE_API_BASE = "https://api.phonepe.com/apis";

// Helper function to get PhonePe access token
async function getAccessToken() {
  const headers = new Headers();
  headers.append("Content-Type", "application/x-www-form-urlencoded");

  const body = new URLSearchParams();
  body.append("client_id", CLIENT_ID);
  body.append("client_version", "1");
  body.append("client_secret", CLIENT_SECRET);
  body.append("grant_type", "client_credentials");

  try {
    const response = await fetch(
      `${PHONEPE_API_BASE}/identity-manager/v1/oauth/token`,
      {
        method: "POST",
        headers,
        body,
      }
    );
    const data = await response.json();
    if (!data.access_token) throw new Error("Failed to get access token");
    return data.access_token;
  } catch (error) {
    throw new Error(`Access token error: ${error.message}`);
  }
}


exports.initiatePayment = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findOne({ uniqueId: userId });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.status === "subscribe") {
      return res.status(400).json({ error: "User already subscribed" });
    }

    const accessToken = await getAccessToken();

    const paymentData = {
      merchantOrderId: `TX${Date.now()}${Math.floor(Math.random() * 1000)}`,
      amount: 100, // Amount in paise (1 INR = 100 paise)
      expireAfter: 1200,
      metaInfo: {
        userId: user.uniqueId,
        name: user.name,
      },
      paymentFlow: {
        type: "PG_CHECKOUT",
        message: `Subscription payment for ${user.name}`,
        merchantUrls: {
          redirectUrl: `http://your-domain.com/api/payment/callback/${user.uniqueId}`,
        },
      },
    };

    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", `O-Bearer ${accessToken}`);

    const response = await fetch(`${PHONEPE_API_BASE}/pg/checkout/v2/pay`, {
      method: "POST",
      headers,
      body: JSON.stringify(paymentData),
    });

    const result = await response.json();

    if (result.state === "PENDING") {
      // Payment is pending, pass the redirect URL to frontend
      res.status(200).json({
        message: "Payment initiated, awaiting user action.",
        paymentUrl: result.redirectUrl,
        transactionId: paymentData.merchantOrderId,
      });
    } else {
      // Handle failure or other states
      console.error("Payment initiation failed:", result);
      throw new Error(result.message || "Payment initiation failed");
    }
  } catch (error) {
    console.error("Error initiating payment:", error);
    res
      .status(500)
      .json({ error: `Payment initiation error: ${error.message}` });
  }
};

// Controller to handle payment callback
exports.handlePaymentCallback = async (req, res) => {
  try {
    const { userId } = req.params;
    const { transactionId, status } = req.query; // Assuming PhonePe sends status in callback

    const user = await User.findOne({ uniqueId: userId });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (status === "SUCCESS") {
      user.status = "subscribe";
      await user.save();
      res.status(200).json({
        message: "Payment successful, user status updated to subscribed",
      });
    } else {
      res.status(400).json({ message: "Payment failed or cancelled" });
    }
  } catch (error) {
    res.status(500).json({ error: `Callback error: ${error.message}` });
  }
};



