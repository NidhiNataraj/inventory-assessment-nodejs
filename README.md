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

* How/where to download your program
* Any modifications needed to be made to files/folders

### Executing program

* How to run the program
* Step-by-step bullets
```
code blocks for commands
```

## Help

Any advise for common problems or issues.
```
command to run if program contains helper info
```

## Authors

Contributors names and contact info

ex. Dominique Pizzie  
ex. [@DomPizzie](https://twitter.com/dompizzie)

## Version History

* 0.2
    * Various bug fixes and optimizations
    * See [commit change]() or See [release history]()
* 0.1
    * Initial Release

## License

This project is licensed under the [NAME HERE] License - see the LICENSE.md file for details

## Acknowledgments

Inspiration, code snippets, etc.
* [awesome-readme](https://github.com/matiassingers/awesome-readme)
* [PurpleBooth](https://gist.github.com/PurpleBooth/109311bb0361f32d87a2)
* [dbader](https://github.com/dbader/readme-template)
* [zenorocha](https://gist.github.com/zenorocha/4526327)
* [fvcproductions](https://gist.github.com/fvcproductions/1bfc2d4aecb01a834b46)
