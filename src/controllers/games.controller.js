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
async function insertGame(req, res) {
  const { name, image, stockTotal, pricePerDay } = req.body;
  
  const gameExists = await getGameByName(name);
  if (gameExists) {
    return res.status(409).send();
  }

  try {
    const result = await db.query(
      'INSERT INTO games (name, image, "stockTotal", "pricePerDay") VALUES ($1, $2, $3, $4)',
      [name, image, stockTotal, pricePerDay]
    );

    if (result.rowCount === 0) {
      return res.status(400).send();
    }

    return res.status(201).send();
  } catch (error) {
    return res.status(500).send();
  }
}
