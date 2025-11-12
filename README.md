# Project Title

A **role-based inventory management system** built using **Node.js**, **Express**, and **MongoDB (Mongoose)**.  
Implements secure **JWT authentication**, **admin/user roles**, and full **CRUD** for categories and products with **soft deletion** and centralized error handling.

## Description

This API allows:
- **Admins** to manage users and categories.
- **Users** to manage products under categories created by admins.

Each admin’s data is **isolated** — ensuring users can only manage their own inventory.  
The project demonstrates modular architecture, secure access control, validation, and logging.

## Features

### Authentication & Authorization
- JWT-based authentication
- Passwords hashed using **bcrypt**
- Role-based access control:
  - **Admin** → manage users & categories
  - **User** → manage their products
- Protected routes via JWT middleware

### Category Management (Admin)
- Create, list, update, and delete categories
- Linked to the admin who created them (`user_no`)
- Search and pagination support
- Soft delete using `mongoose-delete`

### Product Management (User)
- Users can create products under categories
- List, filter, and search by name, SKU, or category
- Quantity type: `litres`, `kg`, or `count`
- Linked to both category (`category_no`) and creator (`user_no`)
- Pagination and sorting supported

### Admin Product Dashboard
- Admins can view all products under their categories
- Filter by:
  - `user_no` (specific user)
  - `category_no` (specific category)
  - `search_term` (product/category/user)
- Aggregated and grouped by category for clear insight

### Logging & Error Handling
- Centralized error middleware
- Console + File logging (timestamped)
- Log levels: `Info`, `Error`
- Structured JSON responses for consistency

## 🏁 Getting Started

### 🧩 Dependencies

| Requirement | Version |
|--------------|----------|
| Node.js | 16+ |
| MongoDB | 5+ |
| npm | 8+ |

### Installing

1️⃣ **Clone the Repository**
```bash
git clone https://github.com/NidhiNataraj/inventory-management-api.git
cd inventory-management-api
```

2️⃣ **Install dependencies**
```bash
npm install
```

3️⃣ **Setup Environment File**
```bash
Source/App/.env
```

Example Contents:
JWT_SECRET=supersecretkey123;
DB_URL_INVENTORY=mongodb+srv://<username>:<password>@cluster0.k0lsydy.mongodb.net/Inventory

Note:
This project uses MongoDB Atlas Cloud, already connected via a shared instance for testing.
If you use your own, replace the credentials above with your Atlas connection string.

4️⃣ **Run the Application**
```bash
npm run dev
``` 
Server will start at:
http://localhost:3000

### Demo Credentials

Use these credentials for testing:

## Admin Login
POST /api/inventory/user/admin-login
{
  "email": "admin@gmail.com",
  "password": "Admin@123"
}

## User Login
POST /api/inventory/user/login
{
  "email": "user@gmail.com",
  "password": "User@123"
}

## 🧪 Postman Collection

A complete Postman collection is included for testing all endpoints (authentication, categories, and products).

**File Location:**  
`Source/Postman/Inventory_Management_API.postman_collection.json`

Both accounts are pre-seeded for evaluation in the connected MongoDB Atlas database.

## Version History
1.0.0	JWT Auth, CRUD for User, Category, Product
1.1.0	Admin dashboard with category-user filters
1.2.0	Centralized logging and aggregation improvements

## Author

Name: Your Name
Role: Software Developer
GitHub: @your-username

## Tech Stack
Node.js • Express • MongoDB • JWT • Mongoose

## License

This project is licensed under the MIT License – see LICENSE.md
.

## Acknowledgments

Inspiration, code snippets, etc.
* [awesome-readme](https://github.com/matiassingers/awesome-readme)
* [PurpleBooth](https://gist.github.com/PurpleBooth/109311bb0361f32d87a2)
* [dbader](https://github.com/dbader/readme-template)
* [zenorocha](https://gist.github.com/zenorocha/4526327)
* [fvcproductions](https://gist.github.com/fvcproductions/1bfc2d4aecb01a834b46)
