/**
 * WhatsApp Messaging Utility for Tech Thela AI
 * 
 * This service handles sending outbound messages to vendors via 
 * Twilio or Meta WhatsApp Business API.
 */

export const sendWhatsAppMessage = async (to, body) => {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_WHATSAPP_NUMBER; // e.g., 'whatsapp:+14155238886'

  // Standardize phone format (ensure it starts with 'whatsapp:+91' for India or as provided)
  let formattedTo = to.startsWith('whatsapp:') ? to : `whatsapp:${to.startsWith('+') ? to : '+91' + to}`;

  console.log(`[WhatsApp Simulation] Preparing to send to ${formattedTo}:`);
  console.log(`> Message: "${body}"`);

  if (!sid || !token || !from) {
    console.warn("[WhatsApp] API credentials missing in .env.local. Falling back to SIMULATION mode.");
    
    // In a real hackathon/production scenario, this would be a real API call.
    // For now, we return a mock success to allow the flow to continue.
    return {
      success: true,
      mode: "simulation",
      messageId: `sim_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString()
    };
  }

  try {
    // Real Twilio Implementation (Ready for production)
    const auth = Buffer.from(`${sid}:${token}`).toString('base64');
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${auth}`,
        },
        body: new URLSearchParams({
          To: formattedTo,
          From: from,
          Body: body,
        }),
      }
    );

    const data = await response.json();
    if (response.ok) {
      console.log(`[WhatsApp] Message sent successfully: ${data.sid}`);
      return { success: true, sid: data.sid };
    } else {
      console.error(`[WhatsApp] Twilio Error: ${data.message}`);
      return { success: false, error: data.message };
    }
  } catch (error) {
    console.error("[WhatsApp] Network error:", error);
    return { success: false, error: error.message };
  }
};
