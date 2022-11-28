import express from 'express';

import { signin, signup } from '../controllers/users.js'

const router = express.Router();

router.post('/signin', signin) //post collects the login data from the frontend and send it to the server
router.post('/signup', signup)

export default router;
