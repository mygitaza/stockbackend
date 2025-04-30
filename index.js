import express  from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors  from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import userRoute from './src/route/userRoutes.js';
import stockRoute from './src/route/stockRoutes.js';

dotenv.config();
const app = express()
const port = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://mode-inc.onrender.com",
  "https://mode-admin.onrender.com"
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Authorization"]
}));

// ✅ Optional: Handle preflight (OPTIONS) requests globally
app.options("*", cors());

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));


app.use("/api/users",userRoute);
app.use("/api/stock", stockRoute);

async function main() {
  await mongoose.connect(process.env.MONGODB_URL);

}

app.get('/', (req, res) => {
  res.send('stock running successfully!')
})

main()
.then(() => console.log("Mongodb connected successfully!"))
.catch(err => console.log(err));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
