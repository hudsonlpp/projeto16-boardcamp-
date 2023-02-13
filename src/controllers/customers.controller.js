import { db } from '../database/database.connection.js';

async function handleDbError(error, res) {
  res.sendStatus(500);
}

export async function listCustomers(_req, res) {
  try {
    const result = await db.query('SELECT * FROM customers');
    res.send(result.rows);
  } catch (error) {
    handleDbError(error, res);
  }
}

export async function listCustomer(req, res) {
  const customer = Number(req.params.id);
  if (!customer || customer < 1 || !Number.isSafeInteger(customer)) {
    return res.sendStatus(400);
  }
  try {
    const result = await db.query('SELECT * FROM customers WHERE id = $1', [
      customer,
    ]);
    if (result.rowCount === 0) {
      return res.sendStatus(404);
    }
    res.send(result.rows[0]);
  } catch (error) {
    handleDbError(error, res);
  }
}

export async function insertCustomer(req, res) {
  const { name, phone, cpf, birthday } = req.body;
  try {
    const existingCustomer = await db.query(
      'SELECT * FROM customers WHERE cpf = $1',
      [cpf]
    );
    if (existingCustomer.rowCount > 0) {
      return res.sendStatus(409);
    }
    const result = await db.query(
      'INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4)',
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
  const customerId = Number(req.params.id);
  if (!customerId || customerId < 1 || !Number.isSafeInteger(customerId)) {
    return res.sendStatus(400);
  }
  try {
    const result = await db.query('SELECT * FROM customers WHERE id = $1', [
      customerId,
    ]);
    if (result.rowCount === 0) {
      return res.sendStatus(404);
    }
    const { name, phone, cpf, birthday } = req.body;
    const existingCpf = await db.query(
      'SELECT * FROM customers WHERE cpf = $1 AND id <> $2',
      [cpf, customerId]
    );
    if (existingCpf.rowCount > 0) {
      return res.sendStatus(409);
    }
    const updateCustomer = await db.query(
        'UPDATE customers SET name = $1, phone = $2, cpf = $3, birthday = $4 WHERE id = $5',
        [name, phone, cpf, birthday, customerId]
      );
      if (updateCustomer.rowCount === 0) {
        return res.sendStatus(400);
      }
      res.sendStatus(200);
    } catch (error) {
      res.sendStatus(500);
    }
  }