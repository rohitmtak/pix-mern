import express from 'express'
import multer from 'multer'
import { listProducts, addProduct, removeProduct, singleProduct, getBestsellerProducts, searchProducts, getProductsByCategory, getProductsBySubCategory } from '../controllers/productController.js'
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js';
import { getAllCategories, getAllSubcategories } from '../constants/categories.js';

const productRouter = express.Router();

// Test endpoint to verify server is working
productRouter.get('/test', (req, res) => {
    res.json({ success: true, message: "Product route is working" });
});

// Health check endpoint for frontend
productRouter.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Product API is running' });
});

// Get products with search and filtering (frontend expects this)
productRouter.get('/search', searchProducts);

// Get bestseller products (frontend expects this)
productRouter.get('/bestsellers', getBestsellerProducts);

// Get products by category (frontend expects this)
productRouter.get('/category/:category', getProductsByCategory);

// Get products by subcategory (frontend expects this)
productRouter.get('/subcategory/:subCategory', getProductsBySubCategory);

// Error handling middleware for multer
const handleMulterError = (error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ 
                success: false, 
                message: `File too large. Maximum size is 20MB. File: ${error.field}` 
            });
        }
        if (error.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({ 
                success: false, 
                message: 'Too many files. Maximum is 20 files.' 
            });
        }
        return res.status(400).json({ 
            success: false, 
            message: `Multer error: ${error.message}` 
        });
    }
    next(error);
};

// Use upload.any() to handle dynamic image keys for color variants
// The controller will validate and process the images
productRouter.post('/add', adminAuth, upload.any(), handleMulterError, addProduct);
productRouter.post('/remove', adminAuth, removeProduct);
productRouter.post('/single', singleProduct);
productRouter.get('/list', listProducts)
productRouter.get('/categories', (req, res) => {
    res.json({ success: true, data: getAllCategories() });
});
productRouter.get('/subcategories', (req, res) => {
    res.json({ success: true, data: getAllSubcategories() });
});

export default productRouter