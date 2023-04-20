import express, { Router } from 'express';
import { body, param } from 'express-validator';
import { authUserRequire } from '@bipdev/common';

import { validation } from '@src/middlewares';

import { Create } from './create';
import { Update } from './update';
import { getById } from './getById';
import { getAll } from './getAll';

const router: Router = express.Router();

const validateTicket = [
  body('title').isLength({ min: 4, max: 20 }).withMessage('Title must be valid'),
  body('price').notEmpty().trim().isInt({ min: 0, max: 1000 }).withMessage('price must be between 0 and 10 symbols.'),
];

const validateParamsId = [param('id').notEmpty().withMessage('id must be')];

router.get('/', authUserRequire, getAll);
router.get('/:id', authUserRequire, validateParamsId, validation, getById);
router.post('/', authUserRequire, validateTicket, validation, Create);
router.put('/:id', authUserRequire, validateParamsId, validateTicket, validation, Update);

export default router;
