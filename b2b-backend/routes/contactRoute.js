import nodemailer from "nodemailer";
import express from "express";
import dotenv from "dotenv";

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


// API route for contact us form
// router.post("/contact-us", async (req, res) => {
//   const { name, email, message } = req.body;
// })

export default router;
