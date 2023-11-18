const mongoose = require('mongoose');

const tempSchema = new mongoose.Schema({
    expense:{
        type:String,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    category:{
        type:String,
        required:true
    }
});



const Expense = new mongoose.model('Expense', tempSchema);
module.exports = Expense;