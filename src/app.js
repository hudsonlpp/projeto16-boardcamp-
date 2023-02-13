import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import joi from "joi";
import bcrypt from "bcrypt";
import { v4 as uuidV4 } from 'uuid';

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());

let db;

try {
await mongoClient.connect();
} catch (err) {
console.log("Erro no mongo.conect", err.message);
}

db = mongoClient.db("DIRETORIOOOO");
const talCollection = db.collection("COLLECTIONNNNN");

// ROTAS:

const port = process.env.PORT;
app.listen(port, () => console.log(`Server running in port: ${port}`));