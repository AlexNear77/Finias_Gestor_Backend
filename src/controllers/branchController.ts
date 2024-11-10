// src/controllers/branchController.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getBranches = async (req: Request, res: Response) => {
  const branches = await prisma.branches.findMany();
  res.json(branches);
};

export const getBranchById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const branch = await prisma.branches.findUnique({ where: { branchId: id } });
  res.json(branch);
};

export const createBranch = async (req: Request, res: Response) => {
  const { name, location } = req.body;
  const newBranch = await prisma.branches.create({ data: { name, location } });
  res.json(newBranch);
};

export const updateBranch = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, location } = req.body;
  const updatedBranch = await prisma.branches.update({
    where: { branchId: id },
    data: { name, location },
  });
  res.json(updatedBranch);
};

export const deleteBranch = async (req: Request, res: Response) => {
  const { id } = req.params;
  await prisma.branches.delete({ where: { branchId: id } });
  res.json({ message: 'Branch deleted' });
};