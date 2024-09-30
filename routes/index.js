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

router.post('/users', UsersController.postNew);

module.exports = router;
