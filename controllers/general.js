const crypto = require('crypto')
const mongoose = require('mongoose');
const Star = require('../models/star')
const Production = require('../models/production')
const Product = require('../models/product')
const Cart = require('../models/cart');
const Image = require('../models/images')
const User = require('../models/user')
const production = require('../models/production')
const bcrypt = require('bcryptjs')
const nodemailer = require('nodeMailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')
const { validationResult } = require('express-validator')
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'abhipraydumka33@gmail.com',
        pass: 'kamalanita1@'
    },
    tls: {
        rejectUnauthorized: false
    }
})
async function updateView(starId) {
    let result = await Star.findOneAndUpdate({ name: starId }, { $inc: { view: 1 } }, {
        new: true
    });
    console.log(result);
    await result.save();
}
exports.star = async(req, res, next) => {
    updateView(req.params.name)
    Star.find({ name: req.params.name })
        .then(star => {
            if (star.length > 0) {
                star = star[0];

                let image = star.image;
                image = image.replace(`\\`, `/`);
                console.log(star.view)
                res.render('Pornstar.ejs', {
                    name: star.name,
                    description: star.description,
                    view: star.view,
                    image: image
                })
            } else {
                res.render('500.ejs')
            }
        })
        .catch(err => {
            console.log('The execution is being forwarded to the catch block')
            console.log(err);
            res.render('500.ejs')
        })
}
exports.starImage = (req, res, next) => {
    updateView(req.params.name)
    Image.find({ title: req.params.name })
        .then(images => {
            images = images[0]
            title = images.title;
            path = images.url;
            pics = images._doc.image
            res.render('starImage.ejs', {
                title: title,
                image: path,
                images: pics
            })
        })
        .catch(err => {
            console.log('The execution is being forwarded to the catch block')
            console.log(err);
            res.render('500.ejs')
        })
}
exports.addPic = (req, res, next) => {
    // need to work on this URL



}
var pagesHome = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
exports.home = async(req, res, next) => {

    const pageNumber = Number(req.query.page)
    const nextPage = pageNumber + 1
    const row = req.query.row
    if ((pageNumber - 1) % 10 == 0 && pageNumber != 1 && row == 'next') {
        console.log('this is the increment condition')
        newPage = []
        pagesHome.forEach(page => {
            newPage.push(page + 10)
        })
        pagesHome = newPage
    }
    if ((pageNumber) % 10 == 0 && pageNumber != 1 && row == 'prev') {
        console.log('this is the decrement condition')
        newPage = []
        pagesHome.forEach(page => {
            newPage.push(page - 10)
        })
        pagesHome = newPage
    }
    Star.find().sort({ view: -1 }).limit(10)
        .then(top10 => {
            Star.find()
                .sort({ view: -1 })
                .skip((pageNumber - 1) * 12)
                .count()
                .then(starCount => {
                    Star.find()
                        .sort({ view: -1 })
                        .skip((pageNumber - 1) * 12)
                        .limit(12)
                        .then(star => {
                            res.render('home.ejs', {
                                pageTitle: 'Home',
                                stars: star,
                                currPage: pageNumber,
                                hasPrevious: pageNumber,
                                hasNext: Math.ceil(starCount / 12),
                                pages: pagesHome,
                                next: nextPage,
                                topStars: top10
                            })
                        })
                        .catch(err => { console.error(err) })
                })
                .catch(err => {
                    console.log(err)
                })
        })

}

exports.form = (req, res, next) => {

    res.render('form.ejs', {
        pageTitle: 'Form ',
        error: '',
        name: '',
        image: '',
        Price: 10,
        gender: '',
        description: ''


    })

}
exports.items = (req, res, next) => {
    if (req.session.isLoggedIn === true) {
        Star.find()
            .then(stars => {

                res.render('items.ejs', {
                    pageTitle: 'Item',
                    stars: stars
                })
            })
            .catch(err => { console.log(err) })

    }
}
exports.addStar = (req, res, next) => {
    const imageUrl = req.file; //now we access the file field in the incoming request
    console.log('*********************************************************************************');
    console.log('This is the image file data we have which is a buffer basically');
    console.log(imageUrl) //don't know for sure but you need to use some other name then the one you are using for file
    console.log('*********************************************************************************');
    const Errors = validationResult(req).errors

    if (Errors.length > 0) {
        console.log(Errors)
        return res.status(422).render('form.ejs', {
            pageTitle: 'Form ',
            error: Errors[0],
            name: req.body.Name,
            image: '',
            Price: req.body.Price,
            gender: req.body.gender,
            description: req.body.description

        })
    }
    if (imageUrl) {
        req.session.image = imageUrl.path;
        Star.create({
                name: req.body.Name,
                gender: req.body.gender,
                price: req.body.Price,
                image: req.session.image,
                description: req.body.description,
                views: 0
            })
            .then(result => {

                res.redirect('/home?page=1&row=nan');
            })
            .catch(err => { console.log(err) })
    } else { //improve the UX by using the flash cards whenever free
        return res.status(422).render('items.ejs', {
            pageTitle: 'Item',
            stars: []
        })
    }







}







exports.videos = (req, res, next) => {
    if (req.session.isLoggedIn === true) {
        Production.find()
            .then(productions => {
                const result = [];
                productions.forEach(production => {
                    let item = { title: production.title, url: production.URL }
                    result.push(item);
                })

                res.render('videos.ejs', {
                    pageTitle: 'Videos',
                    video: result,

                })
            })
            .catch(err => { console.log(err) })
    }
}
exports.images = (req, res, next) => {
    if (req.session.isLoggedIn === true) {
        Image.find()
            .then(images => {
                res.render('images.ejs', {
                    pageTitle: 'Images',
                    images: images

                })
            })
            .catch(err => { console.log(err) })
    }
}
exports.add_product = (req, res, next) => {
    if (req.session.isLoggedIn === true) {
        res.render('add_product.ejs', {
            pageTitle: 'Add Product'
        })
    }
}
exports.register_product = (req, res, next) => {
    const imageUrl = req.file; //now we access the file field in the incoming request
    console.log('*********************************************************************************');
    console.log('This is the image file data we have which is a buffer basically');
    console.log(imageUrl) //don't know for sure but you need to use some other name then the one you are using for file
    console.log('*********************************************************************************');
    if (imageUrl) {
        req.session.image = imageUrl.path;
        if (req.session.isLoggedIn === true) {
            const product = new Product({
                title: req.body.Name,
                price: req.body.Price,
                imageUrl: imageUrl.path,
                tags: req.body.tags,
                description: req.body.description
            })
            product.save()
                .then(product => {

                    res.redirect('/products?page=1&row=nan')
                })
                .catch(err => { console.log(err) })
        }
    } else { //when free improve the ux using flash messages
        return res.status(422).res.render('add_product.ejs', {
            pageTitle: 'Add Product'
        })
    }
}
exports.register_production = (req, res, next) => {
    if (req.session.isLoggedIn === true) {
        const production = new Production({
            title: req.body.Name,
            URL: req.body.URL
        })
        production.save()
            .then(product => {

                res.redirect('/form');
            })
            .catch(err => { console.log(err) })
    }
}
exports.form_production = (req, res, next) => {
    if (req.session.isLoggedIn === true) {
        res.render('production.ejs', {
            pageTitle: 'Production Form '
        })
    }
}
exports.form_image = (req, res, next) => {
    if (req.session.isLoggedIn === true) {
        res.render('add_image.ejs', {
            pageTitle: 'Image form '
        })
    }
}

exports.addImage = (req, res, next) => {
        const imageUrl = req.file; //now we access the file field in the incoming request
        console.log('*********************************************************************************');
        console.log('This is the image file data we have which is a buffer basically');
        console.log(imageUrl) //don't know for sure but you need to use some other name then the one you are using for file
        console.log('*********************************************************************************');
        if (imageUrl) {
            req.session.image = imageUrl.path;
            if (req.session.isLoggedIn === true) {
                const image = new Image({
                    title: req.body.title,
                    url: req.session.image,
                    tags: req.body.tags
                })
                image.save()
                    .then(result => {
                        console.log("The compiler is reacheing till here")
                        res.redirect('/images');
                    })
                    .catch(err => console.log(err));
            }
        } else { //here too improve teh ux by using flash messages when ever free
            return res.status(422).res.render('add_image.ejs', {
                pageTitle: 'Image form '
            })
        }
    }
    // add pagination to videos only fans and videos 
exports.onlyFans = (req, res, next) => {
    if (req.session.isLoggedIn === true) {
        Star.find()
            .then(stars => {
                res.render('only_fans.ejs', {
                    pageTitle: 'only_fans',
                    stars: stars
                })
            })
            .catch(err => { console.log(err) })
    }
}
exports.live = (req, res, next) => {
    if (req.session.isLoggedIn === true) {
        res.render('live.ejs', {
            pageTitle: 'Live'
        })
    }
}
exports.messaging = (req, res, next) => {
    if (req.session.isLoggedIn === true) {
        res.render('messaging.ejs', {
            pageTitle: 'Messaging'
        })
    }
}
var pagesProducts = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
exports.products = (req, res, next) => {

    const pageNumber = Number(req.query.page)
    const nextPage = pageNumber + 1
    const row = req.query.row
    if ((pageNumber - 1) % 10 == 0 && pageNumber != 1 && row == 'next') {
        console.log('this is the increment condition')
        newPage = []
        pagesProducts.forEach(page => {
            newPage.push(page + 10)
        })
        pagesProducts = newPage
    }
    if ((pageNumber) % 10 == 0 && pageNumber != 1 && row == 'prev') {
        console.log('this is the decrement condition')
        newPage = []
        pagesProducts.forEach(page => {
            newPage.push(page - 10)
        })
        pagesProducts = newPage
    }
    Product.find()

    .skip((pageNumber - 1) * 16)
        .count()
        .then(prodCount => {
            Product.find()

            .skip((pageNumber - 1) * 16)
                .limit(16)
                .then(products => {

                    res.render('products.ejs', {
                        pageTitle: 'Products',
                        products: products,
                        currPage: pageNumber,
                        hasPrevious: pageNumber,
                        hasNext: Math.ceil(prodCount / 16),
                        pages: pagesProducts,
                        next: nextPage,
                    })
                })
                .catch(err => { console.error(err) })
        })
        .catch(err => {
            console.log(err)
        })

}
exports.signup = (req, res, next) => {
    res.render('signup.ejs', {
        pageTitle: 'Signup',
        error: '',
        name: '',
        email: '',
        age: ''
    })
}

exports.addUser = (req, res, next) => {

    const Errors = validationResult(req).errors

    if (Errors.length > 0) {

        return res.status(422).render('signup.ejs', {
            pageTitle: 'Signup',
            error: Errors[0],
            name: req.body.Name,
            email: req.body.email,
            age: req.body.age
        })
    }
    if (req.body.password === req.body.confirm) {
        bcrypt.hash(req.body.password, 13)
            .then(hashedPassword => {
                User.create({
                        user_name: req.body.Name,
                        password: hashedPassword,
                        email: req.body.email,
                        age: req.body.age,
                        premium: false,
                        onlyFans: []
                    })
                    .then(result => {

                        res.render('login.ejs', {
                            pageTitle: 'Login',
                            error1: '', //no user found
                            error2: '', //wrong password
                            user: req.body.Name
                        })
                        let mailOptions = {
                            to: req.body.email,
                            from: 'abhipraydumka33@gmail.com',
                            subject: 'Signup Confirmation',
                            html: `<h1>Hey user these are your credentials</h1>
                        <ul>
                        <li><h3>User name: ${req.body.name}</h3></li>
                        <li><h3>Email : ${req.body.email}</h3></li>
                        <li><h3>Password: ${req.body.password}</h3></li>
                        
                        </ul>`


                        }
                        return transporter.sendMail(mailOptions)
                            .then(result => {
                                console.log(result)
                            })
                            .catch(err => console.log(err))
                    })
                    .catch(err => { console.log(err) })
            })
    }

}

exports.login = (req, res, next) => {
    if (req.session.isLoggedIn === true) {
        res.redirect('/home?page=1&row=nan')
    } else {
        res.render('login.ejs', {
            pageTitle: 'Login',
            error1: req.flash('userError'), //no user found
            error2: req.flash('wrongPassword'), //wrong password
            user: ''
        })
    }
}

exports.validate_login = (req, res, next) => {
    return User.find({
            user_name: req.body.Name,

        })
        .then(user => {
            if (user.length > 0) {
                return bcrypt.compare(req.body.password, user[0].password)
                    .then(matched => {
                        if (matched === true) {
                            req.session.isLoggedIn = true;
                            req.session.userId = user[0]._id;
                            res.redirect('/home?page=1&row=nan');
                        } else {
                            req.flash('wrongPassword', 'Wrong password!!')
                            res.render('login.ejs', {
                                pageTitle: 'Login',
                                error1: req.flash('userError'), //no user found
                                error2: req.flash('wrongPassword'), //wrong password
                                user: req.body.Name
                            })
                        }
                    })

            } else {
                req.flash('userError', 'No user found!!')
                res.render('login.ejs', {
                    pageTitle: 'Login',
                    error1: req.flash('userError'), //no user found
                    error2: req.flash('wrongPassword'), //wrong password
                    user: ''
                })
            }
        })
        .catch(err => { console.log(err) })
}

exports.logout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    });
}

exports.ChangingPassword = (req, res, next) => {
    //attaching the current user to the req
    res.render('passwordChange1.ejs', {
        user: req.session.userId,
        message: '',
        error: req.flash('passwordChange')
    })

}

exports.changePassword = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
            return res.status(422).res.render('passwordChange1.ejs', {
                user: req.session.userId,
                message: '',
                error: 'Something went wrong on our side'
            })
        }
        req.session.token = buffer.toString('hex');
    })
    error =
        User.findById(req.session.userId)
        .then(user => {
            if (user) {
                return user
            } else {
                req.flash('passwordChange', 'No such user was found');
                res.render('passwordChange1.ejs', {
                    user: req.session.userId,
                    message: '',
                    error: req.flash('passwordChange')
                })
            }
        })
        .then(user => {
            req.session.email = user.email;
            user.resetToken = req.session.token;
            user.resetTokenExpiration = Date.now() + 60000;
            return user.save();
        })
        .then(user => {
            bcrypt.compare(req.body.password, user.password)
                .then(matched => {
                    if (matched === true) {
                        let mailOptions = {
                                to: req.session.email,
                                from: 'abhipraydumka33@gmail.com',
                                subject: "Password Change",
                                text: "Use the link to change the password if not sent by you \n Then sorry my friend you are fucked",
                                html: `<h1>Use this link to change the password</h1>
                                <a href='http://localhost:4000/ConfirmChange/${req.session.userId}/${req.session.token}'>Change password</a>`
                            }
                            //since this sending of email might take some time therefore processing it asynchronously
                        return transporter.sendMail(mailOptions)
                            .then(result => {
                                console.log('mail sent successfully');
                                //render the same page with a message
                                res.render('passwordChange1.ejs', {
                                    user: req.session.userId,
                                    message: 'A mail has been sent to your email id with password reset link',
                                    error: ''
                                })
                            })
                            .catch(err => {
                                console.log('sending mail failed');
                                console.log(err);
                                res.render('passwordChange1.ejs', {
                                    user: req.session.userId,
                                    message: 'Sending mail failed please try again',
                                    error: ''
                                })
                            })

                    } else {
                        req.flash('passwordChange', 'Wrong Password');
                        res.render('passwordChange1.ejs', {
                            user: req.session.userId,
                            message: '',
                            error: req.flash('passwordChange')
                        })
                    }
                })
        })
        .catch(err => { console.log(err) })
}

exports.confirmPasswordChange = (req, res, next) => {
    User.findById(req.params.userId)
        //if you want to include a time restraint you can do like this
        //User.find({resetToken:token,resetTokenExpiration:{$gt:Date.now()}})
        .then(user => {
            console.log(user)
            console.log(user.resetToken)

            if (user.resetToken == req.params.token) {
                let currDate = new Date();
                if (user.resetTokenExpiration.getTime() <= currDate.getTime()) {
                    res.render('passwordChange2.ejs', {
                        userId: user._id,
                        error: ''
                    })
                } else {
                    res.render('passwordChange1.ejs', {
                        user: req.session.userId,
                        message: '',
                        error: req.flash('Timeout error')
                    })
                }
            }
        })
        .catch(err => {
            console.log(err);
        })
}

exports.confirmChange = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('passwordChange2.ejs', {
            userId: req.body.userId,
            error: errors.errors[0].msg

        })
    } else {
        User.findById(req.body.userId)
            .then(user => {
                bcrypt.compare(req.body.password, user.password)
                    .then(matched => {
                        if (matched === true) {
                            return res.status(422).render('passwordChange2.ejs', {
                                userId: req.body.userId,
                                error: 'This is same as your old password'

                            })
                        } else {
                            return bcrypt.hash(req.body.password, 13)
                                .then(password => {
                                    req.session.currPassword = password;
                                    User.findById(req.body.userId)
                                        .then(user => {
                                            user.password = req.session.currPassword;
                                            req.session.currPassword = ''
                                            return user.save();
                                        })
                                        .then(result => {
                                            console.log(result);
                                            console.log('The password was changed successfully!!');
                                            res.render('login.ejs', {
                                                pageTitle: 'Login',
                                                error1: '', //no user found
                                                error2: '', //wrong password
                                                user: ''
                                            })

                                        })
                                        .catch(err => {
                                            console.log(err);
                                            return res.status(422).render('passwordChange2.ejs', {
                                                userId: req.body.userId,
                                                error: 'Faield to update password'

                                            })
                                        })
                                })
                        }
                    })
            })
            .catch(err => {
                console.log(err);
                return res.status(422).render('passwordChange2.ejs', {
                    userId: req.body.userId,
                    error: 'Try again'

                })
            })
    }
}

exports.homeSearch = async(req, res, next) => {
    var val = req.body.value;
    try {
        const result = await Star.find({ name: val })
        if (result.length > 0) {
            res.redirect(`/star/${result[0].name}`);
        } else {
            let words = val.split(' ')

            if (words.includes('video') || words.includes('Video') || words.includes('videos') || words.includes('Videos')) {
                let name = words[0] + ' ' + words[1];
                console.log(name)
                try {
                    const result = await Star.find({ name: name })
                    if (result.length > 0) {
                        res.redirect(`/star/${result[0].name}`);
                    } else
                        res.redirect('/videos')
                } catch {
                    res.redirect('/videos')
                }

            } else if (words.includes('image') || words.includes('Image') || words.includes('images') || words.includes('Images')) {
                let name = words[0] + ' ' + words[1];
                try {
                    const result = await Star.find({ name: name })
                    if (result.length > 0) {
                        res.redirect(`/images/${result[0].name}`);
                    } else
                        res.redirect('/images')
                } catch {
                    res.redirect('/images')
                }
            } else {
                console.log('based in keywords serve the video')
            }
        }
    } catch (err) {
        console.log(err)
        res.render('500.ejs')
    }

}

exports.productsSearch = async(req, res, next) => {
    var val = req.body.value;
    try {
        const result = await Product.find({ title: val })
        if (result.length > 0) {
            res.render('./products2.ejs', {
                products: result,
                pageTitle: 'Products',
            })
        } else {
            //search for categories here
            //condoms,vibrators,dildos,penis,sex,doll,simulator,thin,ripped,Durex,Trojan,large
            //need to write a regex query here for string matching do this for revision
        }
    } catch {
        res.redirect('/products')
    }

}

exports.addCart = async(req, res, next) => {
    let prodId = req.params.prodId;
    prodId = mongoose.Types.ObjectId(prodId);
    try {
        const product = await Product.findById(prodId);
        let Uid = req.session.userId;
        Uid = mongoose.Types.ObjectId(Uid);
        try {
            const cart = await Cart.find({ user: Uid })
            if (cart.length > 0) {
                let products = cart[0].products;
                let newProds = [...products];
                products.forEach(prod => {

                    //note compare the string and not the actual mongoose objects
                    if (prod.product.toString() === prodId.toString()) {
                        // console.log(prod.product)
                        // console.log(prodId)
                        // console.log('This is an existing product')
                        let quantity = prod.quantity + 1;
                        let updatedProduct = ({ _id: prod._id, product: prod.product, quantity: quantity })
                        newProds[newProds.indexOf(prod)] = updatedProduct;
                    } else {
                        newProds.push({
                            product: prodId,
                            quantity: 1
                        })
                    }
                })
                try {
                    await Cart.findOneAndUpdate({ user: Uid }, { $set: { products: newProds } }, ).exec();
                } catch (err) {
                    console.log(err);
                    res.render('500.ejs')
                }
                //console.log(products)
            } else {
                let cart = new Cart({
                    user: Uid,
                    products: [{ product: product, quantity: 1 }]
                })
                try {
                    cart.save();
                    console.log('cart created and updated sucsesfully')
                } catch (err) {
                    console.log(err)
                }
            }
        } catch (err) {
            console.log('redirect to the cart')
        }
    } catch (err) {
        console.log(err)
    }
}