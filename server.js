const express = require('express');
const mongoose = require('mongoose');
const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');
const passport = require('passport')
// DB Config
const db= require('./config/keys').mongoURI;

const app = express();

//Body Parser middleware
app.use(express.json());  
app.use(express.urlencoded({extended: true}));




// Connect to Database
mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if (err)
       console.error(err);
    else
       console.log("Connected to the MongoDB"); 
  });



//Passport MiddleWare
app.use(passport.initialize());
//Passport Config
require('./config/passport')(passport);

app.use('/api/users',users);
app.use('/api/profile',profile);
app.use('/api/posts',posts);

const port = process.env.PORT || 5000;

app.listen(port, ()=> console.log(`server running on port ${port}`));