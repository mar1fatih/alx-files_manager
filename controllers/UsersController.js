import sha1 from 'sha1';
import dbClient from '../utils/db';

export default class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }

    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    const user = await dbClient.db.collection('users').findOne({ email });

    if (user) {
      return res.status(400).json({ error: 'Already exist' });
    }

    const hached = sha1(password);
    const newUser = await dbClient.db.collection('users').insertOne({ email, password: hached });

    const nUserId = newUser.insertedId;

    return res.status(201).json({
      id: nUserId,
      email,
    });
  }
}
