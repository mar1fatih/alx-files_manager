import crypto from 'crypto';
import dbClient from '../utils/db';

const postNew = async (req) => {
  const { email, password } = req.body;
  if (!email) {
    return {
      error: 'Missing email',
    };
  }
  if (!password) {
    return {
      error: 'Missing password',
    };
  }
  const user = await dbClient.users.findOne({ email });
  if (user) {
    return {
      error: 'Already exist',
    };
  }
  const hached = crypto.createHash('sha1').update(password).digest('hex');
  const newUser = await dbClient.users.insertOne({ email, password: hached });
  return {
    id: newUser.insertedId,
    email,
  };
};

module.exports = { postNew };
