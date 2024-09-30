import crypto from 'crypto';
import dbClient from '../utils/db';

const postNew = async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({error: 'Missing email'});
  }
  if (!password) {
    return res.status(400).json({error: 'Missing password'});
  }
  const user = await dbClient.users.findOne({ email });
  if (user) {
    return res.status(400).json({error: 'Already exist'});
  }
  const hached = crypto.createHash('sha1').update(password).digest('hex');
  const newUser = await dbClient.users.insertOne({ email, password: hached });
  return res.status(201).json({
    id: newUser.insertedId,
    email,
  });
};

module.exports = { postNew };
