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


export async function deleteRental(req, res) {
  const rentalId = Number(req.params.id);

  if (!isValidRentalId(rentalId)) {
    return res.sendStatus(400);
  }

  try {
    const rental = await getRental(rentalId);
    if (!rental) {
      return res.sendStatus(404);
    }
    if (!isRentalFinished(rental)) {
      return res.sendStatus(400);
    }
    const deleted = await deleteRentalFromDb(rentalId);
    if (deleted) {
      return res.sendStatus(200);
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}

function isValidRentalId(rentalId) {
  return rentalId && rentalId > 0 && Number.isSafeInteger(rentalId);
}

async function getRental(rentalId) {
  const rentalExists = await db.query('SELECT * FROM rentals WHERE id = $1', [
    rentalId,
  ]);
  return rentalExists.rowCount === 1 ? rentalExists.rows[0] : null;
}

function isRentalFinished(rental) {
  return rental["returnDate"] !== null;
}

async function deleteRentalFromDb(rentalId) {
  const deleteRental = await db.query('DELETE FROM rentals WHERE id = $1', [
    rentalId,
  ]);
  return deleteRental.rowCount === 1;
}
