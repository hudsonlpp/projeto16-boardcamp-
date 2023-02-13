import { db } from '../database/database.connection.js';

async function checkExistence(table, id) {
  const result = await db.query(`SELECT 1 FROM ${table} WHERE id = $1`, [id]);
  return result.rowCount === 1;
}

export async function listRentals(_req, res) {
  try {
    const rentals = await db.query(`
    SELECT
      rentals.*,
      customers.name AS customer_name,
      customers.id AS customer_id,
      games.name AS game_name,
      games.id AS game_id
    FROM
      rentals
      JOIN customers ON rentals."customerId" = customers.id
      JOIN games ON rentals."gameId" = games.id;
    `);
    res.send(rentals.rows);
  } catch (err) {
    res.sendStatus(500);
  }
}

export async function insertRental(req, res) {
  const { customerId, gameId, daysRented } = req.body;

  if (!(await checkExistence('customers', customerId))) {
    return res.sendStatus(400);
  }

  if (!(await checkExistence('games', gameId))) {
    return res.sendStatus(400);
  }

  try {
    const openRentals = await db.query(
      'SELECT COUNT(1) AS count FROM rentals WHERE "gameId" = $1',
      [gameId]
    );

    const checkStock = await db.query(
      'SELECT "stockTotal" FROM games WHERE id = $1',
      [gameId]
    );
    if (checkStock.rows[0].stockTotal <= openRentals.rows[0].count) {
      return res.sendStatus(400);
    }

    const rental = await db.query(
      `
      INSERT INTO rentals ("customerId", "gameId", "daysRented", "rentDate", "originalPrice")
      VALUES ($1, $2, $3, NOW(), (SELECT "pricePerDay" FROM games WHERE id = $2) * $3)
      RETURNING id;
    `,
      [customerId, gameId, daysRented]
    );

    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

export async function finishRental(req, res) {
  const rentalId = Number(req.params.id);
  if (!rentalId || rentalId < 1 || !Number.isSafeInteger(rentalId)) {
    return res.sendStatus(400);
  }

  try {
    const rentalExists = await checkExistence('rentals', rentalId);
    if (!rentalExists) {
      return res.sendStatus(404)
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
