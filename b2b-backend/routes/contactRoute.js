import nodemailer from "nodemailer";
import express from "express";
import dotenv from "dotenv";
import Newsletter from "../models/Newsletter.js";

dotenv.config();

const router = express.Router();

// Configure transporter with better error handling
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify transporter configuration on startup
transporter.verify((error, success) => {
  if (error) {
    console.error("Email transporter configuration error:", error);
  } else {
    console.log("Email server is ready to take our messages");
  }
});

// API Route for sending custom product requests
router.post("/send-email", async (req, res) => {
  const {
    productType,
    quantity,
    specifications,
    budget,
    timeline,
    contactInfo,
    additionalNotes,
    productImages,
  } = req.body;

  // Validation
  if (!contactInfo?.name || !contactInfo?.email) {
    return res.status(400).json({
      success: false,
      error: "Contact name and email are required",
    });
  }

  if (!productType || !quantity || !specifications || !timeline) {
    return res.status(400).json({
      success: false,
      error:
        "Product type, quantity, specifications, and timeline are required",
    });
  }

  try {
    // Format plain text
    const textContent = `
Custom Product Request
----------------------
Product Type: ${productType || "Not specified"}
Quantity: ${quantity || "Not specified"}
Specifications: ${specifications || "Not specified"}
Budget: ${budget || "Not specified"}
Timeline: ${timeline || "Not specified"}

Contact Information:
Name: ${contactInfo.name}
Email: ${contactInfo.email}
Company: ${contactInfo.company || "Not specified"}
Phone: ${contactInfo.phone || "Not specified"}

Additional Notes:
${additionalNotes || "None"}

Images: ${productImages?.length || 0} attached
    `;

    // Format HTML content with better styling
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1e40af; border-bottom: 2px solid #1e40af; padding-bottom: 10px;">
          Custom Product Request
        </h2>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">Product Details</h3>
          <p><strong>Product Type:</strong> ${
            productType || "Not specified"
          }</p>
          <p><strong>Quantity:</strong> ${quantity || "Not specified"}</p>
          <p><strong>Specifications:</strong></p>
          <div style="background-color: white; padding: 15px; border-radius: 4px; margin: 10px 0;">
            ${
              specifications
                ? specifications.replace(/\n/g, "<br>")
                : "Not specified"
            }
          </div>
          <p><strong>Budget:</strong> ${budget || "Not specified"}</p>
          <p><strong>Timeline:</strong> ${timeline || "Not specified"}</p>
        </div>

        <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">Contact Information</h3>
          <p><strong>Name:</strong> ${contactInfo.name}</p>
          <p><strong>Email:</strong> <a href="mailto:${contactInfo.email}">${
      contactInfo.email
    }</a></p>
          <p><strong>Company:</strong> ${
            contactInfo.company || "Not specified"
          }</p>
          <p><strong>Phone:</strong> ${contactInfo.phone || "Not specified"}</p>
        </div>

        ${
          additionalNotes
            ? `
          <div style="background-color: #fefce8; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">Additional Notes</h3>
            <div style="background-color: white; padding: 15px; border-radius: 4px;">
              ${additionalNotes.replace(/\n/g, "<br>")}
            </div>
          </div>
        `
            : ""
        }

        ${
          productImages?.length
            ? `
          <div style="margin: 20px 0;">
            <h3 style="color: #374151;">Product Images (${productImages.length})</h3>
            <p style="color: #6b7280;">Images are attached to this email.</p>
          </div>
        `
            : ""
        }
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
          <p>This request was submitted through the Venum B2B website contact form.</p>
          <p>Timestamp: ${new Date().toLocaleString()}</p>
        </div>
      </div>
    `;

    // Prepare attachments from base64 images
    const attachments = (productImages || []).map((img, index) => {
      // Handle both data URL format and plain base64
      const base64Data = img.includes("base64,")
        ? img.split("base64,")[1]
        : img;

      return {
        filename: `product-image-${index + 1}.png`,
        content: base64Data,
        encoding: "base64",
      };
    });

    // Send email
    await transporter.sendMail({
      from: `"Venum B2B Contact Form" <${process.env.EMAIL_USER}>`,
      to: process.env.CONTACT_EMAIL,
      replyTo: contactInfo.email,
      subject: `🔔 Custom Product Request from ${contactInfo.name}`,
      text: textContent,
      html: htmlContent,
      attachments,
    });

    console.log(
      `Custom product request email sent successfully for ${contactInfo.email}`
    );

    res.status(200).json({
      success: true,
      message: "Custom product request sent successfully",
    });
  } catch (error) {
    console.error("Error sending custom product request email:", error);
    res.status(500).json({
      success: false,
      error: "Failed to send email. Please try again later.",
    });
  }
});

// Contact Form API Route
router.post("/send-contact-message", async (req, res) => {
  const { contactForm, userInfo, items, totalValue, timestamp } = req.body;

  // Validation
  if (!contactForm?.subject || !contactForm?.message) {
    return res.status(400).json({
      success: false,
      error: "Subject and message are required",
    });
  }

  if (!userInfo?.name || !userInfo?.email) {
    return res.status(400).json({
      success: false,
      error: "User name and email are required",
    });
  }

  try {
    // Format plain text content
    const textContent = `
CONTACT FORM SUBMISSION
=======================
Date: ${
      timestamp
        ? new Date(timestamp).toLocaleString()
        : new Date().toLocaleString()
    }

CONTACT DETAILS:
Category: ${contactForm.category || "Not specified"}
Priority: ${contactForm.priority || "Medium"}
Subject: ${contactForm.subject}

Message:
${contactForm.message}

USER INFORMATION:
Name: ${userInfo.name}
Email: ${userInfo.email}
Company: ${userInfo.company || "Not specified"}
Phone: ${userInfo.phone || "Not specified"}
Address: ${userInfo.address || "Not specified"}
City: ${userInfo.city || "Not specified"}
Country: ${userInfo.country || "Not specified"}
Business Type: ${userInfo.businessType || "Not specified"}

CART ITEMS:
${
  items && items.length > 0
    ? items
        .map(
          (item, index) => `
${index + 1}. ${item.name}
   Price: $${item.price}
   Quantity: ${item.quantity}
   Subtotal: $${(item.price * item.quantity).toFixed(2)}
   ${item.imageUrl ? `Image: ${item.imageUrl}` : ""}
`
        )
        .join("")
    : "No items in cart"
}

TOTAL VALUE: $${totalValue ? totalValue.toFixed(2) : "0.00"}
TOTAL ITEMS: ${items ? items.reduce((sum, item) => sum + item.quantity, 0) : 0}
    `;

    // Priority color mapping
    const getPriorityColor = (priority) => {
      switch (priority) {
        case "high":
          return "#ef4444";
        case "medium":
          return "#f59e0b";
        case "low":
          return "#10b981";
        default:
          return "#6b7280";
      }
    };

    // Category icon mapping
    const getCategoryIcon = (category) => {
      switch (category) {
        case "general":
          return "💬";
        case "support":
          return "🛠️";
        case "sales":
          return "💰";
        case "partnership":
          return "🤝";
        default:
          return "📋";
      }
    };

    // Format HTML content with professional styling
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; background-color: #f9fafb;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #1e40af 0%, #3730a3 100%); color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">📧 New Contact Form Submission</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">
            ${
              timestamp
                ? new Date(timestamp).toLocaleString()
                : new Date().toLocaleString()
            }
          </p>
        </div>

        <!-- Contact Details -->
        <div style="background: white; margin: 20px; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <div style="background-color: #f8fafc; padding: 20px; border-bottom: 1px solid #e5e7eb;">
            <h2 style="margin: 0; color: #374151; display: flex; align-items: center;">
              ${getCategoryIcon(contactForm.category)} Contact Information
            </h2>
          </div>
          <div style="padding: 25px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 25px; margin-bottom: 25px;">
              <div>
                <h3 style="color: #374151; margin: 0 0 15px 0; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">
                  📋 Inquiry Details
                </h3>
                <div style="space-y: 12px;">
                  <p style="margin: 8px 0;">
                    <span style="font-weight: 600; color: #6b7280;">Category:</span>
                    <span style="margin-left: 8px; padding: 4px 12px; background-color: #dbeafe; color: #1e40af; border-radius: 20px; font-size: 14px;">
                      ${contactForm.category}
                    </span>
                  </p>
                  <p style="margin: 8px 0;">
                    <span style="font-weight: 600; color: #6b7280;">Priority:</span>
                    <span style="margin-left: 8px; padding: 4px 12px; background-color: ${getPriorityColor(
                      contactForm.priority
                    )}20; color: ${getPriorityColor(
      contactForm.priority
    )}; border-radius: 20px; font-size: 14px; font-weight: 600;">
                      ${contactForm.priority.toUpperCase()}
                    </span>
                  </p>
                  <p style="margin: 8px 0;">
                    <span style="font-weight: 600; color: #6b7280;">Subject:</span>
                    <span style="margin-left: 8px; color: #374151;">${
                      contactForm.subject
                    }</span>
                  </p>
                </div>
              </div>
              <div>
                <h3 style="color: #374151; margin: 0 0 15px 0; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">
                  👤 Contact Details
                </h3>
                <div style="space-y: 8px;">
                  <p style="margin: 6px 0;"><span style="font-weight: 600; color: #6b7280;">Name:</span> ${
                    userInfo.name
                  }</p>
                  <p style="margin: 6px 0;"><span style="font-weight: 600; color: #6b7280;">Email:</span> 
                    <a href="mailto:${
                      userInfo.email
                    }" style="color: #2563eb;">${userInfo.email}</a>
                  </p>
                  <p style="margin: 6px 0;"><span style="font-weight: 600; color: #6b7280;">Company:</span> ${
                    userInfo.company || "Not specified"
                  }</p>
                  <p style="margin: 6px 0;"><span style="font-weight: 600; color: #6b7280;">Phone:</span> ${
                    userInfo.phone || "Not specified"
                  }</p>
                </div>
              </div>
            </div>
            
            <!-- Message -->
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6;">
              <h3 style="margin: 0 0 12px 0; color: #374151;">💬 Message</h3>
              <div style="background-color: white; padding: 16px; border-radius: 6px; line-height: 1.6; color: #374151;">
                ${contactForm.message.replace(/\n/g, "<br>")}
              </div>
            </div>
          </div>
        </div>

        <!-- Business Information -->
        <div style="background: white; margin: 20px; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <div style="background-color: #f0f9ff; padding: 20px; border-bottom: 1px solid #e5e7eb;">
            <h2 style="margin: 0; color: #374151;">🏢 Business Information</h2>
          </div>
          <div style="padding: 25px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 25px;">
              <div>
                <p style="margin: 8px 0;"><span style="font-weight: 600; color: #6b7280;">Business Type:</span> ${
                  userInfo.businessType || "Not specified"
                }</p>
                <p style="margin: 8px 0;"><span style="font-weight: 600; color: #6b7280;">Address:</span> ${
                  userInfo.address || "Not specified"
                }</p>
              </div>
              <div>
                <p style="margin: 8px 0;"><span style="font-weight: 600; color: #6b7280;">City:</span> ${
                  userInfo.city || "Not specified"
                }</p>
                <p style="margin: 8px 0;"><span style="font-weight: 600; color: #6b7280;">Country:</span> ${
                  userInfo.country || "Not specified"
                }</p>
              </div>
            </div>
          </div>
        </div>

        ${
          items && items.length > 0
            ? `
        <!-- Cart Items -->
        <div style="background: white; margin: 20px; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <div style="background: linear-gradient(135deg, #059669 0%, #047857 100%); color: white; padding: 20px;">
            <h2 style="margin: 0; display: flex; align-items: center; justify-content: space-between;">
              <span>🛒 Cart Items (${items.length} products)</span>
              <span style="font-size: 24px; font-weight: bold;">$${
                totalValue ? totalValue.toFixed(2) : "0.00"
              }</span>
            </h2>
            <p style="margin: 8px 0 0 0; opacity: 0.9;">
              Total Quantity: ${items.reduce(
                (sum, item) => sum + item.quantity,
                0
              )} items
            </p>
          </div>
          <div style="padding: 0;">
            ${items
              .map(
                (item, index) => `
              <div style="padding: 20px; border-bottom: ${
                index === items.length - 1 ? "none" : "1px solid #e5e7eb"
              }; display: flex; align-items: center; gap: 20px;">
                ${
                  item.imageUrl
                    ? `
                  <div style="flex-shrink: 0;">
                    <img src="${item.imageUrl}" alt="${item.name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px; border: 2px solid #e5e7eb;">
                  </div>
                `
                    : `
                  <div style="flex-shrink: 0; width: 80px; height: 80px; background-color: #f3f4f6; border-radius: 8px; display: flex; align-items: center; justify-content: center; border: 2px solid #e5e7eb;">
                    <span style="color: #9ca3af; font-size: 24px;">📦</span>
                  </div>
                `
                }
                <div style="flex: 1;">
                  <h3 style="margin: 0 0 8px 0; color: #374151; font-size: 18px;">${
                    item.name
                  }</h3>
                  <div style="display: flex; gap: 20px; flex-wrap: wrap;">
                    <span style="color: #6b7280;"><strong>Price:</strong> $${item.price.toFixed(
                      2
                    )}</span>
                    <span style="color: #6b7280;"><strong>Quantity:</strong> ${
                      item.quantity
                    }</span>
                    <span style="color: #059669; font-weight: bold;"><strong>Subtotal:</strong> $${(
                      item.price * item.quantity
                    ).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            `
              )
              .join("")}
          </div>
          
          <!-- Cart Summary -->
          <div style="background-color: #f0fdf4; padding: 20px; border-top: 2px solid #059669;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <p style="margin: 0; color: #374151;"><strong>Total Items:</strong> ${items.reduce(
                  (sum, item) => sum + item.quantity,
                  0
                )}</p>
                <p style="margin: 4px 0 0 0; color: #6b7280;">Across ${
                  items.length
                } different products</p>
              </div>
              <div style="text-align: right;">
                <p style="margin: 0; font-size: 24px; font-weight: bold; color: #059669;">$${
                  totalValue ? totalValue.toFixed(2) : "0.00"
                }</p>
                <p style="margin: 4px 0 0 0; color: #6b7280; font-size: 14px;">Total Value</p>
              </div>
            </div>
          </div>
        </div>
        `
            : `
        <!-- No Cart Items -->
        <div style="background: white; margin: 20px; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <div style="padding: 30px; text-align: center;">
            <div style="font-size: 48px; margin-bottom: 16px;">🛒</div>
            <h3 style="margin: 0 0 8px 0; color: #6b7280;">No Cart Items</h3>
            <p style="margin: 0; color: #9ca3af;">The user didn't have any items in their cart.</p>
          </div>
        </div>
        `
        }

        <!-- Footer -->
        <div style="background-color: #374151; color: white; padding: 20px; margin: 20px; border-radius: 12px; text-align: center;">
          <p style="margin: 0; opacity: 0.8;">This message was sent through the Venum B2B contact form.</p>
          <p style="margin: 8px 0 0 0; opacity: 0.6; font-size: 14px;">
            Reply to this email to respond directly to ${userInfo.name}.
          </p>
        </div>
      </div>
    `;

    // Send email
    await transporter.sendMail({
      from: `"Venum B2B Contact Form" <${process.env.EMAIL_USER}>`,
      to: process.env.CONTACT_EMAIL,
      replyTo: userInfo.email,
      subject: `${getCategoryIcon(
        contactForm.category
      )} [${contactForm.priority.toUpperCase()}] ${contactForm.subject} - ${
        userInfo.name
      }`,
      text: textContent,
      html: htmlContent,
    });

    console.log(`Contact form email sent successfully for ${userInfo.email}`);

    res.status(200).json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (error) {
    console.error("Error sending contact form email:", error);
    res.status(500).json({
      success: false,
      error: "Failed to send message. Please try again later.",
    });
  }
});

// Newsletter Subscription API Route
router.post("/subscribe-newsletter", async (req, res) => {
  const { email } = req.body;
  // Validation
  if (!email || !/.+\@.+\..+/.test(email)) {
    return res.status(400).json({
      success: false,
      error: "Valid email is required",
    });
  }
  try {
    // Check if email already exists
    const existingSubscription = await Newsletter.findOne({ email });
    if (existingSubscription) {
      return res.status(400).json({
        success: false,
        error: "This email is already subscribed to the newsletter",
      });
    }

    // Create new subscription
    const newSubscription = new Newsletter({ email });
    await newSubscription.save();

    console.log(`Newsletter subscription successful for ${email}`);

    res.status(200).json({
      success: true,
      message: "Subscribed to newsletter successfully",
    });
  } catch (error) {
    console.error("Error subscribing to newsletter:", error);
    res.status(500).json({
      success: false,
      error: "Failed to subscribe. Please try again later.",
    });
  }
});

export default router;
