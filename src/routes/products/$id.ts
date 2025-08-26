import db from "@/database";
import type { Request, Response } from "express";

export default async function getProductById(req: Request, res: Response) {
    const { id } = req.params;

    const product = await db.product.findUnique({
        where: { id: Number(id) }
    });

    if (!product) {
        return res.status(404).send({ message: "Product not found" });
    }

    return res.status(200).send({ product });
}