import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import userRoutes from "./routes/users.js";
import menuRoutes from "./routes/menu.js";
import orderRoutes from "./routes/orders.js";
import authRoutes from "./routes/auth.js"; // ⬅️ tambahin ini

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

// Routes
app.get("/", (req, res) => {
  res.send("GoCanteen API 🚀");
});

app.use("/users", userRoutes);
app.use("/menu", menuRoutes);
app.use("/orders", orderRoutes);
app.use("/auth", authRoutes); // ⬅️ tambahin ini

app.listen(PORT, () =>
  console.log(`✅ Backend running at http://localhost:${PORT}`)
);
