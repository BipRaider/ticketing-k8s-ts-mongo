import express, { Router } from 'express';
import { param } from 'express-validator';

import { authUserRequire } from '@bipdev/common';

import { validation } from '@src/middlewares';

import { getById } from './getById';

const router: Router = express.Router();

const validateParamsId = [param('id').notEmpty().withMessage('id must be')];

router.get('/:id', authUserRequire, validateParamsId, validation, getById);

export default router;
