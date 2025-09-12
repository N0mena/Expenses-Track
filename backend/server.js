import express from "express";
import expenseRoutes from "./routes/expenseRoutes.js";
import incomeRoutes from "./routes/incomeRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import dotenv from 'dotenv';

const app = express();
const PORT = 3000;

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/expenses", expenseRoutes);
app.use("/incomes", incomeRoutes);
app.use("/categories",categoryRoutes);
app.use("/dashboard",dashboardRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

dotenv.config();
