"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productController_1 = require("../controllers/productController");
const router = (0, express_1.Router)();
router.get('/', productController_1.getProducts); // Obtener todos los productos
router.get('/:id', productController_1.getProductById); // Obtener un producto por ID
router.post('/', productController_1.createProduct); // Crear un nuevo producto
router.put('/:id', productController_1.updateProduct); // Actualizar un producto existente
router.delete('/:id', productController_1.deleteProduct); // Eliminar un producto
exports.default = router;
