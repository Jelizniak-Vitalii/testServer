const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require ('mongoose');
const jwt = require('jsonwebtoken');
const JWT_Secret = 'your_secret_key';

let Schema = mongoose.Schema;

const db = 'mongodb://localhost:27017/test';

mongoose.connect(db, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,  
})

const dataSchema = new Schema({
    email: '',
    password: ''
})

const User = mongoose.model('User', dataSchema);

const app = express();

app.use(cors())
app.use(bodyParser.json())

app.post('/user/get', (req, res) => {
    const data =  req.body;
    User.find(function (err, user) { 
        const users = user.find(x=> x.email === data.email && x.password === data.password);
        if(!users){
           return res.send(false)
        } else{
            let token = jwt.sign(data, JWT_Secret);
            res.send({
                // status: true,
                // email: users.email,
                // password: users.password,
                token: token
            })
        }
    })
})

app.post('/user/post', (req, res) => {
    const data =  req.body;
    const newUser = new User(data);
    newUser.save(function(err){
        if(err) {
            console.log(err);
        }
    })
    res.send({
        ok: 'ok', 
    })
})

app.listen(3000, (req, res) => {
    console.log('Сервер запущен');
})


