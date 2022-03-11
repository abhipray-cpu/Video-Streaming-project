const path = require('path');
const { check, body } = require('express-validator')
const express = require('express');
const isAuth = require('./isAuth')
const user = require('../models/user');
const general = require('../controllers/general')
const router = express.Router();
const star = require('../models/star')

router.get('/star/:name', general.star)
router.get('/images/:name', general.starImage)
router.get('/addPic', general.addPic)
router.get('/', general.login)
router.get('/home', isAuth, general.home)
router.get('/form', isAuth, general.form)
router.get('/items', isAuth, general.items)

router.post('/add-star', [
    body('Name').custom((value, { req }) => {
        return star.find({ name: value }).
        then(star => {
            if (star.length > 0) {
                return Promise.reject('This star has already been added to our list')
            }
        })
    }),

    body('gender').custom((value, { req }) => {
        if (value === 'male' || value === 'female') {
            return true

        } else

        {
            throw new Error('The gender field can either be male or female')
        }
    }), body('description').isLength({ min: 120 })
    .withMessage('Please add a detailed description')
], isAuth, general.addStar);
router.get('/videos', isAuth, general.videos)
router.get('/images', isAuth, general.images)
router.get('/onlyFans', isAuth, general.onlyFans)
router.get('/live', isAuth, general.live)
router.get('/messaging', isAuth, general.messaging)
router.get('/products', isAuth, general.products)


router.get('/form_production', isAuth, general.form_production)
router.post('/add-production', isAuth, general.register_production)
router.get('/add-product', isAuth, general.add_product);
router.post('/register-product', isAuth, general.register_product)
router.get('/addImage', isAuth, general.form_image);
router.post('/add-image', isAuth, general.addImage);

router.get('/signup', general.signup);
router.post('/register-user', [
    body("email").isEmail().withMessage('Please entere a valid email')
    .custom((value, { req }) => {
        return user.find({ email: value })
            .then(user => {
                if (user.lenght > 0) {
                    return Promise.reject('This email id already exists')
                }
            })
    }).normalizeEmail(),
    body('password').isLength({ min: 10 })
    .custom((value, { req }) => {
        if (value !== req.body.confirm) {
            throw new Error('The passwords you entered does not match')
        } else
            return true;
    }), body('age').custom((value, { req }) => {
        if (value < 18) {
            throw new Error('You are underage for this type of content')
        } else
            return true; //be sure to return true in the else case or else invalid value error will be thrown
    })
], general.addUser)
router.get('/login', general.login);
router.post('/validate_login', general.validate_login);
router.get('/logout', general.logout)

router.get('/change_password', isAuth, general.ChangingPassword)
router.post('/changePassword', isAuth, general.changePassword)
router.get('/ConfirmChange/:userId/:token', general.confirmPasswordChange)

router.post('/confirmChange', [
        check('password', 'Please enter a valid password which is atleast 10 characters long') //the second key is the default message we want for all the validators check
        .isLength({ min: 10 })
        .trim() //this is a sanitization method for password
        ,
        check('password')
        .custom((value, { req }) => {
            if (value != req.body.Confirm) {
                throw new Error('The passwords you entered do not match');
            } else {
                return true;
            }
        })
    ],
    general.confirmChange)
router.post('/homeSearch', isAuth, general.homeSearch);
router.post('/productsSearch', isAuth, general.productsSearch);
router.get('/addCart/:prodId', isAuth, general.addCart);
module.exports = router;