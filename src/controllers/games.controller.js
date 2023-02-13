import { db } from '../database/database.connection.js';

async function getGameByName(name) {
  const existingGame = await db.query('SELECT * FROM games WHERE name = $1', [name]);
  return existingGame.rows[0];
}

export async function listGames(_req, res) {
  try {
    const result = await db.query('SELECT * FROM games');
    return res.send(result.rows);
  } catch (error) {
    return res.sendStatus(500);
  }
}

export async function insertGame(req, res) {
  const { name, image, stockTotal, pricePerDay } = req.body;
  
  try {
    const game = await getGameByName(name);
    if (game) {
      return res.sendStatus(409);
    }
    const result = await db.query(
      'INSERT INTO games (name, image, "stockTotal", "pricePerDay") VALUES ($1, $2, $3, $4)',
      [name, image, stockTotal, pricePerDay]
    );
    if (result.rowCount === 0) {
      return res.sendStatus(400);
    }
    return res.sendStatus(201);
  } catch (error) {
    return res.sendStatus(500);
  }
}
