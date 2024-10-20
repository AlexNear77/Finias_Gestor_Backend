// src/routes/cloudinaryRoutes.ts
import { Router, Request, Response } from 'express';
import cloudinary from '../config/cloudinary';

const router = Router();

router.post('/sign-cloudinary-params', (req: Request, res: Response) => {
  const { paramsToSign } = req.body;

  if (!paramsToSign) {
    return res.status(400).json({ error: 'No params to sign' });
  }

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET as string
  );

  res.json({ signature });
});

export default router;
