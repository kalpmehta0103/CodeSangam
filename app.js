const express =require('express');
const cookieParser=require('cookie-parser');
const session = require('express-session');
const ejs= require('ejs');
const bodyParser= require('body-parser');

const app = express();
let port =3000;
const path = require('path');
const tempCollection = require('/Users/snehpatel/Desktop/Page1/model.js');
const expenseCollection = require('/Users/snehpatel/Desktop/Page1/expense.js');
const { Script } = require('vm');


const template_path = path.join(__dirname + '/Users/snehpatel/Desktop/Page1/template/views');

require('./db');
app.set('view engine', 'hbs');
app.set('views', template_path);
app.set('view engine', 'ejs');



app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser('secret'))
app.use(session({cookie:{maxAge:null}}));

app.use(express.static(path.join(__dirname+ '/public')));

app.use((req,res,next)=>{
    res.locals.message = req.session.message
    delete req.session.messages
    next();
});
app.get('/', (req,res)=>{
    res.sendFile('/Users/snehpatel/Desktop/Page1/template/views/home.html');
})

app.post('/empdata', async (req,res)=>{
    try{
        const password = req.body.password;
        const cpassword = req.body.cpassword;

        if(password===cpassword){
            const tempData  = new tempCollection({
                name:req.body.name,
                email:req.body.email,
                password:req.body.password,
                cpassword:req.body.cpassword
            });
            const postData = await tempData.save();
            res.sendFile("/Users/snehpatel/Desktop/Page1/template/views/login.html")
        }
        else{
            res.send('Passwords are not matching');
        }

    }catch(error){
        res.send(error);
    }
})

app.get('/login', (req,res)=>{
    res.sendFile('/Users/snehpatel/Desktop/Page1/template/views/login.html')
});

app.post('/loginPage', async (req,res)=>{
    const email = req.body.email;
    const password = req.body.loginpassword;

    const getEmail= await tempCollection.findOne({email: email});
    if(getEmail.password  === password){
        res.sendFile('/Users/snehpatel/Desktop/Page1/template/views/page1.html')
    }
    else{
        res.send("Login Information Incorrect!!");
    }
});

app.post('/addExpense', async (req,res)=>{
    try{
        const tempData = new expenseCollection({
            expense:req.body.expense,
            category:req.body.category, 
            amount:req.body.amount
        });
        const postData = await tempData.save();
        res.render('/Users/snehpatel/Desktop/Page1/template/views/viewExpense.ejs');
    }
    catch(error){
        res.send(error);
    }``
    
});

// app.get('/view', (req,res)=>{

// })
app.listen(port, ()=>{  
    console.log("Listening to port 3000");
});