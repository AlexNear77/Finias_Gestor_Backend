import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createSale = async (req: Request, res: Response): Promise<void> => {
  try {
    const { items, paymentMethod } = req.body; // items es un array de objetos { productId, size, quantity }

    // Validar que items no esté vacío
    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ message: "Debe proporcionar al menos un producto para la venta." });
      return;
    }

    // Validar que paymentMethod sea válido
    if (!paymentMethod) {
      res.status(400).json({ message: "Debe proporcionar un método de pago." });
      return;
    }

    // Iniciar una transacción
    const sale = await prisma.$transaction(async (prisma) => {
      let totalAmount = 0;

      // Array para almacenar los detalles de los items vendidos
      const saleItemsData = [];

      for (const item of items) {
        const { productId, size, quantity } = item;

        // Validar los datos del item
        if (!productId || !size || quantity <= 0) {
          throw new Error("Datos del item incompletos o inválidos.");
        }

        // Obtener el producto
        const product = await prisma.products.findUnique({
          where: { productId },
          include: { sizes: true },
        });

        if (!product) {
          throw new Error(`Producto con ID ${productId} no encontrado.`);
        }

        // Obtener el stock del tamaño específico
        const productSize = product.sizes.find(
          (ps) => ps.size === size
        );

        if (!productSize) {
          throw new Error(`El tamaño ${size} del producto ${product.name} no está disponible.`);
        }

        // Verificar el stock
        if (productSize.stockQuantity < quantity) {
          throw new Error(`Stock insuficiente para el producto ${product.name}, tamaño ${size}.`);
        }

        // Calcular el total
        const itemTotal = product.price * quantity;
        totalAmount += itemTotal;

        // Agregar al array de saleItemsData
        saleItemsData.push({
          productId,
          size,
          quantity,
          price: product.price,
        });

        // Actualizar el stock del tamaño específico
        await prisma.productSize.update({
          where: {
            id: productSize.id,
          },
          data: {
            stockQuantity: productSize.stockQuantity - quantity,
          },
        });
      }

      // Crear la venta
      const newSale = await prisma.sales.create({
        data: {
          totalAmount,
          paymentMethod,
          saleItems: {
            create: saleItemsData,
          },
        },
        include: {
          saleItems: true,
        },
      });

      return newSale;
    });

    res.status(201).json(sale);
  } catch (error) {
    console.error("Error al crear la venta:", error);
  }
};

export const getSales = async (req: Request, res: Response): Promise<void> => {
  try {
    const sales = await prisma.sales.findMany({
      include: {
        saleItems: {
          include: {
            product: true,
          },
        },
      },
    });

    res.json(sales);
  } catch (error) {
    console.error("Error al obtener las ventas:", error);
    res.status(500).json({ message: "Error al obtener las ventas." });
  }
};
