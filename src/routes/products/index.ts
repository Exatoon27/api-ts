import { Router, type Request, type Response } from "express";
import db from "@/database";
import getProductById from "./$id";
import createProduct from "./new";
import deleteProduct from "./delete";
import updateProduct from "./update";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
    res.status(200).send({
        products: await db.product.findMany()
    });
});

router.get("/:id", getProductById);
router.post("/new", createProduct);
router.delete("/remove/:id", deleteProduct);
router.put("/update/:id", updateProduct);

export default router;
