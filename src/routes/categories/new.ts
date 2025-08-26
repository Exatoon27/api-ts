import db from "@/database";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";

export default async function createCategory(req: Request, res: Response) {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string; role: string };
    if (!decoded) return res.status(401).json({ error: "Unauthorized" });

    if (decoded.role.toUpperCase() !== "ADMIN") return res.status(403).json({ error: "Forbidden" });

    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: "Name is required" });
    }

    try {
        const category = await db.category.create({
            data: {
                name,
            }
        })
        return res.status(201).json(category);
    } catch (error) {
        console.error("Error creating category:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}