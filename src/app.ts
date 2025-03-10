import {PrismaClient} from '@prisma/client';
import express, {Express} from 'express';
import Router from "./routes/transactionRoutes";

const prisma = new PrismaClient();
const PORT = 3000;
const app: Express = express();

app.use(express.json());

prisma.$connect();
console.log('Connected to database');

app.get("/healthcheck", (_req, res) => {
    res.send("OK");
});

app.use("/", Router);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
