import { Router } from "express";
import { listRentals, insertRental, finishRental, deleteRental,} from "../controllers/rentals.controllers.js";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";
import { insertRentalSchema } from "../schemas/rental.schema.js";

const rentals = Router();

rentals.get("/", listRentals);
rentals.post("/", validateSchema(insertRentalSchema), insertRental);
rentals.post("/:id/return", finishRental);
rentals.delete("/:id", deleteRental);

export default rentals;