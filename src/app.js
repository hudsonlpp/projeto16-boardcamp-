import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import joi from "joi";
import bcrypt from "bcrypt";
import { v4 as uuidV4 } from "uuid";
import router from "./routes/app.routes.js";

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());
app.use(router)

let db;

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running in port: ${port}`));