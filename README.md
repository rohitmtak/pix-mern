# PIX MERN Stack Application

A full-stack e-commerce application with separate frontend, admin panel, and backend services.

## Project Structure

```
pix-mern/
├── frontend/          # React + TypeScript frontend (customer-facing)
├── admin/            # React admin panel for product management
└── backend/          # Node.js + Express + MongoDB backend
```

## Prerequisites

- Node.js (v16 or higher)
- MongoDB
- Cloudinary account (for image/video uploads)

## Environment Setup

### Backend (.env file in backend/ directory)
```env
PORT=4000
MONGODB_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
JWT_SECRET=your_jwt_secret_key
```

### Frontend (.env file in frontend/ directory)
```env
VITE_API_BASE_URL=http://localhost:4000/api
```

## Installation & Running

### 1. Backend Setup
```bash
cd backend
npm install
npm start
```
Backend will run on http://localhost:4000

### 2. Admin Panel Setup
```bash
cd admin
npm install
npm run dev
```
Admin panel will run on http://localhost:5173

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend will run on http://localhost:5174 (or next available port)

## Features

### Backend
- RESTful API endpoints for products, users, cart, and orders
- MongoDB integration with Mongoose
- Cloudinary integration for media uploads
- JWT authentication for admin access
- Multer middleware for file handling
- CORS enabled for cross-origin requests

### Admin Panel
- Product management (add, edit, delete)
- Color variant management with images and videos
- Category and subcategory management
- Stock and pricing management
- Admin authentication

### Frontend
- Product display with color variants
- Category-based filtering
- Responsive design
- Integration with backend API
- Product search and filtering

## API Endpoints

### Products
- `GET /api/product/list` - Get all products
- `POST /api/product/add` - Add new product (admin only)
- `POST /api/product/remove` - Remove product (admin only)
- `POST /api/product/single` - Get single product
- `GET /api/product/categories` - Get all categories
- `GET /api/product/subcategories` - Get all subcategories

### Users
- `POST /api/user/login` - User login
- `POST /api/user/register` - User registration

### Cart
- `POST /api/cart/add` - Add item to cart
- `POST /api/cart/remove` - Remove item from cart
- `POST /api/cart/list` - Get cart items

### Orders
- `POST /api/order/add` - Create new order
- `POST /api/order/list` - Get order list

## Development Notes

- Frontend uses Vite proxy to `/api` which routes to backend on port 4000
- Admin panel directly connects to backend API
- All media files are uploaded to Cloudinary
- Product structure supports multiple color variants with images and videos
- Responsive design maintained across all components

## Troubleshooting

1. **CORS Issues**: Ensure backend CORS is properly configured
2. **Port Conflicts**: Check if ports 4000, 5173, 5174 are available
3. **MongoDB Connection**: Verify MongoDB is running and connection string is correct
4. **Cloudinary**: Ensure Cloudinary credentials are properly set in backend .env

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request
