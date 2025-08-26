import db from "@/database";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";

export default async function createProduct(req: Request, res: Response) {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string; role: string };
    if (!decoded) return res.status(401).json({ error: "Unauthorized" });

    if (decoded.role.toUpperCase() !== "ADMIN") return res.status(403).json({ error: "Forbidden" });

    const { name, price, description, categoryId } = req.body;

    if (!name || !price || !categoryId) {
        return res.status(400).json({ error: "Name, price, categoryId are required" });
    }

    try {
        const product = await db.product.create({
            data: {
                name,
                price,
                description,
                category: {
                    connect: { id: parseInt(categoryId, 10) }
                }
            }
        });
        return res.status(201).json(product);
    } catch (error) {
        console.error("Error creating product:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}