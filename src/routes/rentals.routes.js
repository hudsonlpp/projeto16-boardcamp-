import { Router } from "express";
import { listRentals, finishRental,} from "../controllers/rentals.controller.js";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";
import { getCostumer } from "../controllers/customers.controller.js";
import { insertRental } from "../controllers/rentals.controller.js";
import { deleteRental } from "../controllers/rentals.controller.js";

const rentals = Router();

rentals.get("/", listRentals);
rentals.post("/", validateSchema(getCostumer), insertRental);
rentals.post("/:id/return", finishRental);
rentals.delete("/:id", deleteRental);

export default rentals;