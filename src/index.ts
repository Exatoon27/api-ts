import express, { type Request, type Response } from 'express'
import cookieParser from "cookie-parser";
import routesIndex from './routes/index'
import db from './database';
import dotenv from 'dotenv'

// ENVIRONMENT VARIABLES CHECK
dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error("Missing DATABASE_URL environment variable");
}

if (!process.env.JWT_SECRET) {
  throw new Error("Missing JWT_SECRET environment variable");
}

// SERVER SETUP

const app: express.Application = express();
const port: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(cookieParser());
app.use(express.json());

app.listen(port, async () => {
  // SETUP ADMIN USER
  if(!await db.user.findFirst({
    where: {
      username: process.env.ADMIN_USERNAME
    }
  })) {
    await db.user.create({
      data: {
        username: process.env.ADMIN_USERNAME || "admin",
        password: process.env.ADMIN_PASSWORD || "admin",
        role: "ADMIN"
      }
    });
  }

  // NOTIFY THE SERVER STARTUP
  console.log(`App listening on port ${port}`)
});

// ROUTES SETUP

// ROOT PATH
app.all("/", async (_req: Request, res: Response) => {
  res.status(418).send({
    "I'm a teapot": "The API is in /api"
  });
});

// API PATHS
app.use("/api", routesIndex);