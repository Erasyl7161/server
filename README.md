# **E-Commerce API Using MongoDB**  

## **📌 Project Overview**  
This project is a **RESTful API for an e-commerce platform**, built using **Node.js, Express, and MongoDB**. It supports user authentication, product management, order processing, and analytics.  

## **🚀 Features**  
✅ **User Authentication & RBAC** (Admin/User roles)  
✅ **CRUD Operations** for Products, Users, and Orders  
✅ **Advanced Aggregation Queries** for sales analytics  
✅ **Indexing & Performance Optimization**  
✅ **Security Features** (JWT authentication, password hashing)  
✅ **MongoDB Atlas Integration**  

---

## **🛠️ Technologies Used**  
- **Node.js + Express.js** – Backend framework  
- **MongoDB + Mongoose** – NoSQL database  
- **JWT (JSON Web Tokens)** – Authentication  
- **Bcrypt** – Secure password hashing  
- **Multer** – File uploads for product images  
- **Postman** – API testing  

---

## **📂 Project Structure**  
```
server/
│── config/
│   └── database.js       # MongoDB connection setup
│── controllers/
│   ├── userController.js    # User authentication & profile management
│   ├── deviceController.js  # CRUD operations for products
│   ├── orderController.js   # Order processing & sales analytics
│── middleware/
│   ├── authMiddleware.js    # JWT authentication verification
│   ├── checkRoleMiddleware.js  # Role-based access control
│── models/
│   ├── User.js      # User schema
│   ├── Device.js    # Product schema
│   ├── Order.js     # Order schema
│── routes/
│   ├── userRouter.js   # User-related API routes
│   ├── deviceRouter.js # Product-related API routes
│   ├── orderRouter.js  # Order-related API routes
│── static/              # Product images storage
│── index.js             # Main server file
│── .env                 # Environment variables (DB config, JWT secret)
│── package.json         # Dependencies & scripts
```

---

## **🔗 API Endpoints**  
### **🛠️ Authentication**
| Method | Endpoint        | Description                |
|--------|---------------|----------------------------|
| `POST` | `/api/user/register` | Register a new user |
| `POST` | `/api/user/login` | Login and receive a JWT token |
| `GET`  | `/api/user/profile` | Get logged-in user profile |

### **📦 Product Management**
| Method | Endpoint       | Description                |
|--------|---------------|----------------------------|
| `POST` | `/api/device/` | Create a new product |
| `GET`  | `/api/device/` | Get all products |
| `GET`  | `/api/device/:id` | Get product details by ID |
| `PUT`  | `/api/device/:id` | Update product details |
| `DELETE` | `/api/device/:id` | Delete a product |

### **🛒 Order Management**
| Method | Endpoint       | Description                |
|--------|---------------|----------------------------|
| `POST` | `/api/order/` | Create a new order |
| `GET`  | `/api/order/` | Get all orders |
| `GET`  | `/api/order/sales-analytics` | Get sales reports using aggregation |

---

## **⚙️ Installation & Setup**  
1️⃣ **Clone the repository**  
```sh
git clone https://github.com/your-repo.git
cd server
```
2️⃣ **Install dependencies**  
```sh
npm install
```
3️⃣ **Set up environment variables** (`.env` file)  
```sh
PORT=5000
MONGO_URI=mongodb+srv://your-mongo-db-url
JWT_SECRET=your-secret-key
```
4️⃣ **Run the server**  
```sh
npm run dev
```
5️⃣ **Test API using Postman or a frontend application**  

---

## **🔒 Security Features**  
🔹 **JWT Authentication:** Secure login and session management  
🔹 **Password Hashing:** Using Bcrypt for encrypted storage  
🔹 **Role-Based Access Control (RBAC):** Admin & User permissions  
🔹 **Input Validation & Error Handling:** Prevents invalid data insertion  

---

## **📈 Performance Optimization**  
✅ **Indexes:** Faster search queries using compound indexes  
✅ **Aggregation Pipelines:** Multi-stage processing for analytics  
✅ **Sharding Support:** Can scale horizontally with MongoDB clusters  

---

## **👨‍💻 Contributing**  
We welcome contributions! Feel free to submit **issues** or **pull requests**.  

📧 **Contact:** your-email@example.com  

🚀 **Happy coding!**
