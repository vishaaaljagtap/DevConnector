const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Creating Schema 
const UserSchema = new Schema({
    name:{
        type:String,
        
        
    },
    email:{
        type:String,
        
        
    },
    password:{
        type:String,
        
        
    },
    avatar:{
        type:String,
        
    },
    date:{
        type:Date,
        default:Date.now
    }   

});
User = mongoose.model('users',UserSchema);
module.exports = User