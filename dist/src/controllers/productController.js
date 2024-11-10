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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getProducts = void 0;
const client_1 = require("@prisma/client");
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const prisma = new client_1.PrismaClient();
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const search = (_a = req.query.search) === null || _a === void 0 ? void 0 : _a.toString();
        const branchId = (_b = req.query.branchId) === null || _b === void 0 ? void 0 : _b.toString();
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 8;
        const skip = (page - 1) * limit;
        const whereCondition = {};
        if (search) {
            whereCondition.name = {
                contains: search,
                mode: 'insensitive',
            };
        }
        if (branchId) {
            whereCondition.branchId = branchId;
        }
        const products = yield prisma.products.findMany({
            where: whereCondition,
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                sizes: true,
                branch: true, // Opcional, si quieres incluir la información de la sucursal
            },
            skip: skip,
            take: limit,
        });
        const totalProducts = yield prisma.products.count({
            where: whereCondition,
        });
        const totalPages = Math.ceil(totalProducts / limit);
        res.json({ products, totalPages, currentPage: page });
    }
    catch (error) {
        console.error("Error al obtener los productos:", error);
        res.status(500).json({ message: "Error al obtener los productos" });
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
            include: {
                sizes: true, // Para devolver los tamaños asociados al producto
                branch: true, // Opcional, si quieres incluir la información de la sucursal
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
        const { productId, name, price, rating, stockQuantity, description, gender, sizes, // Esperamos que 'sizes' sea un array de objetos con 'size' y 'stockQuantity'
        branchId } = req.body;
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
        // Validación de 'description' y 'gender' si están presentes
        if (description !== undefined && typeof description !== 'string') {
            res.status(400).json({ message: "La descripción debe ser una cadena si está presente" });
            return;
        }
        if (gender !== undefined && typeof gender !== 'string') {
            res.status(400).json({ message: "El género debe ser una cadena si está presente" });
            return;
        }
        // Validación de 'sizes' si está presente
        let sizesData = undefined;
        if (sizes !== undefined) {
            if (!Array.isArray(sizes)) {
                res.status(400).json({ message: "Sizes debe ser un arreglo de tamaños" });
                return;
            }
            // Validar cada tamaño
            sizesData = sizes.map((size) => {
                if (!size.size ||
                    typeof size.size !== 'string' ||
                    size.size.trim() === '') {
                    throw new Error("Cada tamaño debe tener un 'size' válido");
                }
                if (size.stockQuantity === undefined ||
                    typeof size.stockQuantity !== 'number') {
                    throw new Error("Cada tamaño debe tener un 'stockQuantity' numérico");
                }
                return {
                    size: size.size,
                    stockQuantity: size.stockQuantity,
                };
            });
        }
        // Verificar si el producto ya existe
        const existingProduct = yield prisma.products.findUnique({
            where: { productId },
        });
        if (existingProduct) {
            res.status(400).json({ message: "El ID del producto ya existe" });
            return;
        }
        // validar si branchId es proporcionado
        if (branchId) {
            const existingBranch = yield prisma.branches.findUnique({
                where: { branchId },
            });
            if (!existingBranch) {
                res.status(400).json({ message: "La sucursal proporcionada no existe" });
                return;
            }
        }
        // Preparar datos para la creación del producto
        const product = yield prisma.products.create({
            data: {
                productId,
                name,
                price,
                rating,
                stockQuantity,
                description,
                gender,
                branchId,
                // Si hay tamaños, crear las entradas relacionadas
                sizes: sizesData
                    ? {
                        create: sizesData.map((size) => ({
                            id: undefined, // Deja que Prisma genere el ID automáticamente
                            size: size.size,
                            stockQuantity: size.stockQuantity,
                        })),
                    }
                    : undefined,
            },
            include: {
                sizes: true, // Para devolver los tamaños creados junto con el producto
                branch: true, // Opcional, si quieres incluir la información de la sucursal
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
        const { name, price, rating, stockQuantity, description, gender, sizes, // Opcionalmente, los nuevos tamaños
        branchId, } = req.body;
        // Validación similar a la de createProduct...
        //validando branchId
        if (branchId) {
            const existingBranch = yield prisma.branches.findUnique({
                where: { branchId },
            });
            if (!existingBranch) {
                res.status(400).json({ message: "La sucursal proporcionada no existe" });
                return;
            }
        }
        // Preparar los datos para la actualización
        const updateData = {
            name,
            price,
            rating,
            stockQuantity,
            description,
            gender,
            branchId,
        };
        // Manejar la actualización de 'sizes' si se proporcionan
        if (sizes !== undefined) {
            if (!Array.isArray(sizes)) {
                res.status(400).json({ message: "Sizes debe ser un arreglo de tamaños" });
                return;
            }
            // Eliminar los tamaños existentes y agregar los nuevos
            updateData.sizes = {
                deleteMany: {}, // Elimina todos los tamaños asociados al producto
                create: sizes.map((size) => {
                    if (!size.size ||
                        typeof size.size !== 'string' ||
                        size.size.trim() === '') {
                        throw new Error("Cada tamaño debe tener un 'size' válido");
                    }
                    if (size.stockQuantity === undefined ||
                        typeof size.stockQuantity !== 'number') {
                        throw new Error("Cada tamaño debe tener un 'stockQuantity' numérico");
                    }
                    return {
                        size: size.size,
                        stockQuantity: size.stockQuantity,
                    };
                }),
            };
        }
        const updatedProduct = yield prisma.products.update({
            where: {
                productId: productId,
            },
            data: updateData,
            include: {
                sizes: true,
                branch: true,
            },
        });
        res.json(updatedProduct);
    }
    catch (error) {
        console.error("Error al actualizar el producto:", error);
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
        // Eliminar la imagen de Cloudinary usando el productId
        try {
            yield cloudinary_1.default.uploader.destroy(productId);
            console.log(`Imagen con public_id ${productId} eliminada de Cloudinary.`);
        }
        catch (error) {
            console.error("Error al eliminar la imagen en Cloudinary:", error);
        }
        // Eliminar el producto de la base de datos
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
