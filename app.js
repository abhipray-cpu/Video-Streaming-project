//sub divide the images folder into products,stars and actual image
const express = require('express')
const multer = require('multer')
const path = require('path')
const bodyParser = require('body-parser')
const app = express();
require('dotenv').config()
const csrf = require('csurf')
const fileStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'images'); //null is bascally the error and images is the name of teh folder where we want to store the files
        },
        filename: (req, file, cb) => {
            //this replace is requried only for windows since windows storage path does not allow :
            cb(null, Math.round(Math.floor(new Date() / 1000)) + '-' + file.originalname) //file name is the hex encooding and original name is the original name of the file
        }
    })
    //this will filter only the requried files and will discard all other types of files

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    } //will return the call back with a true value
    else {
        cb(null, false); //else will return false
    }
}
const MONGO_URI = process.env.MONGO_URI;
const mongoose = require('mongoose')
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'))
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')))
const flash = require('connect-flash')
app.set('view engine', 'ejs');
app.set('views', 'views');
const session = require('express-session')
const mongoSession = require('connect-mongodb-session')(session)
const Store = new mongoSession({
    uri: MONGO_URI,
    collection: 'session'
})
app.use(session({
    secret: process.env.SESSION_SECRET, //this secret should be a strong and lengthy string
    resave: false,
    saveUninitialized: false,
    store: Store,

}))
const csrfProtection = csrf()
app.use(csrfProtection)
app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken(); //this will make the csrf token avaialble globally inside the app
    next();
})
app.use(flash())
const router_shop = require('./routes/route');
const router_star = require('./routes/star');
app.use(router_shop);
app.use(router_star);
app.use((req, res, next) => {
    res.status(404).render('404', { pageTitle: 'Page Not Found' });
    //first we set the status to 404 and than we render 404 page
});
app.use((error, req, res, next) => {
    console.log(error);
    res.render('500.ejs')
})
const only_fan = require('./models/only_fans')
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(user => {
        console.log("Connected successfully!!");
        app.listen(4000);
    })
    .catch(err => { console.log(err) })