import connectDb from "../../../middleware/mongoose";

/**
 * WhatsApp Webhook — handles incoming messages from WhatsApp Business API (via Twilio or Meta).
 *
 * NOTE: Requires external setup:
 * 1. Create a Twilio or Meta Cloud API account
 * 2. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_NUMBER in .env
 * 3. Point the webhook URL to https://your-domain.com/api/whatsapp/webhook
 *
 * This is a SKELETON implementation — it processes incoming messages but
 * requires valid API credentials to actually send replies.
 */

const handler = async (req, res) => {
  // GET: Webhook verification (required by Meta/Twilio)
  if (req.method === "GET") {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
      console.log("[WhatsApp] Webhook verified");
      return res.status(200).send(challenge);
    }
    return res.status(403).json({ error: "Verification failed" });
  }

  // POST: Incoming message
  if (req.method === "POST") {
    const body = req.body;

    try {
      // Twilio format
      if (body.Body && body.From) {
        const from = body.From.replace("whatsapp:", "");
        const message = body.Body.toLowerCase().trim();
        const mediaUrl = body.MediaUrl0 || null;

        console.log(`[WhatsApp] Message from ${from}: ${message}`);

        // Command router
        if (message === "yes" || message === "accept") {
          // Vendor accepting a ping via WhatsApp
          // In production: look up the latest pending ping for this vendor
          console.log(`[WhatsApp] Vendor ${from} accepted demand ping`);
          return res.status(200).json({
            response: "✅ Demand accepted! Customer has been notified.",
          });
        }

        if (mediaUrl) {
          // Image uploaded — process as cart photo
          console.log(`[WhatsApp] Cart image from vendor ${from}: ${mediaUrl}`);
          // In production: download image, send to /api/vendor/scan-cart
          return res.status(200).json({
            response: "📸 Cart photo received! Processing your inventory...",
          });
        }

        if (message === "status" || message === "help") {
          return res.status(200).json({
            response:
              "🛒 Tech Thela AI Bot Commands:\n" +
              "• Send a PHOTO to update your cart inventory\n" +
              "• Reply YES to accept a demand ping\n" +
              "• Type STATUS to check your stats",
          });
        }

        return res.status(200).json({
          response: "👋 Welcome to Tech Thela AI! Type HELP for commands.",
        });
      }

      // Meta Cloud API format
      if (body.entry) {
        const entry = body.entry[0];
        const changes = entry?.changes?.[0];
        const message = changes?.value?.messages?.[0];

        if (message) {
          console.log(
            `[WhatsApp Meta] From: ${message.from}, Type: ${message.type}`
          );

          if (message.type === "image") {
            console.log("[WhatsApp Meta] Cart image received");
          }
        }
      }

      res.status(200).json({ status: "received" });
    } catch (error) {
      console.error("[WhatsApp] Webhook error:", error);
      res.status(200).json({ status: "error handled" });
    }
  }
};

export default connectDb(handler);
