const express =require('express');
const app = express();
let port =3000;
const path = require('path');
const tempCollection = require('/Users/snehpatel/Desktop/Page1/expense.js')

const template_path  = path.join(__dirname + '/Users/snehpatel/Desktop/Page1/template/views');

require('/Users/snehpatel/Desktop/Page1/db.js');

app.set('view engine', 'hbs');
app.set('views', template_path);

app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.use(express.static(path.join(__dirname+ '/public')));

app.get('/', (req,res)=>{
    res.sendFile('/Users/snehpatel/Desktop/Page1/template/views/addExpense.html');
})

app.post('/addExpense', async (req,res)=>{
    try{
        const tempData = new tempCollection({
            expense:req.body.expense,
            category:req.body.category,
            amount:req.body.amount
        });
        const postData = await tempData.save();
        res.send("added");
    }
    catch(error){
        res.send("added");
    }
})

app.listen(port, ()=>{  
    console.log("Listening to port 3000");
});