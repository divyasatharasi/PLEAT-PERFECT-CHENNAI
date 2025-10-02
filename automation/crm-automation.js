// Customer Relationship Management (CRM) Automation
// Tracks customer lifecycle and automates follow-ups

/**
 * CRM Automation System for Pleat Perfect Chennai
 * Manages customer relationships and automates marketing sequences
 */

// Customer lifecycle stages
const CUSTOMER_STAGES = {
  LEAD: "lead",
  PROSPECT: "prospect", 
  NEW_CUSTOMER: "new_customer",
  REPEAT_CUSTOMER: "repeat_customer",
  VIP_CUSTOMER: "vip_customer",
  INACTIVE: "inactive"
};

// Configuration
const CRM_CONFIG = {
  businessName: "Pleat Perfect Chennai",
  vipThreshold: 5, // Number of services to become VIP
  inactiveThreshold: 90, // Days without service to mark inactive
  followUpIntervals: {
    initial: 1, // Hours after first contact
    booking_reminder: 24, // Hours before appointment
    service_feedback: 2, // Hours after service completion
    review_request: 48, // Hours after service for review request
    reactivation: 30 // Days for inactive customer reactivation
  }
};

/**
 * Customer data structure
 */
class Customer {
  constructor(phone, name, email = null) {
    this.phone = phone;
    this.name = name;
    this.email = email;
    this.stage = CUSTOMER_STAGES.LEAD;
    this.createdDate = new Date();
    this.lastServiceDate = null;
    this.totalServices = 0;
    this.totalSpent = 0;
    this.preferences = {};
    this.communicationHistory = [];
    this.bookings = [];
    this.feedback = [];
  }
}

/**
 * Initialize customer in system
 */
function createCustomer(phone, name, email = null, source = "website") {
  const customer = new Customer(phone, name, email);
  customer.source = source;
  
  // Log to spreadsheet/database
  logCustomerToSheet(customer);
  
  // Schedule initial follow-up
  scheduleFollowUp(customer, "initial_contact");
  
  return customer;
}

/**
 * Update customer stage based on behavior
 */
function updateCustomerStage(customer) {
  const daysSinceLastService = customer.lastServiceDate ? 
    Math.floor((new Date() - customer.lastServiceDate) / (1000 * 60 * 60 * 24)) : null;
  
  // Determine new stage
  if (customer.totalServices === 0) {
    customer.stage = CUSTOMER_STAGES.LEAD;
  } else if (customer.totalServices === 1) {
    customer.stage = CUSTOMER_STAGES.NEW_CUSTOMER;
  } else if (customer.totalServices >= CRM_CONFIG.vipThreshold) {
    customer.stage = CUSTOMER_STAGES.VIP_CUSTOMER;
  } else if (daysSinceLastService > CRM_CONFIG.inactiveThreshold) {
    customer.stage = CUSTOMER_STAGES.INACTIVE;
  } else {
    customer.stage = CUSTOMER_STAGES.REPEAT_CUSTOMER;
  }
  
  return customer.stage;
}

/**
 * Automated follow-up sequences
 */
const FOLLOW_UP_SEQUENCES = {
  initial_contact: {
    delay: 1, // hours
    message: (customer) => `Hi ${customer.name}! 👋

Thank you for your interest in Pleat Perfect Chennai!

I wanted to personally reach out to see if you have any questions about our saree pleating services.

📱 Quick questions? Reply here
📞 Prefer to talk? Call +919876543210
💻 More info: [Website Link]

We're here to make your sarees look absolutely perfect! 🌸

Best regards,
Team Pleat Perfect Chennai`,
    
    action: "send_whatsapp"
  },

  booking_reminder: {
    delay: 24, // hours before appointment
    message: (customer, booking) => `📅 Appointment Reminder - ${customer.name}

Hi! This is a friendly reminder about your saree pleating appointment:

🗓️ Date: ${booking.date}
⏰ Time: ${booking.time}
📍 Pickup: ${booking.address}
🛍️ Service: ${booking.service}

📋 Booking ID: ${booking.id}

We'll call you 30 minutes before pickup to confirm. Please keep your sarees ready!

Any changes needed? Reply or call +919876543210

Looking forward to serving you! 🌸`,
    
    action: "send_whatsapp"
  },

  service_completion: {
    delay: 2, // hours after service
    message: (customer, service) => `✅ Service Completed - ${customer.name}!

Your ${service.type} service has been completed successfully! 

We hope you absolutely love how your saree looks! ✨

📸 Got a moment? We'd love to see you wearing it!
⭐ Happy with our service? A quick Google review would mean the world to us
🔄 Need another saree pleated? Book anytime!

Thank you for choosing Pleat Perfect Chennai! 

Have a wonderful day! 🌸`,
    
    action: "send_whatsapp"
  },

  review_request: {
    delay: 48, // hours
    message: (customer) => `🌟 Quick Favor? - ${customer.name}

Hope you're loving your perfectly pleated saree! 

Could you spare 30 seconds to leave us a review? It really helps other customers find us!

⭐ Google Review: [Direct Link]
📱 Tag us on Instagram: @pleatperfectchennai

As a thank you, here's 10% off your next service: REVIEW10

Thank you so much! 🙏
Team Pleat Perfect Chennai`,
    
    action: "send_whatsapp"
  },

  reactivation_30_days: {
    delay: 30, // days
    message: (customer) => `Miss you, ${customer.name}! 💕

It's been a while since we've seen you at Pleat Perfect Chennai!

🎉 Special welcome back offer just for you:
• 20% OFF any service
• FREE home pickup & delivery
• Priority booking available

Valid for the next 7 days only!

Ready to get those sarees looking perfect again? 
Book now: +919876543210

Hope to see you soon! 🌸`,
    
    action: "send_whatsapp"
  },

  vip_welcome: {
    delay: 0, // immediate when customer becomes VIP
    message: (customer) => `🎊 VIP Status Unlocked! - ${customer.name}

Congratulations! You're now a VIP customer at Pleat Perfect Chennai! 

👑 Your VIP Benefits:
• 15% OFF all future services
• Priority booking & scheduling
• FREE express service upgrades
• Exclusive seasonal offers
• Personal style consultation

Thank you for being such a valued customer! We truly appreciate your trust in us.

VIP Hotline: +919876543210

Keep shining! ✨ 
Team Pleat Perfect Chennai`,
    
    action: "send_whatsapp"
  }
};

/**
 * Schedule automated follow-ups
 */
function scheduleFollowUp(customer, sequenceType, additionalData = null) {
  const sequence = FOLLOW_UP_SEQUENCES[sequenceType];
  if (!sequence) return;
  
  const followUpTime = new Date();
  followUpTime.setHours(followUpTime.getHours() + sequence.delay);
  
  // Create follow-up record
  const followUp = {
    customerId: customer.phone,
    customerName: customer.name,
    sequenceType: sequenceType,
    scheduledTime: followUpTime,
    message: sequence.message(customer, additionalData),
    action: sequence.action,
    status: "scheduled",
    additionalData: additionalData
  };
  
  // Log to follow-up queue
  logFollowUpToQueue(followUp);
  
  return followUp;
}

/**
 * Process customer service completion
 */
function processServiceCompletion(customer, serviceDetails) {
  // Update customer data
  customer.totalServices += 1;
  customer.totalSpent += serviceDetails.amount;
  customer.lastServiceDate = new Date();
  
  // Update stage
  const newStage = updateCustomerStage(customer);
  
  // Schedule follow-ups
  scheduleFollowUp(customer, "service_completion", serviceDetails);
  scheduleFollowUp(customer, "review_request");
  
  // Check if customer became VIP
  if (newStage === CUSTOMER_STAGES.VIP_CUSTOMER && customer.totalServices === CRM_CONFIG.vipThreshold) {
    scheduleFollowUp(customer, "vip_welcome");
  }
  
  // Log service to history
  customer.communicationHistory.push({
    date: new Date(),
    type: "service_completed",
    details: serviceDetails
  });
  
  updateCustomerInSheet(customer);
}

/**
 * Generate personalized promotional messages
 */
function generatePersonalizedPromotion(customer) {
  const promotions = {
    [CUSTOMER_STAGES.LEAD]: `Hi ${customer.name}! 👋

Still thinking about getting your sarees professionally pleated? 

🎁 First-time customer special:
• 20% OFF your first service
• FREE consultation & pickup
• No hidden charges

Perfect time to try our award-winning service!

Book today: +919876543210
Offer expires in 48 hours! ⏰`,

    [CUSTOMER_STAGES.NEW_CUSTOMER]: `Hello ${customer.name}! 🌸

Loved your first experience with us? 

🌟 Returning customer offer:
• 15% OFF your next service
• Priority booking available
• FREE saree care guide

Keep those sarees looking perfect!

Book now: +919876543210`,

    [CUSTOMER_STAGES.REPEAT_CUSTOMER]: `Hi ${customer.name}! ✨

You're one of our favorite customers! 

💎 Loyal customer rewards:
• 10% OFF + FREE express upgrade
• Refer a friend = both get 15% OFF
• Early access to seasonal offers

Ready for your next appointment?

Book: +919876543210`,

    [CUSTOMER_STAGES.VIP_CUSTOMER]: `Dear ${customer.name}, 👑

Our VIP customer deserves VIP treatment!

🎊 Exclusive VIP Offer:
• 20% OFF any premium service
• FREE blouse alterations included
• Personal style consultation
• White-glove pickup & delivery

Your exclusive VIP line: +919876543210`,

    [CUSTOMER_STAGES.INACTIVE]: `We miss you, ${customer.name}! 💕

It's been too long since your last visit!

🎯 Win-back special (just for you):
• 25% OFF comeback service
• FREE pickup & delivery
• Complimentary saree inspection
• No expiry on this offer!

Come back anytime: +919876543210`
  };
  
  return promotions[customer.stage] || promotions[CUSTOMER_STAGES.REPEAT_CUSTOMER];
}

/**
 * Birthday automation
 */
function generateBirthdayMessage(customer) {
  return `🎂 Happy Birthday, ${customer.name}! 🎉

Wishing you a day filled with happiness and joy!

🎁 Birthday Special Gift:
• 30% OFF any service this month
• FREE premium packaging
• Complimentary birthday saree styling tips

Make your birthday celebrations even more special with perfectly pleated sarees!

Redeem anytime this month: +919876543210

Have a wonderful birthday! 🌸✨`;
}

/**
 * Customer segmentation for targeted campaigns
 */
function segmentCustomers(customers) {
  return {
    highValue: customers.filter(c => c.totalSpent > 2000),
    frequent: customers.filter(c => c.totalServices >= 3),
    recent: customers.filter(c => {
      const daysSince = (new Date() - c.lastServiceDate) / (1000 * 60 * 60 * 24);
      return daysSince <= 30;
    }),
    inactive: customers.filter(c => c.stage === CUSTOMER_STAGES.INACTIVE),
    newLeads: customers.filter(c => c.stage === CUSTOMER_STAGES.LEAD),
    vip: customers.filter(c => c.stage === CUSTOMER_STAGES.VIP_CUSTOMER)
  };
}

/**
 * Generate customer insights
 */
function generateCustomerInsights(customers) {
  const segments = segmentCustomers(customers);
  
  return {
    totalCustomers: customers.length,
    newThisMonth: customers.filter(c => {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return c.createdDate > monthAgo;
    }).length,
    
    averageServiceValue: customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.length,
    
    retentionRate: (segments.frequent.length / customers.length * 100).toFixed(2),
    
    segmentSizes: {
      highValue: segments.highValue.length,
      frequent: segments.frequent.length,
      inactive: segments.inactive.length,
      vip: segments.vip.length
    },
    
    topServices: getTopServices(customers),
    peakBookingTimes: getPeakBookingTimes(customers)
  };
}

/**
 * Log customer to Google Sheets
 */
function logCustomerToSheet(customer) {
  const sheet = SpreadsheetApp.openById('YOUR_CRM_SPREADSHEET_ID').getSheetByName('Customers');
  
  const row = [
    customer.phone,
    customer.name,
    customer.email || '',
    customer.stage,
    customer.createdDate,
    customer.totalServices,
    customer.totalSpent,
    customer.lastServiceDate || '',
    customer.source || ''
  ];
  
  sheet.appendRow(row);
}

/**
 * Update customer in Google Sheets
 */
function updateCustomerInSheet(customer) {
  const sheet = SpreadsheetApp.openById('YOUR_CRM_SPREADSHEET_ID').getSheetByName('Customers');
  const data = sheet.getDataRange().getValues();
  
  // Find customer row by phone number
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === customer.phone) {
      sheet.getRange(i + 1, 1, 1, 9).setValues([[
        customer.phone,
        customer.name,
        customer.email || '',
        customer.stage,
        customer.createdDate,
        customer.totalServices,
        customer.totalSpent,
        customer.lastServiceDate || '',
        customer.source || ''
      ]]);
      break;
    }
  }
}

/**
 * Log follow-up to queue
 */
function logFollowUpToQueue(followUp) {
  const sheet = SpreadsheetApp.openById('YOUR_CRM_SPREADSHEET_ID').getSheetByName('FollowUpQueue');
  
  const row = [
    followUp.customerId,
    followUp.customerName,
    followUp.sequenceType,
    followUp.scheduledTime,
    followUp.message,
    followUp.action,
    followUp.status
  ];
  
  sheet.appendRow(row);
}

// Export functions
if (typeof module !== 'undefined') {
  module.exports = {
    createCustomer,
    updateCustomerStage,
    scheduleFollowUp,
    processServiceCompletion,
    generatePersonalizedPromotion,
    generateBirthdayMessage,
    segmentCustomers,
    generateCustomerInsights,
    CUSTOMER_STAGES,
    FOLLOW_UP_SEQUENCES
  };
}