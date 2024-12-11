import redisClient from '../utils/redis';
import dbClient from '../utils/db';

class AppController {
  /**
   * Returns the status of the Redis and MongoDB connections.
   * @param {Request} req - Express request object.
   * @param {Response} res - Express response object.
   */
  static async getStatus(req, res) {
    const redisAlive = redisClient.isAlive();
    const dbAlive = dbClient.isAlive();

    res.status(200).json({ redis: redisAlive, db: dbAlive });
  }

  /**
   * Returns the number of users and files in the database.
   * @param {Request} req - Express request object.
   * @param {Response} res - Express response object.
   */
  static async getStats(req, res) {
    const usersCount = await dbClient.nbUsers();
    const filesCount = await dbClient.nbFiles();

    res.status(200).json({ users: usersCount, files: filesCount });
  }
}

export default AppController;
