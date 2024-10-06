import { Router } from "express";
import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
  } from '../controllers/productController';

const router = Router();

router.get('/', getProducts); // Obtener todos los productos
router.get('/:id', getProductById); // Obtener un producto por ID
router.post('/', createProduct); // Crear un nuevo producto
router.put('/:id', updateProduct); // Actualizar un producto existente
router.delete('/:id', deleteProduct); // Eliminar un producto

export default router;