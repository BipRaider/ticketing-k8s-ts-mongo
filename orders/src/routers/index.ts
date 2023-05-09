import express, { Router } from 'express';
import { body, param } from 'express-validator';
import { Types } from 'mongoose';
import { authUserRequire } from '@bipdev/common';

import { validation } from '@src/middlewares';

import { createOrder } from './create';
import { deleteOrderById } from './delete';
import { getById } from './getById';
import { getAll } from './getAll';

const router: Router = express.Router();

const validateTicket = [
  body('ticketId')
    .not()
    .isEmpty()
    .custom((input: string): boolean => Types.ObjectId.isValid(input))
    .withMessage('Ticket id  must be provided'),
];

const validateParamsId = [param('id').notEmpty().withMessage('id must be')];

router.get('/', authUserRequire, getAll);
router.get('/:id', authUserRequire, validateParamsId, validation, getById);
router.post('/', authUserRequire, validateTicket, validation, createOrder);
router.delete('/:id', authUserRequire, validateParamsId, validation, deleteOrderById);

export default router;
