import dotenv from "dotenv";
dotenv.config();

import express from "express";
import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const jwt = require("jsonwebtoken");
const SECRET_KEY = "mi_clave_secreta";

const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = [
    "http://localhost:5173",
    process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

app.get("/", (req: Request, res: Response) => {
    res.send("Backend is working!");
});

app.get("/tasks", async (req: Request, res: Response) => {
    try {
        const tasks = await prisma.tasks.findMany({ orderBy: { id: "asc" } });
        res.json(tasks);
    } catch (error) {
        console.error("Error GET /tasks:", error);
        res.status(500).json({ message: "Error al obtener tareas" });
    }
});

app.post("/tasks", async (req: Request, res: Response) => {
    try {
        const { text, completed } = req.body;
        if (!text) {
            res.status(400).json({ message: "El campo text es requerido" });
            return;
        }
        const newTask = await prisma.tasks.create({
            data: { text, completed: completed ?? false }
        });
        res.json(newTask);
    } catch (error) {
        res.status(500).json({ message: "Error al crear tarea" });
    }
});

app.put("/tasks/:id", async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const task = await prisma.tasks.findUnique({ where: { id } });
        if (!task) {
            res.status(404).json({ message: "Tarea no encontrada" });
            return;
        }
        const updatedTask = await prisma.tasks.update({
            where: { id },
            data: { completed: !task.completed }
        });
        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar tarea" });
    }
});

app.delete("/tasks/:id", async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        await prisma.tasks.delete({ where: { id } });
        res.json({ message: "Tarea eliminada", id });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar tarea" });
    }
});

app.post("/login", (req: Request, res: Response) => {
    const { username, password } = req.body;
    
    if (username === "admin" && password === "1234") {
        const token = jwt.sign(
            { username: username },
            SECRET_KEY,
            { expiresIn: "1h" }
        );
        res.json({ token });
    } else {
        res.status(401).json({ message: "Credenciales incorrectas" });
    }
});

const verifyToken = (req: Request, res: Response, next: any) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        res.status(401).json({ message: "Token requerido" });
        return;
    }

    jwt.verify(token, SECRET_KEY, (err: any, decoded: any) => {
        if (err) {
            return res.status(403).json({ message: "Token inválido" });
        }
        next();
    });
};

app.get("/private", verifyToken, (req: Request, res: Response) => {
    res.json({ message: "Acceso permitido" });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});