import db from "@/database";
import type { Request, Response } from "express";

export default async function getCategoryById(req: Request, res: Response) {
    const { id } = req.params;

    const category = await db.category.findUnique({
        where: { id: Number(id) }
    });

    if (!category) {
        return res.status(404).send({ message: "Category not found" });
    }

    return res.status(200).send({ category });
}