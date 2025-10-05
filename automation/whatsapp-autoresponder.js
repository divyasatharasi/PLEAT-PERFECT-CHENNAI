// Google Apps Script for WhatsApp Auto-Responder
// This script automatically responds to WhatsApp Business messages

/**
 * WhatsApp Auto-Responder for Pleat Perfect Chennai
 * Automatically responds to common customer inquiries
 */

// Configuration
const BUSINESS_CONFIG = {
  businessName: "Pleat Perfect Chennai",
  location: "Baby Nagar, Velachery, Chennai",
  phone: "+919876543210",
  email: "info@pleatperfectchennai.com",
  workingHours: "Monday-Saturday: 9 AM - 7 PM, Sunday: 9 AM - 6 PM",
  services: {
    basic: "Basic Pleating - ₹200",
    premium: "Premium Pleating - ₹400", 
    bridal: "Bridal Special - ₹650"
  }
};

// Auto-response templates
const RESPONSE_TEMPLATES = {
  greeting: `🌸 Welcome to ${BUSINESS_CONFIG.businessName}! 

Thank you for contacting us. We're Chennai's premier saree pleating service.

📍 Location: ${BUSINESS_CONFIG.location}
⏰ Hours: ${BUSINESS_CONFIG.workingHours}

How can we help you today?
1️⃣ Service Information & Pricing
2️⃣ Book an Appointment  
3️⃣ Check Order Status
4️⃣ Speak to Our Team

Reply with the number for quick assistance! 🙏`,

  services: `🛍️ Our Services & Pricing:

✨ ${BUSINESS_CONFIG.services.basic}
   • Professional pleating
   • All saree types
   • Same day service

🌟 ${BUSINESS_CONFIG.services.premium} (Most Popular)
   • Professional pleating
   • Fall & pico included
   • Home pickup & delivery

👰 ${BUSINESS_CONFIG.services.bridal}
   • Designer pleating styles
   • Blouse alterations
   • Premium packaging

🚚 Additional Services:
   • Home pickup: ₹50
   • Express service: +₹150
   • Fall only: ₹100
   • Pico only: ₹80

Ready to book? Send us your details:
- Name
- Address
- Service needed
- Preferred date/time`,

  booking: `📅 Booking Information:

To book your service, please provide:
1. Your name
2. Phone number
3. Pickup address
4. Service type (Basic/Premium/Bridal)
5. Number of sarees
6. Preferred date and time

💰 Payment Options:
- Cash on delivery
- UPI (GPay, PhonePe, Paytm)
- Card payment available

We'll confirm your booking within 30 minutes! 

For urgent bookings, call: ${BUSINESS_CONFIG.phone}`,

  status: `📋 Order Status Check:

Please provide your:
- Order ID or
- Phone number used for booking

We'll send you the current status of your order immediately.

Standard processing time:
• Basic service: Same day
• Premium service: Same day  
• Bridal service: 1-2 days
• Express service: 4-6 hours`,

  contact: `📞 Contact Information:

🏪 ${BUSINESS_CONFIG.businessName}
📍 ${BUSINESS_CONFIG.location}
📱 ${BUSINESS_CONFIG.phone}
✉️ ${BUSINESS_CONFIG.email}
⏰ ${BUSINESS_CONFIG.workingHours}

🚗 Service Areas:
• Velachery (Free pickup)
• Adyar • Guindy • Taramani
• Sholinganallur • T.Nagar

For immediate assistance, call us directly!`,

  afterHours: `🌙 Thank you for contacting ${BUSINESS_CONFIG.businessName}!

We're currently closed. Our working hours are:
${BUSINESS_CONFIG.workingHours}

Your message is important to us and we'll respond first thing during business hours.

For urgent requirements, you can:
📱 Call: ${BUSINESS_CONFIG.phone}
📧 Email: ${BUSINESS_CONFIG.email}

Have a great day! 🌸`,

  pricing: `💰 Transparent Pricing:

🔸 Basic Pleating: ₹200
   Perfect for daily wear

🔸 Premium Pleating: ₹400 ⭐ Most Popular
   Includes fall & pico + home service

🔸 Bridal Special: ₹650
   Complete bridal package

📦 Add-on Services:
• Home pickup: ₹50
• Express (same day): +₹150
• Fall stitching: ₹100
• Pico edging: ₹80

💳 Payment: Cash, UPI, Cards accepted
🎯 Quality guarantee on all services

Ready to book? Just say "BOOK NOW"!`
};

/**
 * Main function to process incoming WhatsApp messages
 */
function processWhatsAppMessage(message, customerPhone, customerName = "Customer") {
  const messageText = message.toLowerCase().trim();
  let response = "";
  
  // Check if it's outside business hours
  if (isOutsideBusinessHours()) {
    return RESPONSE_TEMPLATES.afterHours;
  }
  
  // Greeting and initial contact
  if (isGreeting(messageText)) {
    response = RESPONSE_TEMPLATES.greeting;
    logCustomerInteraction(customerPhone, customerName, "greeting", messageText);
  }
  
  // Service inquiries
  else if (messageText.includes("1") || messageText.includes("service") || messageText.includes("price")) {
    response = RESPONSE_TEMPLATES.services;
    logCustomerInteraction(customerPhone, customerName, "services_inquiry", messageText);
  }
  
  // Booking requests
  else if (messageText.includes("2") || messageText.includes("book") || messageText.includes("appointment")) {
    response = RESPONSE_TEMPLATES.booking;
    logCustomerInteraction(customerPhone, customerName, "booking_request", messageText);
  }
  
  // Order status
  else if (messageText.includes("3") || messageText.includes("status") || messageText.includes("order")) {
    response = RESPONSE_TEMPLATES.status;
    logCustomerInteraction(customerPhone, customerName, "status_check", messageText);
  }
  
  // Contact information
  else if (messageText.includes("4") || messageText.includes("contact") || messageText.includes("address")) {
    response = RESPONSE_TEMPLATES.contact;
    logCustomerInteraction(customerPhone, customerName, "contact_info", messageText);
  }
  
  // Pricing specific
  else if (messageText.includes("price") || messageText.includes("cost") || messageText.includes("rate")) {
    response = RESPONSE_TEMPLATES.pricing;
    logCustomerInteraction(customerPhone, customerName, "pricing_inquiry", messageText);
  }
  
  // Default response for unrecognized messages
  else {
    response = `Thank you for your message! 

Our team will respond shortly. In the meantime:

🔹 Type "SERVICES" for pricing info
🔹 Type "BOOK" to make appointment  
🔹 Type "CONTACT" for our details

For immediate assistance: ${BUSINESS_CONFIG.phone}`;
    
    logCustomerInteraction(customerPhone, customerName, "general_inquiry", messageText);
  }
  
  return response;
}

/**
 * Check if message is a greeting
 */
function isGreeting(message) {
  const greetings = ["hi", "hello", "hey", "good morning", "good afternoon", "good evening", "namaste"];
  return greetings.some(greeting => message.includes(greeting));
}

/**
 * Check if current time is outside business hours
 */
function isOutsideBusinessHours() {
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay(); // 0 = Sunday, 6 = Saturday
  
  // Sunday hours: 10 AM - 4 PM
  if (day === 0) {
    return hour < 10 || hour >= 16;
  }
  
  // Monday-Saturday hours: 9 AM - 7 PM
  return hour < 9 || hour >= 19;
}

/**
 * Log customer interactions for analytics
 */
function logCustomerInteraction(phone, name, interactionType, message) {
  const sheet = SpreadsheetApp.openById('YOUR_SPREADSHEET_ID').getSheetByName('CustomerInteractions');
  
  const timestamp = new Date();
  const row = [timestamp, phone, name, interactionType, message];
  
  sheet.appendRow(row);
}

/**
 * Auto-follow up system for new customers
 */
function scheduleFollowUp(customerPhone, customerName, serviceType) {
  const followUpMessages = {
    "1_hour": `Hi ${customerName}! 👋

Just checking if you have any questions about our ${serviceType} service?

We're here to help make your saree look perfect! 🌸`,

    "24_hours": `Hello ${customerName}! 

Hope you're doing well. We wanted to follow up on your interest in our saree pleating service.

📅 Ready to book your appointment?
💬 Have any questions?

We're here to help! Reply anytime.`,

    "1_week": `Hi ${customerName}! 

We noticed you were interested in our saree pleating services. 

🎉 Special offer just for you:
10% off your first service!

Valid until end of this month. Book now to avail! 🌸`
  };
  
  // Schedule these messages using Google Apps Script triggers
  // Implementation depends on your automation platform
}

/**
 * Booking confirmation automation
 */
function sendBookingConfirmation(customerDetails) {
  const message = `✅ Booking Confirmed - ${BUSINESS_CONFIG.businessName}

👤 Customer: ${customerDetails.name}
📱 Phone: ${customerDetails.phone}
📍 Pickup: ${customerDetails.address}
🛍️ Service: ${customerDetails.service}
📅 Date: ${customerDetails.date}
⏰ Time: ${customerDetails.time}
💰 Estimated Cost: ${customerDetails.cost}

📋 Booking ID: ${customerDetails.bookingId}

We'll call you 30 minutes before pickup to confirm.

Thank you for choosing ${BUSINESS_CONFIG.businessName}! 🌸`;

  return message;
}

/**
 * Service completion follow-up
 */
function sendServiceCompletionMessage(customerDetails) {
  const message = `🎉 Service Completed - ${BUSINESS_CONFIG.businessName}

Hi ${customerDetails.name}!

Your saree pleating service has been completed successfully! 

✨ We hope you love the result!

🙏 We'd appreciate your feedback:
⭐ Rate us on Google: [Google Review Link]
📱 Share your experience on Instagram: @pleatperfectchennai

💝 Refer a friend and both get 10% off next service!

Thank you for trusting us with your precious saree! 🌸

Have a wonderful day!`;

  return message;
}

/**
 * Review request automation
 */
function sendReviewRequest(customerPhone, customerName, serviceDate) {
  const message = `🌟 Hi ${customerName}!

Hope you're loving your perfectly pleated saree! 

We'd be grateful if you could spare 2 minutes to share your experience:

⭐ Google Review: [Your Google My Business Link]
📱 Tag us on Instagram: @pleatperfectchennai

Your feedback helps us serve more customers like you! 

As a thank you, here's 15% off your next service: CODE15

Thank you! 🙏 - Team Pleat Perfect Chennai`;

  return message;
}

/**
 * Seasonal promotion automation
 */
function sendSeasonalPromotion(occasion) {
  const promotions = {
    "diwali": `🪔 Diwali Special Offer! 🪔

Get your sarees festival-ready!

🎊 20% OFF on all services
🚚 FREE home pickup & delivery
⚡ Express service available

Book before Oct 25th to avail!

Perfect pleating for perfect celebrations! ✨`,

    "wedding_season": `💒 Wedding Season Special! 💒

Make your special day even more beautiful!

👰 Bridal Package: ₹650 → ₹550
💎 Premium Package: ₹400 → ₹350
🎁 FREE blouse alterations with bridal package

Book your wedding saree service today!`,

    "new_year": `🎆 New Year, New Look! 🎆

Start the year with perfectly pleated sarees!

🌟 30% OFF first-time customers
📅 Book for January & get February service FREE
🎁 Complimentary saree care tips

Limited time offer!`
  };

  return promotions[occasion] || "Special offer available! Contact us for details.";
}

// Export functions for use in other scripts
if (typeof module !== 'undefined') {
  module.exports = {
    processWhatsAppMessage,
    sendBookingConfirmation,
    sendServiceCompletionMessage,
    sendReviewRequest,
    sendSeasonalPromotion
  };
}