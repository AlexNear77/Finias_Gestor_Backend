"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getProducts = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const search = (_a = req.query.search) === null || _a === void 0 ? void 0 : _a.toString();
        const products = yield prisma.products.findMany({
            where: search ? {
                name: {
                    contains: search,
                    mode: 'insensitive', // Búsqueda sin sensibilidad a mayúsculas
                },
            } : {},
        });
        res.json(products);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving products" });
    }
});
exports.getProducts = getProducts;
const getProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = req.params.id;
        const product = yield prisma.products.findUnique({
            where: {
                productId: productId,
            },
        });
        if (product) {
            res.json(product);
        }
        else {
            res.status(404).json({ message: "Producto no encontrado" });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Error al obtener el producto" });
    }
});
exports.getProductById = getProductById;
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId, name, price, rating, stockQuantity } = req.body;
        // Validación de campos obligatorios y tipos de datos
        if (!productId || typeof productId !== 'string' || productId.trim() === '') {
            res.status(400).json({ message: "El ID del producto es obligatorio y debe ser una cadena no vacía" });
            return;
        }
        if (!name || typeof name !== 'string' || name.trim() === '') {
            res.status(400).json({ message: "El nombre del producto es obligatorio y debe ser una cadena no vacía" });
            return;
        }
        if (price === undefined || typeof price !== 'number') {
            res.status(400).json({ message: "El precio es obligatorio y debe ser un número" });
            return;
        }
        if (stockQuantity === undefined || typeof stockQuantity !== 'number') {
            res.status(400).json({ message: "La cantidad de stock es obligatoria y debe ser un número" });
            return;
        }
        // Validación de 'rating' si está presente
        if (rating !== undefined && typeof rating !== 'number') {
            res.status(400).json({ message: "El rating debe ser un número si está presente" });
            return;
        }
        // Verificar si el producto ya existe
        const existingProduct = yield prisma.products.findUnique({
            where: { productId },
        });
        if (existingProduct) {
            res.status(400).json({ message: "El ID del producto ya existe" });
            return;
        }
        // Preparar datos para la creación del producto
        const product = yield prisma.products.create({
            data: {
                productId,
                name,
                price,
                rating,
                stockQuantity,
            },
        });
        res.status(201).json(product);
    }
    catch (error) {
        res.status(500).json({ message: "Error creating product" });
    }
});
exports.createProduct = createProduct;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = req.params.id;
        const { name, price, rating, stockQuantity } = req.body;
        const updatedProduct = yield prisma.products.update({
            where: {
                productId: productId,
            },
            data: {
                name,
                price,
                rating,
                stockQuantity,
            },
        });
        res.json(updatedProduct);
    }
    catch (error) {
        res.status(500).json({ message: "Error al actualizar el producto" });
    }
});
exports.updateProduct = updateProduct;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = req.params.id;
        // Verificar si el producto existe
        const existingProduct = yield prisma.products.findUnique({
            where: { productId },
        });
        if (!existingProduct) {
            res.status(404).json({ message: "Producto no encontrado" });
            return;
        }
        // Eliminar el producto
        yield prisma.products.delete({
            where: { productId },
        });
        res.status(204).send();
    }
    catch (error) {
        console.error("Error al eliminar el producto:", error);
        res.status(500).json({ message: "Error al eliminar el producto" });
    }
});
exports.deleteProduct = deleteProduct;
