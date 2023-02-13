import { Router } from "express";
import games from "./games.routes.js";
import customers from "./customers.routes.js";
import rentals from "./rentals.routes.js";

const router = Router();

router.use("/games", games);
router.use("/customers", customers);
router.use("/rentals", rentals);

export default router;