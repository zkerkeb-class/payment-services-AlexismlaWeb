const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const axios = require("axios");

// Crée une session de paiement pour acheter des tokens
const createCheckoutSession = async (req, res) => {
  const { userId, priceId, tokenAmount } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: "dressing-app://payment-success",
      cancel_url: "dressing-app://payment-cancel",
      metadata: {
        userId,
        tokenPack: tokenAmount.toString(), // Ex: "5"
      },
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Erreur checkout:", err);
    res.status(500).json({ error: "Erreur lors de la création de la session." });
  }
};

// Webhook Stripe
const handleWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("⚠️ Signature Webhook invalide:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata.userId;
    const tokensToAdd = parseInt(session.metadata.tokenPack || "0");

    if (!userId || tokensToAdd <= 0) {
      console.warn("❌ Metadata manquante ou incorrecte.");
      return res.status(400).send("Metadata invalide.");
    }

    try {
      // ✅ Appel vers ton service BDD pour incrémenter les tokens
      await axios.put(`http://localhost:4001/api/users/${userId}/reset-tokens`, {
        aiTokens: tokensToAdd,
        lastTokenReset: new Date()
      });

      console.log(`✅ ${tokensToAdd} tokens ajoutés à l'utilisateur ${userId}`);
    } catch (err) {
      console.error("❌ Erreur MAJ utilisateur:", err.response?.data || err.message);
    }
  }

  res.status(200).send(); // ✅ Ne pas oublier d’envoyer une réponse au webhook
};

module.exports = { createCheckoutSession, handleWebhook };
