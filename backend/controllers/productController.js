import { v2 as cloudinary } from "cloudinary"
import productModel from "../models/productModel.js"
import fs from 'fs'
import { isValidCategory, isValidSubcategory, PRODUCT_CATEGORIES, PRODUCT_SUBCATEGORIES } from "../constants/categories.js"

// function for add product
const addProduct = async (req, res) => {
    try {
        console.log("=== ADD PRODUCT REQUEST ===");
        console.log("Request body:", req.body);
        console.log("Request files:", req.files);
        console.log("Files keys:", Object.keys(req.files || {}));

        const { name, description, category, subCategory, bestseller, colorVariants } = req.body

        // Validate category and subcategory
        if (!isValidCategory(category)) {
            throw new Error(`Invalid category. Must be one of: ${Object.values(PRODUCT_CATEGORIES).join(', ')}`);
        }
        
        if (!isValidSubcategory(subCategory)) {
            throw new Error(`Invalid subcategory. Must be one of: ${Object.values(PRODUCT_SUBCATEGORIES).join(', ')}`);
        }

        if (!colorVariants) {
            throw new Error("colorVariants is required");
        }

        // Parse color variants from request body
        let parsedColorVariants;
        try {
            parsedColorVariants = JSON.parse(colorVariants);
            console.log("Parsed colorVariants:", parsedColorVariants);
        } catch (parseError) {
            throw new Error(`Failed to parse colorVariants: ${parseError.message}`);
        }

        if (!Array.isArray(parsedColorVariants) || parsedColorVariants.length === 0) {
            throw new Error("colorVariants must be a non-empty array");
        }

        // Process images for each color variant
        const processedVariants = await Promise.all(
            parsedColorVariants.map(async (variant, index) => {
                console.log(`Processing variant ${index + 1}:`, variant);
                const variantImages = [];
                let variantVideo = "";
                
                // Find images for this variant from the files array
                // Files are uploaded with fieldname like: image_Black_1, image_red_1, etc.
                const variantFiles = req.files.filter(file => 
                    file.fieldname.startsWith(`image_${variant.color}_`)
                );
                
                // Find video for this variant
                const variantVideoFile = req.files.find(file => 
                    file.fieldname === `video_${variant.color}`
                );
                
                console.log(`Found ${variantFiles.length} files for variant ${variant.color}:`, variantFiles.map(f => f.fieldname));
                console.log(`Video for variant ${variant.color}:`, variantVideoFile ? variantVideoFile.fieldname : 'none');

                // Process video for this variant if it exists
                if (variantVideoFile) {
                    try {
                        console.log(`Processing video for variant ${variant.color}...`);
                        const videoResult = await cloudinary.uploader.upload(
                            variantVideoFile.path,
                            { 
                                resource_type: 'video',
                                folder: 'product-videos',
                                allowed_formats: ['mp4', 'webm', 'mov', 'avi', 'mkv']
                            }
                        );
                        variantVideo = videoResult.secure_url;
                        console.log(`Video uploaded for ${variant.color}: ${variantVideo}`);

                        // Clean up local video file after successful upload
                        fs.unlink(variantVideoFile.path, (err) => {
                            if (err) console.error('Error deleting local video file:', err);
                        });

                    } catch (videoError) {
                        console.error(`Error uploading video for ${variant.color}:`, videoError);
                        throw new Error(`Failed to upload video for ${variant.color}: ${videoError.message}`);
                    }
                    
                }

                // Process each image file for this variant
                for (const file of variantFiles) {
                    try {
                        console.log(`Processing file: ${file.fieldname}`);
                        const result = await cloudinary.uploader.upload(
                            file.path, 
                            { resource_type: 'image' }
                        );
                        variantImages.push(result.secure_url);
                        console.log(`Uploaded image for ${variant.color}: ${result.secure_url}`);

                        // Clean up local image file after successful upload
                        fs.unlink(file.path, (err) => {
                            if (err) console.error('Error deleting local image file:', err);
                        });
                    } catch (uploadError) {
                        console.error(`Error uploading image for ${variant.color}:`, uploadError);
                        throw new Error(`Failed to upload image for ${variant.color}: ${uploadError.message}`);
                    }
                }

                // Ensure at least one image was uploaded
                if (variantImages.length === 0) {
                    throw new Error(`No images uploaded for color variant: ${variant.color}`);
                }

                console.log(`Variant ${variant.color} processed with ${variantImages.length} images and video: ${variantVideo ? 'yes' : 'no'}`);

                return {
                    color: variant.color,
                    images: variantImages,
                    video: variantVideo, // Add video URL to this variant
                    price: Number(variant.price),
                    stock: Number(variant.stock) || 0,
                    sizes: variant.sizes || []
                };
            })
        );

        const productData = {
            name,
            description,
            category,
            subCategory,
            bestseller: bestseller === "true" ? true : false,
            colorVariants: processedVariants,
            date: Date.now()
        }

        console.log("Final product data:", productData);

        const product = new productModel(productData);
        await product.save()

        console.log("Product saved successfully:", product._id);

        res.json({ success: true, message: "Product Added" })

    } catch (error) {
        console.log("=== ERROR IN ADD PRODUCT ===");
        console.log("Error message:", error.message);
        console.log("Error stack:", error.stack);
        res.status(500).json({ success: false, message: error.message })
    }
}

// function for list product
const listProducts = async (req, res) => {
    try {
        
        const products = await productModel.find({});
        res.json({success:true,data:products})

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// function for removing product
const removeProduct = async (req, res) => {
    try {
        
        await productModel.findByIdAndDelete(req.body.id)
        res.json({success:true,message:"Product Removed"})

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// function for single product info
const singleProduct = async (req, res) => {
    try {
        
        const { productId } = req.body
        const product = await productModel.findById(productId)
        res.json({success:true,data:product})

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// function for getting bestseller products
const getBestsellerProducts = async (req, res) => {
    try {
        const products = await productModel.find({ bestseller: true });
        res.json({ success: true, data: products });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// function for searching products
const searchProducts = async (req, res) => {
    try {
        const { query, category, subCategory, minPrice, maxPrice } = req.query;
        
        let searchCriteria = {};
        
        // Text search
        if (query) {
            searchCriteria.$or = [
                { name: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ];
        }
        
        // Category filter
        if (category) {
            searchCriteria.category = category;
        }
        
        // Subcategory filter
        if (subCategory) {
            searchCriteria.subCategory = subCategory;
        }
        
        // Price filter
        if (minPrice || maxPrice) {
            searchCriteria['colorVariants.price'] = {};
            if (minPrice) searchCriteria['colorVariants.price'].$gte = Number(minPrice);
            if (maxPrice) searchCriteria['colorVariants.price'].$lte = Number(maxPrice);
        }
        
        const products = await productModel.find(searchCriteria);
        res.json({ success: true, data: products });
        
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// function for getting products by category
const getProductsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const products = await productModel.find({ category });
        res.json({ success: true, data: products });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// function for getting products by subcategory
const getProductsBySubCategory = async (req, res) => {
    try {
        const { subCategory } = req.params;
        const products = await productModel.find({ subCategory });
        res.json({ success: true, data: products });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { listProducts, addProduct, removeProduct, singleProduct, getBestsellerProducts, searchProducts, getProductsByCategory, getProductsBySubCategory }