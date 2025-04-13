require("dotenv").config(); // Thêm dòng này ở đầu file để đọc biến môi trường
const jwt = require("jsonwebtoken");
const express = require("express");
const cors = require("cors");
const authRouters = require("./routers/auth");
const productRouters = require("./routers/product");
const cartRouters = require("./routers/cart");
const orderRouters = require("./routers/order");
const adminRouters = require("./routers/admin");
const liveChatRouter = require("./routers/liveChat");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const socketio = require("socket.io");
const { initSocket } = require("./socket");
const path = require("path");
const multer = require("multer");
const fs = require("fs"); // Thêm module fs để làm việc với file system

const app = express();

// Tạo thư mục images nếu chưa tồn tại
// const imagesDir = path.join(__dirname, "images");
// if (!fs.existsSync(imagesDir)) {
//   fs.mkdirSync(imagesDir, { recursive: true });
// }

// app.use(
//   cors({
//     origin: [
//       "http://localhost:3000",
//       "http://localhost:3001",
//       "https://lab03-node.onrender.com",
//     ],
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Cấu hình Multer cho file upload
// const fileStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "images");
//   },
//   filename: (req, file, cb) => {
//     cb(
//       null,
//       new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname
//     );
//   },
// });
// Thay đổi destination trong multer diskStorage
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const destPath = path.join(__dirname, "images");
    if (!fs.existsSync(destPath)) {
      fs.mkdirSync(destPath, { recursive: true });
    }
    cb(null, destPath);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).array("images", 4)
);

// app.use("/images", express.static(path.join(__dirname, "images")));
app.use(
  "/images",
  express.static(path.join(__dirname, "images"), {
    setHeaders: (res, path) => {
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    },
  })
);
// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/auth", authRouters);
app.use(productRouters);
app.use(cartRouters);
app.use("/order", orderRouters);
app.use("/admin", adminRouters);
app.use(liveChatRouter);

// Health check endpoint
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Kết nối MongoDB với biến môi trường

const MONGODB_URI = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.vvoe5vc.mongodb.net/${process.env.MONGODB_DBNAME}?retryWrites=true&w=majority&appName=Cluster0`;
const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Hello from Render with HTTPS!");
});
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    // Khởi tạo socket.io
    initSocket(server);
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });

//dongnttfx21730
//iQ1TA760Se5lvzHx

//https://lab03-node.onrender.com
