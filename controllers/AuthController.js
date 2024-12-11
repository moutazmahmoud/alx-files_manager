import { v4 as uuidv4 } from 'uuid';
import sha1 from 'sha1';
import redisClient from '../utils/redis';
import userUtils from '../utils/user';

class AuthController {
  static async getConnect(req, res) {
    const authHeader = req.header('Authorization');
    if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });

    const credentials = Buffer.from(authHeader.split(' ')[1], 'base64')
      .toString()
      .split(':');
    const [email, password] = credentials;

    const hashedPassword = crypto
      .createHash('sha1')
      .update(password)
      .digest('hex');
    const user = await dbClient.db
      .collection('users')
      .findOne({ email, password: hashedPassword });

    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const token = uuidv4();
    await redisClient.set(`auth_${token}`, user._id.toString(), 86400);

    res.status(200).json({ token });
  }

  static async getDisconnect(req, res) {
    const token = req.header('X-Token');
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    await redisClient.del(`auth_${token}`);
    res.status(204).send();
  }
}

export default AuthController;
