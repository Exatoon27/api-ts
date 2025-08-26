import db from "@/database";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";

export default async function updateCategory(req: Request, res: Response) {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string; role: string };
    if (!decoded) return res.status(401).json({ error: "Unauthorized" });

    if (decoded.role.toUpperCase() !== "ADMIN") return res.status(403).json({ error: "Forbidden" });

    const { id } = req.params;
    const { name } = req.body;

    // Validate input
    if (!name || !id) {
        return res.status(400).json({ error: "Name and id are required" });
    }
    
    try {
        // Update category in the database
        const updatedCategory = await db.category.update({
            where: { id: parseInt(id, 10) },
            data: { name }
        });

        if (!updatedCategory) {
        return res.status(404).json({ error: "Category not found" });
        }

        return res.status(200).json(updatedCategory);
    } catch (error) {
        console.error("Error updating category:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}
