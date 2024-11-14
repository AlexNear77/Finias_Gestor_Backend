"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
/* Routes imports */
const dashboardRoutes_1 = __importDefault(require("./routes/dashboardRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const expenseRoutes_1 = __importDefault(require("./routes/expenseRoutes"));
const cloudinaryRoutes_1 = __importDefault(require("./routes/cloudinaryRoutes"));
const branchRoutes_1 = __importDefault(require("./routes/branchRoutes"));
const salesRoutes_1 = __importDefault(require("./routes/salesRoutes"));
/* Configs */
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, helmet_1.default)());
app.use(helmet_1.default.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use((0, morgan_1.default)("common"));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use((0, cors_1.default)());
/* Routes */
app.use('/branches', branchRoutes_1.default); // http://localhost:8000/branches
app.use("/dashboard", dashboardRoutes_1.default); // http://localhost:8000/dashboard
app.use("/products", productRoutes_1.default); // http://localhost:8000/products
app.use("/users", userRoutes_1.default); // http://localhost:8000/users
app.use("/expenses", expenseRoutes_1.default); // http://localhost:8000/expenses
app.use('/cloudinary', cloudinaryRoutes_1.default); // http://localhost:8000/cloudinary
app.use('/sales', salesRoutes_1.default); // http://localhost:8000/sales
/* Server */
const port = process.env.PORT || 3003;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
