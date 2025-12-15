import express from 'express';
import { submitContactForm } from '../controllers/contactController.js';
import { generalLimiter } from '../middleware/rateLimiter.js';

const contactRouter = express.Router();

// Submit contact form (public endpoint, but rate limited)
contactRouter.post('/submit', generalLimiter, submitContactForm);

export default contactRouter;

