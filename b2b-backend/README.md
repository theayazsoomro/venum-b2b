# B2B Backend API

A robust Node.js/Express backend API for B2B e-commerce platform with MongoDB database.

## Features

- **Product Management**: Full CRUD operations for products
- **User Authentication**: JWT-based authentication with role-based access control
- **File Uploads**: Image upload functionality for products
- **Advanced Filtering**: Search, filter, sort, and paginate products
- **Bulk Pricing**: Support for quantity-based pricing
- **Role-based Access**: Admin, Manager, and Buyer roles
- **Data Validation**: Comprehensive input validation
- **Error Handling**: Centralized error handling
- **Security**: Password hashing, CORS protection

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Validation**: Express Validator
- **Security**: bcryptjs for password hashing

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`
4. Start MongoDB (local or use MongoDB Atlas)
5. Run the application:

```bash
# Development mode
npm run dev

# Production mode
npm start
```

## Environment Variables

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/b2b-database
JWT_SECRET=your-super-secret-jwt-key
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change user password
- `GET /api/auth/users` - Get all users (admin only)
- `PUT /api/auth/users/:id/toggle-status` - Toggle user status (admin only)

### Products

- `GET /api/products` - Get all products (with filtering, sorting, pagination)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create new product (admin/manager only)
- `PUT /api/products/:id` - Update product (admin/manager only)
- `DELETE /api/products/:id` - Delete product (admin only)
- `GET /api/products/category/:category` - Get products by category
- `POST /api/products/:id/bulk-price` - Calculate bulk pricing

### Health Check

- `GET /api/health` - API health check

## Product Schema

Based on the TypeScript interface provided:

```javascript
{
  name: String (required),
  price: Number (required),
  originalPrice: Number (optional),
  description: String (required),
  category: String (required),
  images: [String] (array of image URLs),
  stock: Number (required),
  sku: String (required, unique),
  status: "active" | "inactive",
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated),
  
  // Additional B2B features
  minOrderQuantity: Number,
  bulkPricing: [{minQuantity, pricePerUnit}],
  manufacturer: String,
  tags: [String]
}
```

## User Roles

- **Admin**: Full access to all operations
- **Manager**: Can manage products but cannot delete them or manage users
- **Buyer**: Can view products and manage their own profile

## Usage Examples

### Register a new user
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe",
    "role": "buyer"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Create a product (requires authentication)
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sample Product",
    "price": 99.99,
    "description": "A great product",
    "category": "Electronics",
    "stock": 100,
    "sku": "PROD-001"
  }'
```

### Get products with filtering
```bash
curl "http://localhost:5000/api/products?category=Electronics&minPrice=50&maxPrice=200&page=1&limit=10&sortBy=price&sortOrder=asc"
```

## File Upload

Products support multiple image uploads. Send a multipart/form-data request with image files:

```bash
curl -X POST http://localhost:5000/api/products \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "name=Sample Product" \
  -F "price=99.99" \
  -F "description=A great product" \
  -F "category=Electronics" \
  -F "stock=100" \
  -F "images=@image1.jpg" \
  -F "images=@image2.jpg"
```

## Error Handling

The API returns consistent error responses:

```json
{
  "status": "error",
  "message": "Error description",
  "errors": ["Detailed validation errors"]
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License
