import validator from "validator";
import contactModel from "../models/contactModel.js";
import { sendContactFormEmail } from "../utils/emailService.js";

// Submit contact form
const submitContactForm = async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;

        // Validation constants
        const NAME_MIN_LENGTH = 2;
        const NAME_MAX_LENGTH = 100;
        const EMAIL_MAX_LENGTH = 254; // RFC 5321 standard
        const MESSAGE_MIN_LENGTH = 10;
        const MESSAGE_MAX_LENGTH = 5000;

        // Validate name
        const trimmedName = name ? name.trim() : "";
        if (!trimmedName) {
            return res.status(400).json({ 
                success: false, 
                message: "Name is required" 
            });
        }
        if (trimmedName.length < NAME_MIN_LENGTH) {
            return res.status(400).json({ 
                success: false, 
                message: `Name must be at least ${NAME_MIN_LENGTH} characters long` 
            });
        }
        if (trimmedName.length > NAME_MAX_LENGTH) {
            return res.status(400).json({ 
                success: false, 
                message: `Name must not exceed ${NAME_MAX_LENGTH} characters` 
            });
        }

        // Validate email
        const trimmedEmail = email ? email.trim() : "";
        if (!trimmedEmail) {
            return res.status(400).json({ 
                success: false, 
                message: "Email is required" 
            });
        }
        if (trimmedEmail.length > EMAIL_MAX_LENGTH) {
            return res.status(400).json({ 
                success: false, 
                message: `Email must not exceed ${EMAIL_MAX_LENGTH} characters` 
            });
        }
        if (!validator.isEmail(trimmedEmail)) {
            return res.status(400).json({ 
                success: false, 
                message: "Please enter a valid email address" 
            });
        }

        // Validate message
        const trimmedMessage = message ? message.trim() : "";
        if (!trimmedMessage) {
            return res.status(400).json({ 
                success: false, 
                message: "Message is required" 
            });
        }
        if (trimmedMessage.length < MESSAGE_MIN_LENGTH) {
            return res.status(400).json({ 
                success: false, 
                message: `Message must be at least ${MESSAGE_MIN_LENGTH} characters long` 
            });
        }
        if (trimmedMessage.length > MESSAGE_MAX_LENGTH) {
            return res.status(400).json({ 
                success: false, 
                message: `Message must not exceed ${MESSAGE_MAX_LENGTH} characters` 
            });
        }

        // Validate phone number if provided (Indian format: 10 digits)
        if (phone && phone.trim()) {
            const phoneNumber = phone.trim().replace(/\D/g, ''); // Remove all non-digits
            if (phoneNumber.length !== 10) {
                return res.status(400).json({ 
                    success: false, 
                    message: "Please enter a valid 10-digit phone number" 
                });
            }
        }

        // Create contact submission
        // Clean phone number: remove all non-digits, keep only 10 digits
        const cleanedPhone = phone && phone.trim() 
            ? phone.trim().replace(/\D/g, '') 
            : "";

        // Sanitize inputs (escape HTML to prevent XSS)
        const sanitizedName = validator.escape(trimmedName);
        const sanitizedMessage = validator.escape(trimmedMessage);

        const contactSubmission = await contactModel.create({
            name: sanitizedName,
            email: trimmedEmail.toLowerCase(),
            phone: cleanedPhone,
            message: sanitizedMessage
        });

        // Send email notification (non-blocking)
        sendContactFormEmail({
            name: contactSubmission.name,
            email: contactSubmission.email,
            phone: contactSubmission.phone,
            message: contactSubmission.message
        }).catch(err => {
            console.error('Failed to send contact form email notification:', err);
            // Don't fail the request if email fails
        });

        res.status(200).json({
            success: true,
            message: "Thank you for contacting us! We'll get back to you soon.",
            data: {
                id: contactSubmission._id
            }
        });

    } catch (error) {
        console.error('Error submitting contact form:', error);
        res.status(500).json({
            success: false,
            message: "Failed to submit contact form. Please try again later."
        });
    }
};

export {
    submitContactForm
};

