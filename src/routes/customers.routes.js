import { Router } from "express";
import { customersList, listCustomer, getCostumer, updateCustomer,} from "../controllers/customers.controller.js";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";
import { customerSchema } from "../schemas/customer.schema.js";

const customers = Router();

customers.get("/", customersList);
customers.get("/:id", listCustomer);
customers.post("/", validateSchema(customerSchema), getCostumer);
customers.put("/:id", validateSchema(customerSchema), updateCustomer);

export default customers;
