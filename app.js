const express = require('express');
const bcrypt = require('bcrypt');
const saltRound = 10;
const bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

require('./db');
const User = require('./model');
const Expense = require('./expense_model');
const userExpense = require('./User_Expense_model');

// constant for the alert boxes in login and signup errors
var signUp = {
    exist: false,
    match: false
};

var logIn = {
    userExist: false,
    matchCredential: false
};

// get home page
app.get('/', function (req, res) {
    res.render('home');
});

// getting signup page
app.get('/signup', function (req, res) {
    let ex = signUp.exist, ma = signUp.match, exC = logIn.userExist, maC = logIn.matchCredential;
    signUp.match = false;
    logIn.userExist = false;
    res.render('signup', { exist: ex, match: ma, existC: exC, matchC: maC });
});

// posting signup data to database
app.post('/signup', function (req, res) {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const cpassword = req.body.cpassword;

    // checking whether current password and the login password matches or not
    if (password === cpassword) {
        // hashing the password using the bcrypt module
        bcrypt.hash(password, saltRound, async function (err, hash) {
            const newUser = new User({
                name: name,
                email: email,
                password: hash
            });
            // finding whether user exist or not
            const data = await User.findOne({ email: email });
            // if doesnot exist
            if (!data) {
                newUser.save();
                res.redirect('/page1/' + req.body.name);
            } else {
                // if exist
                signUp.exist = true;
                res.redirect('/login');
            }
        })
    } else {
        // if confirm password and the password doesnot matches redirecting user once again to signup page
        signUp.match = true;
        res.redirect('/signup');
    }
})

// getting login page
app.get('/login', function (req, res) {
    let ex = signUp.exist, ma = signUp.match, exC = logIn.userExist, maC = logIn.matchCredential;
    logIn.matchCredential = false;
    signUp.exist = false;
    res.render('login', { exist: ex, match: ma, existC: exC, matchC: maC });
});

// posting login logic
app.post('/login', async function (req, res) {
    // finding data
    const data = await User.findOne({ email: req.body.email });
    if (!data) {
        // if not exist then redirecting it to signup page for registration
        logIn.userExist = true;
        res.redirect('/signup');
    } else {
        // else comparing the bcrypt hash code and the password enterred using bcrypt library
        bcrypt.compare(req.body.password, data.password, function (err, result) {
            if (result === true) {
                // if matched then redirecting it to page1 page with name route parameter
                res.redirect('/page1/' + data.name);
            } else {
                // if doesnot match then redirecting it to login parameter
                logIn.matchCredential = true;
                res.redirect('/login');
            }
        })
    }
});

// if user trying to access without authentication redirecting them to login route
app.get('/page1', function (req, res) {
    res.redirect('/login');
});

// getting page1
app.get('/page1/:name', async function (req, res) {
    // checking if the user with given route name para exists 
    const data = await User.findOne({ name: req.params.name });
    if (data) {
        // if user exist then rendering page1 
        res.render('page1', { name: req.params.name });
    } else {
        // if user doesnot exist then redirecting them to login
        res.redirect('/signup');
    }
});

// redirecting to the addExpense box;
app.get('/addExpense/:name', async function (req, res) {
    // checking if user with given name exist or not
    const users = await User.findOne({name: req.params.name});
    if(!users){
        // if user doesnot exist redirecting it to signup page
        res.redirect('/signup');
    } else {
        // else rendering the add expense page
        const alertBox = alertDialogBox;
        alertDialogBox = 0;
        res.render('addExpense', { alt: alertBox, name: req.params.name });
    }
});

let alertDialogBox = 0
app.post('/addExpense/:name', async function (req, res) {
    // creating a object of Expense type
    const expense = req.body.expense;
    const category = req.body.category;
    const amount = req.body.amount;
    const newExpenses = new Expense({
        expense: expense,
        category: category,
        amount: amount
    });
    // checking whether our User Expense database contain any data of ogiven name
    const data = await userExpense.findOne({ name: req.params.name });
    if (!data) {
        // if not then creating a new model with name equal to parameter name and expense as an arrayn containing current obj Expense
        const newExpense = new userExpense({
            name: req.params.name,
            expense: [newExpenses]
        });
        newExpense.save();
    } else {
        // else pushing the new Expense model object into the array of expense
        data.expense.push(newExpenses);
        data.save();
    }
    alertDialogBox = 1;
    res.redirect('/addExpense/' + req.params.name);

});

app.get('/viewExpense/:name', async function (req, res) {
    // checking whether user exist or not
    let users = await User.findOne({ name: req.params.name });
    if (!users) {
        // if not redirecting it to signup
        res.redirect('/signup');
    } else {
        //checking for the records
        let records = await userExpense.findOne({ name: req.params.name });
        if (records) {
            // if records exist showing it
            res.render('viewExpense', { found: true, record: records.expense, name: req.params.name });
        } else {
            // else showing No record found!!
            res.render('viewExpense', { found: false, record: [], name: req.params.name });
        }
    }
});

app.listen(3000, function () {
    console.log('http://localhost:3000/');
});