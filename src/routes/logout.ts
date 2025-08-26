import type { Request, Response } from "express";

export default async function logout(_req: Request, res: Response) {
    res.clearCookie("token");
    return res.status(200).json({ message: "Logout successful" });
}
