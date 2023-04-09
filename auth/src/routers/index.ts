import express, { Router } from 'express';
import { body } from 'express-validator';
import { CurrentUser } from './currentuser';
import { SignUp } from './signup';
import { SignOut } from './signout';
import { SignIn } from './signin';
import { validation } from '../middlewares';

const router: Router = express.Router();

const validateUser = [
  body('email').isEmail().withMessage('Email must be valid'),
  body('password')
    .notEmpty()
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('Password must be between 4 and 20 symbols.'),
];

router.get('/currentuser', CurrentUser);
router.post('/signup', validateUser, validation, SignUp);
router.post('/signin', validateUser, validation, SignIn);

router.post('/signout', SignOut);

export default router;
