import db from "@/database";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";

export default async function deleteCategory(req: Request, res: Response) {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string; role: string };
    if (!decoded) return res.status(401).json({ error: "Unauthorized" });

    if (decoded.role.toUpperCase() !== "ADMIN") return res.status(403).json({ error: "Forbidden" });

    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "Category ID is required" });

    try {
        await db.category.delete({
            where: {
                id: parseInt(id, 10)
            }
        });
        return res.status(204).send();
    } catch (error) {
        console.error("Error deleting category:", error);
        return res.status(500).json({ error: "Internal server error", message: "Maybe the category doesn't exist" });
    }
}