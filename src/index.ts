import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet'
import morgan from 'morgan';

/* Routes imports */
import dashboardRoutes from './routes/dashboardRoutes';
import productRoutes from './routes/productRoutes';
import userRoutes from './routes/userRoutes';
import expenseRoutes from './routes/expenseRoutes';
import cloudinaryRoutes from './routes/cloudinaryRoutes';
import branchRoutes from './routes/branchRoutes';
import salesRoutes from './routes/salesRoutes';

/* Configs */
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}))
app.use(cors());

/* Routes */
app.use('/branches',branchRoutes); // http://localhost:8000/branches
app.use("/dashboard", dashboardRoutes); // http://localhost:8000/dashboard
app.use("/products", productRoutes); // http://localhost:8000/products
app.use("/users", userRoutes); // http://localhost:8000/users
app.use("/expenses", expenseRoutes); // http://localhost:8000/expenses
app.use('/cloudinary', cloudinaryRoutes); // http://localhost:8000/cloudinary
app.use('/sales', salesRoutes); // http://localhost:8000/sales

/* Server */
const port = Number(process.env.PORT) || 3003;
app.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on port ${port}`);
});