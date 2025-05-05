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

app.use(cors({
  origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://mode-inc.onrender.com",
      "https://mode-admin.onrender.com"
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true, // ✅ Ensures cookies are sent in cross-origin requests
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Authorization"] // ✅ Exposes Authorization header for frontend
}));

// app.options('*', (req, res) => {
//   res.sendStatus(200);
// });


app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));


app.use("/api/users",userRoute);
app.use("/api/stock", stockRoute);

app.get('/', (req, res) => {
  res.send('stock running successfully!')
})

// ✅ 404 Handler LAST
// app.use('*', (req, res) => {
//   res.status(404).json({ message: 'Route not found' });
// });

async function main() {
  await mongoose.connect(process.env.MONGODB_URL);

}

main()
.then(() => console.log("Mongodb connected successfully!"))
.catch(err => console.log(err));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
