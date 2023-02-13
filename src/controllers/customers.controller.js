import { db } from "../database/database.connection.js";

async function handleDbError(error, res) {
  res.sendStatus(500);
}

export async function customersList(_req, res) {
  try {
    const result = await db.query("SELECT * FROM customers");
    res.send(result.rows);
  } catch (error) {
    handleDbError(error, res);
  }
}

export async function listCustomer(req, res) {
  try {
    const customerId = Number(req.params.id);
    const customer = await getCustomerById(customerId);
    if (!customer) {
      return res.sendStatus(404);
    }
    res.send(customer);
  } catch (error) {
    handleDbError(error, res);
  }
}

async function getCustomerById(id) {
  if (!id || id < 1 || !Number.isSafeInteger(id)) {
    throw new Error("Invalid customer ID");
  }

  const result = await db.query("SELECT * FROM customers WHERE id = $1", [
    id,
  ]);
  if (result.rowCount === 0) {
    return null;
  }
  return result.rows[0];
}


export async function getCostumer(req, res) {
  const { name, phone, cpf, birthday } = req.body;
  try {
    const existingCustomer = await db.query(
      "SELECT * FROM customers WHERE cpf = $1",
      [cpf]
    );
    if (existingCustomer.rowCount > 0) {
      return res.sendStatus(409);
    }
    const result = await db.query(
      "INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4)",
      [name, phone, cpf, birthday]
    );
    if (result.rowCount === 0) {
      return res.sendStatus(400);
    }
    res.sendStatus(201);
  } catch (error) {
    handleDbError(error, res);
  }
}

export async function updateCustomer(req, res) {
  try {
    const customerId = Number(req.params.id);
    const customer = await getCustomerById(customerId);
    if (!customer) {
      return res.sendStatus(404);
    }
    const { name, phone, cpf, birthday } = req.body;
    if (await cpfExists(cpf, customerId)) {
      return res.sendStatus(409);
    }
    await updateCustomerInDb(customerId, name, phone, cpf, birthday);
    res.sendStatus(200);
  } catch (error) {
    handleDbError(error, res);
  }
}

async function getCustomerById(id) {
  if (!id || id < 1 || !Number.isSafeInteger(id)) {
    throw new Error("Invalid customer ID");
  }

  const result = await db.query("SELECT * FROM customers WHERE id = $1", [
    id,
  ]);
  if (result.rowCount === 0) {
    return null;
  }
  return result.rows[0];
}

async function cpfExists(cpf, customerId) {
  const result = await db.query(
    "SELECT * FROM customers WHERE cpf = $1 AND id <> $2",
    [cpf, customerId]
  );
  return result.rowCount > 0;
}

async function updateCustomerInDb(id, name, phone, cpf, birthday) {
  const result = await db.query(
    "UPDATE customers SET name = $1, phone = $2, cpf = $3, birthday = $4 WHERE id = $5",
    [name, phone, cpf, birthday, id]
  );
  if (result.rowCount === 0) {
    throw new Error("Failed to update customer");
  }
}
