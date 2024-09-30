import express from 'express';
import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';

const router = express.Router();

router.get('/status', (req, res) => {
  res.status(200).send(AppController.getStatus);
});

router.get('/stats', async (req, res) => {
  res.status(200).send(await AppController.getStats());
});

router.post('/users', async (req, res) => {
  const user = await UsersController.postNew(req);
  if ('error' in user) {
    res.status(400).send(user);
  } else {
    res.status(201).send(user);
  }
});

module.exports = router;
