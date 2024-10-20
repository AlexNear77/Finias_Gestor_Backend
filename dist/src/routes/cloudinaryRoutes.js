"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/cloudinaryRoutes.ts
const express_1 = require("express");
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const router = (0, express_1.Router)();
router.post('/sign-cloudinary-params', (req, res) => {
    const { paramsToSign } = req.body;
    if (!paramsToSign) {
        return res.status(400).json({ error: 'No params to sign' });
    }
    const signature = cloudinary_1.default.utils.api_sign_request(paramsToSign, process.env.CLOUDINARY_API_SECRET);
    res.json({ signature });
});
exports.default = router;
