import mongoose from "mongoose";

const colorVariantSchema = new mongoose.Schema({
    color: { type: String, required: true },
    images: { type: Array, required: true },
    video: { type: String, default: "" }, // Default to an empty string to ensure the field exists even if no video URL is provided
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    sizes: { type: Array, required: true }
});

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    colorVariants: [colorVariantSchema],
    bestseller: { type: Boolean },
    date: { type: Date, required: true }
})

const productModel  = mongoose.models.product || mongoose.model("product",productSchema);

export default productModel