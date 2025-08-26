import { Router, type Request, type Response } from "express";
import login from "./login";
import categoriesRouter from "./categories";
import productsRouter from "./products";
import logout from "./logout";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
    // Check if cookie exists
    const token = req.cookies;

    res.status(200).send({
        message: "Bienvenido a la API!",
        route_map: {
            "/api": "API root",
            "/api/categories": "Category management",
            "/api/products": "Product management"
        },
        authenticated: !!token
    })
});

router.post("/login", login)
router.post("/logout", logout)

router.use("/categories", categoriesRouter);
router.use("/products", productsRouter);


export default router;