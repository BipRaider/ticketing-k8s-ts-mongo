import express, { Router } from 'express';
import { param, body } from 'express-validator';
import { Types } from 'mongoose';

import { authUserRequire } from '@bipdev/common';

import { validation } from '@src/middlewares';

import { getById } from './getById';
import { createCharge } from './create';

const router: Router = express.Router();

const validateParamsId = [param('id').notEmpty().withMessage('id must be')];
const validateOrder = [
  body('token').not().isEmpty().withMessage('Token must be provided'),
  body('orderId')
    .not()
    .isEmpty()
    .custom((input: string): boolean => Types.ObjectId.isValid(input))
    .withMessage('Order id must be provided'),
];

router.get('/:id', authUserRequire, validateParamsId, validation, getById);
router.post('/', authUserRequire, validateOrder, validation, createCharge);

export default router;
