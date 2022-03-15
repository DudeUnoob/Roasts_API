const express = require('express');
const { sentences } = require('./roasts')
const app = express();
const path = require('path');

//const stripe = require('stripe')('sk_test_51KJsOqE4Fs5G2sphieQ49mKpuPqV6Yl3jNjL9g8I5RlqML8gzi5qfVydVhR2CAb2eFphva42tMt3BDUrxzilFAUa00E6SwbP27');

// Middleware required for Webhook Handler
// app.use(
//   express.json({
//     verify: (req, res, buffer) => (req['rawBody'] = buffer),
//   })
// );

// ////// Data Model ///////

// // TODO Implement a real database
// // Reverse mapping of stripe to API key. Model this in your preferred database.
// const customers = {
//   // stripeCustomerId : data
//   'stripeCustomerId': {
//     apiKey: '123xyz',
//     active: false,
//     itemId: 'stripeSubscriptionItemId',
//   },
// };
// const apiKeys = {
//   // apiKey : customerdata
//   '123xyz': 'stripeCustomerId',
// };

// ////// Custom API Key Generation & Hashing ///////

// // Recursive function to generate a unique random string as API key
// function generateAPIKey() {
//   const { randomBytes } = require('crypto');
//   const apiKey = randomBytes(16).toString('hex');
//   const hashedAPIKey = hashAPIKey(apiKey);

//   // Ensure API key is unique
//   if (apiKeys[hashedAPIKey]) {
//     generateAPIKey();
//   } else {
//     return { hashedAPIKey, apiKey };
//   }
// }

// // Hash the API key
// function hashAPIKey(apiKey) {
//   const { createHash } = require('crypto');

//   const hashedAPIKey = createHash('sha256').update(apiKey).digest('hex');

//   return hashedAPIKey;
// }

// ////// Express API ///////

// // Create a Stripe Checkout Session to create a customer and subscribe them to a plan
// app.post('/checkout', async (req, res) => {
//   const session = await stripe.checkout.sessions.create({
//     mode: 'subscription',
//     payment_method_types: ['card'],
//     line_items: [
//       {
//         price: 'price_1KdPlvE4Fs5G2sphwi9oBKFE',
//       },
//     ],
//     // {CHECKOUT_SESSION_ID} is a string literal; do not change it!
//     // the actual Session ID is returned in the query parameter when your customer
//     // is redirected to the success page.
//     success_url:
//       'http://localhost:3000/dashboard?session_id={CHECKOUT_SESSION_ID}',
//     cancel_url: 'http://localhost:3000/error',
//   });

//   res.send(session);
// });

// // Listen to webhooks from Stripe when important events happen
// app.post('/webhook', async (req, res) => {
//   let data;
//   let eventType;
//   // Check if webhook signing is configured.
//   const webhookSecret = 'whsec_02e73feda3714680affdc1e74cc73a102b5c42a8603cc52e79479382464fc281';

//   if (webhookSecret) {
//     // Retrieve the event by verifying the signature using the raw body and secret.
//     let event;
//     let signature = req.headers['stripe-signature'];

//     try {
//       event = stripe.webhooks.constructEvent(
//         req['rawBody'],
//         signature,
//         webhookSecret
//       );
//     } catch (err) {
//       console.log(`⚠️  Webhook signature verification failed.`);
//       return res.sendStatus(400);
//     }
//     // Extract the object from the event.
//     data = event.data;
//     eventType = event.type;
//   } else {
//     // Webhook signing is recommended, but if the secret is not configured in `config.js`,
//     // retrieve the event data directly from the request body.
//     data = req.body.data;
//     eventType = req.body.type;
//   }

//   switch (eventType) {
//     case 'checkout.session.completed':
//       console.log(data);
//       // Data included in the event object:
//       const customerId = data.object.customer;
//       const subscriptionId = data.object.subscription;

//       console.log(
//         `💰 Customer ${customerId} subscribed to plan ${subscriptionId}`
//       );

//       // Get the subscription. The first item is the plan the user subscribed to.
//       const subscription = await stripe.subscriptions.retrieve(subscriptionId);
//       const itemId = subscription.items.data[0].id;

//       // Generate API key
//       const { apiKey, hashedAPIKey } = generateAPIKey();
//       console.log(`Your API Key: ${apiKey} KEEP IT SAFELY and do not forget`);
//       console.log(`Hashed API Key: ${hashedAPIKey}`);

//       // Store the API key in your database.
//       customers[customerId] = {
//         apikey: hashedAPIKey,
//         itemId,
//         active: true,
//       };
//       apiKeys[hashedAPIKey] = customerId;

//       break;
//     case 'invoice.paid':
//       // Continue to provision the subscription as payments continue to be made.
//       // Store the status in your database and check when a user accesses your service.
//       // This approach helps you avoid hitting rate limits.
//       break;
//     case 'invoice.payment_failed':
//       // The payment failed or the customer does not have a valid payment method.
//       // The subscription becomes past_due. Notify your customer and send them to the
//       // customer portal to update their payment information.
//       break;
//     default:
//     // Unhandled event type
//   }

//   res.status(200).send({
//       key: `Your API Key: ${apiKey} KEEP IT SAFELY and do not forget`
//   });
// });

// // Get information about the customer
// app.get('/customers/:id', (req, res) => {
//   const customerId = req.params.id;
//   const account = customers[customerId];
//   if (account) {
//     res.send(account);
//   } else {
//     res.sendStatus(404);
//   }
// });
app.get('/', (req, res) => {
    res.sendFile('index.html', { root: path.join(__dirname, './files')});
})
// Make a call to the API
// app.get('/api', async (req, res) => {
//     let result = Math.floor((Math.random() * sentences.length))
//     const { apiKey } = req.query;
//   // const apiKey = req.headers['X-API-KEY'] // better option for storing API keys

//   if (!apiKey) {
//     res.sendStatus(400); // bad request
//   }

//   const hashedAPIKey = hashAPIKey(apiKey);

//   const customerId = apiKeys[hashedAPIKey];
//   const customer = customers[customerId];

//   if (!customer || !customer.active) {
//     res.sendStatus(403); // not authorized
//   } else {

//     // Record usage with Stripe Billing
//     const record = await stripe.subscriptionItems.createUsageRecord(
//       customer.itemId,
//       {
//         quantity: 1,
//         timestamp: 'now',
//         action: 'increment',
//       }
//     );
//     res.send({ message: sentences[result], usage: record });
//   }
// });

// app.get('/usage/:customer', async (req, res) => {
//   const customerId = req.params.customer;
//   const invoice = await stripe.invoices.retrieveUpcoming({
//     customer: customerId,
//   });

//   res.send(invoice);
// });
app.get('/intro', (req,res) => {
    res.sendFile('intro.html', { root: path.join(__dirname, './files')});
    
})

app.listen(process.env.PORT || 3000, function(){
    console.log("Server listening on port 2000, http://localhost:3000");
  });