import db from "@/database";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";

export default async function updateProduct(req: Request, res: Response) {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string; role: string };
    if (!decoded) return res.status(401).json({ error: "Unauthorized" });

    if (decoded.role.toUpperCase() !== "ADMIN") return res.status(403).json({ error: "Forbidden" });

    const { id } = req.params;
    const { name, price, description, categoryId } = req.body;

    // Validate input
    if (!id || !name || !price || !categoryId) {
        return res.status(400).json({ error: "Name, price, categoryId and id are required" });
    }
    
    try {
        // Update product in the database
        const updatedProduct = await db.product.update({
            where: { id: parseInt(id, 10) },
            data: { name, price, description, categoryId: parseInt(categoryId, 10) }
        });

        if (!updatedProduct) {
        return res.status(404).json({ error: "Product not found" });
        }

        return res.status(200).json(updatedProduct);
    } catch (error) {
        console.error("Error updating product:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}
