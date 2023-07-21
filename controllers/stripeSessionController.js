require("dotenv").config();
const stripe = require("stripe")(process.env.SECRET_KEY);

// Return URL of stripe payment
exports.PaymentAccept = async (req, res) => {
  const { productName, amount, quantity } = req.body;
  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: productName,
            },
            unit_amount: amount * 100,
          },
          quantity: quantity,
        },
      ],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/paymentsuccess/{CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/paymentcancel`,
    });
    res.status(201).json({ returnurl: session.url });
  } catch (error) {
    console.log(error);
  }
};

// Get details of line item through session.id
exports.GetpaymentDetailsBycheckoutSessionIdPayment = async (req, res) => {
  const { cs_test_key } = req.body;
  try {
    stripe.checkout.sessions.listLineItems(
      cs_test_key,
      { limit: 2 },
      function (err, lineItems) {
        res.status(200).json({ orderdetails: lineItems });
      }
    );
  } catch (error) {
    console.log(error);
  }
};

// Create stripe express account
exports.CreateStripeAccount = async (req, res) => {
  const { url, name, product_description } = req.body;
  console.log(req.body);

  const account = await stripe.accounts.create({
    country: "US",
    type: "express",
    capabilities: {
      card_payments: {
        requested: true,
      },
      transfers: {
        requested: true,
      },
    },
    business_type: "individual",
    business_profile: {
      url: url,
      name: name,
      product_description: product_description,
    },
  });

  res.status(200).send(account);
};

// Get a link by created account_id through that link we can do restriced status to complated status
exports.StripeAccountLink = async (req, res) => {
  const accountLink = await stripe.accountLinks.create({
    account: req.body.connected_acc_id,
    refresh_url: "https://mangoit-lms.mangoitsol.com/",
    return_url: "https://mangoit-lms.mangoitsol.com/",
    type: "account_onboarding",
  });
  res.status(200).send(accountLink);
};

// Stripe will take the amount of the credit (application_fee_amount) and the remaining return amount to the vendor.
exports.StripeAcceptPaymentGettingPercent = async (req, res) => {
  const {
    product_name,
    amount,
    quantity,
    stripe_fee_amount,
    connected_acc_id,
    success_url,
    cancel_url,
  } = req.body;
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: product_name,
          },
          unit_amount: amount * 100,
        },
        quantity: quantity,
      },
    ],
    payment_intent_data: {
      application_fee_amount: stripe_fee_amount,
      transfer_data: {
        destination: connected_acc_id,
      },
    },
    success_url: success_url,
    cancel_url: cancel_url,
  });

  res.status(200).send(session);
};

// Get a session all payment information by session_id
exports.GetSessionAllPaymentInfo = async (req, res) => {
  const { cs_test_key } = req.body;
  const retrieveSession = await stripe.checkout.sessions.retrieve(cs_test_key);
  res.status(200).send(retrieveSession);
};

// Get all connected vendors account
exports.GetAllConnectedVendorsAccount = async (req, res) => {
  const accounts = await stripe.accounts.list({
    limit: 10,
  });
  res.status(200).send(accounts);
};
