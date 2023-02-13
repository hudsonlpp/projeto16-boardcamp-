import { Router } from "express";
import { listGames, insertGame } from "../controllers/games.controller.js";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";
import { gameSchema } from "../schemas/game.schema.js";

const games = Router();

games.post("/", validateSchema(gameSchema), insertGame);
games.get("/", listGames);

export default games;