import { Router } from 'express';
import {
  listCustomers,
  listCustomer,
  insertCustomer,
  updateCustomer,
} from '../controllers/customers.controllers.js';
import { validateSchema } from '../middlewares/validateSchema.middleware.js';
import { customerSchema } from '../schemas/customer.schema.js';

const customers = Router();

customers.get('/', listCustomers);
customers.get('/:id', listCustomer);
customers.post('/', validateSchema(customerSchema), insertCustomer);
customers.put('/:id', validateSchema(customerSchema), updateCustomer);

export default customers;
