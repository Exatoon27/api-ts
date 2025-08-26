import { Router, type Request, type Response } from "express";
import db from "@/database";
import getCategoryById from "./$id";
import createCategory from "./new";
import deleteCategory from "./delete";
import updateCategory from "./update";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
    res.status(200).send({
        categories: await db.category.findMany()
    });
});

router.get("/:id", getCategoryById);
router.post("/new", createCategory);
router.delete("/remove/:id", deleteCategory);
router.put("/update/:id", updateCategory);

export default router;
