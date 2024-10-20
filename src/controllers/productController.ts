import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const search = req.query.search?.toString();
    const products = await prisma.products.findMany({
      where: search ? {
        name: {
          contains: search,
          mode: 'insensitive', // Búsqueda sin sensibilidad a mayúsculas
        },
      } : {},
      orderBy: {
        // Ordenar por nombre
        name: 'asc',
      },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving products" });
  }
};


export const getProductById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const productId = req.params.id;
    const product = await prisma.products.findUnique({
      where: {
        productId: productId,
      },
    });
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Producto no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el producto" });
  }
};

export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
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
    const existingProduct = await prisma.products.findUnique({
      where: { productId },
    });
    if (existingProduct) {
      res.status(400).json({ message: "El ID del producto ya existe" });
      return;
    }

    // Preparar datos para la creación del producto
    const product = await prisma.products.create({
      data: {
        productId,
        name,
        price,
        rating,
        stockQuantity,
      },
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error creating product" });
  }
};

export const updateProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const productId = req.params.id;
    const { name, price, rating, stockQuantity } = req.body;
    const updatedProduct = await prisma.products.update({
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
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el producto" });
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const productId = req.params.id;

    // Verificar si el producto existe
    const existingProduct = await prisma.products.findUnique({
      where: { productId },
    });

    if (!existingProduct) {
      res.status(404).json({ message: "Producto no encontrado" });
      return;
    }

    // Eliminar el producto
    await prisma.products.delete({
      where: { productId },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Error al eliminar el producto:", error);
    res.status(500).json({ message: "Error al eliminar el producto" });
  }
};