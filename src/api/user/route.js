import express from 'express';
import { body } from 'express-validator/check';

import User from './model';

import { signup, login, userList, confirmEmail } from './controller';
import { tokenValidation } from '../../services/is-auth'

const router = express.Router();

router.put('/signup', [
    body('email').isEmail().withMessage('Please enter a valid email.')
        .custom((value, { req }) => {
            return User.findOne({ email: value }).then(userDoc => {
                if (userDoc) {
                    return Promise.reject('E-mail address already exists!');
                }
            });
        })
        .normalizeEmail(),
    body('password').trim().isLength({ min: 5 }),
    body('fullName').trim().not().isEmpty()
],
    signup);

router.post('/login', login);

router.get('/confirmation/:token', confirmEmail);

router.get('/list', tokenValidation, userList);



export default router;