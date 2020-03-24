import { validationResult } from 'express-validator/check';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import _ from 'lodash';
import User from './model';
import { mail } from '../../services/nodemailer';

export const signup = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const email = req.body.email;
    const fullName = req.body.fullName;
    const password = req.body.password;
    const phone = req.body.phone ? req.body.phone : '';
    const address = req.body.address ? req.body.address : ''
    bcrypt.hash(password, 12)
        .then(hashedPw => {
            const user = new User({
                email: email,
                password: hashedPw,
                fullName: fullName,
                phone: phone,
                address: address
            });
            return user.save();
        })
        .then(result => {
            const emailToken = jwt.sign(
                {
                    user: _.pick(result, 'id')
                },
                'EMAIL_SECRET',
                {
                    expiresIn: '1h',
                },
            );
            const url = `http://localhost:3000/user/confirmation/${emailToken}`;
            mail(result.email, url)
            res.status(201).json({ message: 'User created!' });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

export const confirmEmail = (req, res, next) => {
    console.log(req.params.token);
    const { user: { id } } = jwt.verify(req.params.token, 'EMAIL_SECRET');
    console.log(id)
    User.findOne({ _id: id })
        .then(user => {
            user.isVerified = true;
            return user.save()
        })
        .then(user => {
            res.status(200).json({ message: 'User verified successfully.' })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

export const login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;
    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                const error = new Error('A user with this email could not be found.');
                error.statusCode = 401;
                throw error;
            }
            if (user.isVerified === false) {
                const error = new Error('Please confirm you email to login.');
                error.statusCode = 401;
                throw error;
            }
            loadedUser = user;
            return bcrypt.compare(password, user.password)
        })
        .then(isEqual => {
            if (!isEqual) {
                const error = new Error('Wrong password!');
                error.statusCode = 401;
                throw error;
            }
            const token = jwt.sign({
                email: loadedUser.email,
                userId: loadedUser._id.toString()
            }, 'somesupersecretsecret',
                { expiresIn: '1h' }
            );
            res.status(200).json({
                token: token
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

export const userList = (req, res, next) => {
    User.find()
        .then(users => {
            res.status(200).json({
                users: users.map(user => {
                    return ({
                        fullName: user.fullName,
                        email: user.email,
                        phone: user.phone,
                        address: user.address
                    })
                })
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}