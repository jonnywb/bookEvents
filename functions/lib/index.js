"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPaymentIntent = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors");
const stripe_1 = require("stripe");
admin.initializeApp();
const stripe = new stripe_1.default(functions.config().stripe.secret, {
    apiVersion: "2024-06-20",
});
const corsHandler = cors({ origin: true });
exports.createPaymentIntent = functions.https.onRequest((req, res) => {
    corsHandler(req, res, async () => {
        const { amount, userId, eventId, firstName, surname, email } = req.body;
        try {
            const paymentIntent = await stripe.paymentIntents.create({
                amount,
                currency: "gbp",
                metadata: {
                    userId,
                    eventId,
                    firstName,
                    surname,
                    email,
                },
            });
            // Store the payment intent details in Firestore
            await admin.firestore().collection("payments").add({
                userId,
                eventId,
                amount,
                currency: "gbp",
                firstName,
                surname,
                email,
                clientSecret: paymentIntent.client_secret,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
            });
            res.status(200).send({
                clientSecret: paymentIntent.client_secret,
            });
        }
        catch (error) {
            let errorMessage = "An unknown error occurred.";
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            res.status(500).send({
                error: errorMessage,
            });
        }
    });
});
//# sourceMappingURL=index.js.map