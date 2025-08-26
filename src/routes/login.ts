import type { Request, Response } from "express";
import db from "@/database";
import { compareSync } from "bcrypt-ts";
import jwt from "jsonwebtoken";

export default async function login(req: Request, res: Response) {
    const body = req.body;
    if (!body.username || !body.password) {
      return res.status(400).send({ message: "Username and password are required" });
    }

    const user = await db.user.findFirst({
      where: {
        username: body.username
      }
    });

    if (!user) {
      return res.status(401).send({ message: "Invalid credentials" });
    }

    const isValidPassword = compareSync(body.password, user.password);

    if (!isValidPassword) {
      return res.status(401).send({ message: "Invalid credentials" });
    }

    const token = jwt.sign({
      userId: user.id,
      role: user.role
    }, process.env.JWT_SECRET as string, { expiresIn: '1h' });

    return res.status(200)
    .cookie("token", token, { httpOnly: true })
    .send({ message: "Login successful" });
}
