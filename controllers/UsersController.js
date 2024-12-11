import { ObjectId } from 'mongodb';
import sha1 from 'sha1';
import Queue from 'bull';
import dbClient from '../utils/db';
import userUtils from '../utils/user';

const userQueue = new Queue('userQueue');

class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;

    if (!email) return res.status(400).json({ error: 'Missing email' });
    if (!password) return res.status(400).json({ error: 'Missing password' });

    const usersCollection = dbClient.db.collection('users');
    const userExists = await usersCollection.findOne({ email });

    if (userExists) return res.status(400).json({ error: 'Already exist' });

    const hashedPassword = crypto.createHash('sha1').update(password).digest('hex');
    const newUser = { email, password: hashedPassword };

    const result = await usersCollection.insertOne(newUser);

    res.status(201).json({ id: result.insertedId, email });
  }

  static async getMe(req, res) {
    const { userId } = req;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const user = await dbClient.db.collection('users').findOne({ _id: new ObjectId(userId) });
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    res.status(200).json({ id: user._id, email: user.email });
  }
}

export default UsersController;
