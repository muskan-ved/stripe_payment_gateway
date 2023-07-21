require("dotenv").config();
const stripe = require("stripe")(process.env.SECRET_KEY);

//stripe payment controller for react
const StripeCreateCustomer = async (req, res) => {
  //console.log(req.body);
  const {name, email, billing_address,amount,shipping} = req.body;
  
  try {
    // stripe create customer
    const customers = await stripe.customers.create({
      name: name,
      email: email,
      address: {
        line1: billing_address.line1,
        postal_code: billing_address.postal_code,
        city: billing_address.city,
        state: billing_address.city,
        country: billing_address.country,
      },
    });

// Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      description: "Pay Amount With card",
      payment_method_types: ["card"],
      amount: amount * 100,
      currency: "inr",
      shipping: {
        name: shipping.name,
        address: {
            line1: shipping.address.line1,
            postal_code: shipping.address.postal_code,
            city: shipping.address.city,
            state: shipping.address.city,
            country: shipping.address.country,
          },
      },
      customer:customers.id
    });

    //confirm payment intent
    const conformpayment = await stripe.paymentIntents.confirm(
      paymentIntent.id,
      {
        payment_method: "pm_card_visa",
      }
    );

    if (conformpayment.status === "succeeded") {
      res.status(200).send(conformpayment);
    } else {
      res.status(500).send("payment failed");
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Get all stripe customer
const StripeCustomers = async (req, res) => {
    try {
      const listofcustomers = await stripe.customers.list();
      res.status(200).send(listofcustomers);
    } catch (error) {
      res.status(400).send(error);
    }
  };

module.exports = {
    StripeCreateCustomer,
    StripeCustomers
  };
  