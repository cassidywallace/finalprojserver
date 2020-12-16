const express = require('express');
const mysql = require('mysql');
const port = process.env.port || 3001;
const app = express();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bearerToken = require('express-bearer-token');
const bcrypt = require('bcryptjs');
const nJwt = require('njwt');
const cors = require('cors');
const exjwt = require('express-jwt');
const jwt_decode = require ("jwt-decode");


app.use(cors())

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bearerToken());

const secretKey = 'mysecret';

const jwtMW = exjwt({
    secret: secretKey,
    algorithms: ['HS256']
});




var connection = mysql.createConnection({
    host        : 'sql9.freemysqlhosting.net',
    user        : 'sql9378378',
    password    : 'SfNKvkctvY',
    database    : 'sql9378378'
});


// userID = 0
// const authenticateJWT = (req, res, next) => {
//     const authHeader = req.headers.authorization;

//     if (authHeader) {
//         const token = authHeader.split(' ')[1];

//         jwt.verify(token, secretKey, (err, user) => {
//             if (err) {
//                 return res.sendStatus(403);
//             }

//             req.user = user;
//             userID = user
//             user

//             next();
//         });
//     } else {
//         res.sendStatus(401);
//     }
// };

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1');
    res.setHeader('Access-Control-Allow-Headers', 'Content-type,Authorization');
    
    next();
});






app.get('/budget', async (req, res) => {
    // const authHeader = req.headers.authorization;
    //console.log(req.headers)
    // console.log(authHeader)
    const authHeader = req.headers.authorization;
    if (authHeader){
        let token = authHeader.split(' ')[1];
        token = token.replace('"', "")
        token = token.replace('"', "")
        console.log("budget", token)
        let user = jwt_decode(token)
        let userid = user.userid
        console.log(userid);
        jwt.verify(token, secretKey, (err, data)=>{
            if (err)
                res.send(err)
            //res.send(data)
        }); 
        connection.query('SELECT * FROM budget WHERE userid = ?', [userid], function (error, results, fields){
        
            if(error) throw error;
            res.json(results);
            
        })
    } else {
        res.sendStatus(403).send("Forbidden")
    }
   
})

app.post('/budget', async (req, res) => {
    const authHeader = req.headers.authorization;
    
    if (authHeader){
        let token = authHeader.split(' ')[1];
        token = token.replace('"', "")
        token = token.replace('"', "")
        //console.log("budget", token)
        let user = jwt_decode(token)
        let userid = user.userid
        //console.log(userid);
        jwt.verify(token, secretKey, (err, data)=>{
            if (err)
                res.send(err)
        }); 
        connection.query('INSERT INTO budget (title, budget, userid) VALUES (?,?,?)', [req.body.title, req.body.budget, userid], function (error, results, fields){
            console.log(results);
            if(error) throw error;
            res.json(results);
            
        })
    } else {
        res.sendStatus(403).send("Forbidden")
    }

})

app.get('/expenses', async (req, res) => {
    
    const authHeader = req.headers.authorization;
    if (authHeader){
        let token = authHeader.split(' ')[1];
        token = token.replace('"', "")
        token = token.replace('"', "")
        console.log("budget", token)
        let user = jwt_decode(token)
        let userid = user.userid
        console.log(userid);
        jwt.verify(token, secretKey, (err, data)=>{
            if (err)
                res.send(err)
            //res.send(data)
        }); 
        connection.query('SELECT * FROM expenses WHERE userid = ?', [userid], function (error, results, fields){
        
            if(error) throw error;
            res.json(results);
            
        })
    } else {
        res.sendStatus(403).send("Forbidden")
    }
   
})

app.post('/expenses', async (req, res) => {
    const authHeader = req.headers.authorization;
    
    if (authHeader){
        let token = authHeader.split(' ')[1];
        token = token.replace('"', "")
        token = token.replace('"', "")
        //console.log("budget", token)
        let user = jwt_decode(token)
        let userid = user.userid
        //console.log(userid);
        jwt.verify(token, secretKey, (err, data)=>{
            if (err)
                res.send(err)
        }); 
        connection.query('INSERT INTO expenses (title, budget, userid) VALUES (?,?,?)', [req.body.title, req.body.budget, userid], function (error, results, fields){
            console.log(results);
            if(error) throw error;
            res.json(results);
            
        })
    } else {
        res.sendStatus(403).send("Forbidden")
    }

})
app.delete('/expenses', async (req, res) => {
    
    const authHeader = req.headers.authorization;
    
    if (authHeader){
        let token = authHeader.split(' ')[1];
        token = token.replace('"', "")
        token = token.replace('"', "")
        //console.log("budget", token)
        let user = jwt_decode(token)
        let userid = user.userid
        //console.log(userid);
        jwt.verify(token, secretKey, (err, data)=>{
            if (err)
                res.send(err)
        }); 
        connection.query('DELETE FROM budget WHERE title = (?) AND userid = (?)', [req.body.title, userid], function (error, results, fields){
            console.log(results);
            if(error) throw error;
            res.json(results);
            
        })
    } else {
        res.sendStatus(403).send("Forbidden")
    }

})
app.put('/expenses', async (req, res) => {
    const authHeader = req.headers.authorization;
    
    if (authHeader){
        let token = authHeader.split(' ')[1];
        token = token.replace('"', "")
        token = token.replace('"', "")
        //console.log("budget", token)
        let user = jwt_decode(token)
        let userid = user.userid
        //console.log(userid);
        jwt.verify(token, secretKey, (err, data)=>{
            if (err)
                res.send(err)
        }); 
        connection.query('UPDATE budget SET budget = (?) WHERE title = (?) AND userid = (?)', [ req.body.budget, req.body.title, userid], function (error, results, fields){
            console.log(results);
            if(error) throw error;
            res.json(results);
            
        })
    } else {
        res.sendStatus(403).send("Forbidden")
    }
})

app.put('/budget', jwtMW, async (req, res) => {
    //res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    const title = req.body.title;
    const budget = req.body.budget;
    const userid = req.body.userid;
    connection.query('UPDATE budget SET budget = (?) WHERE title = (?)', [budget, title], function (error, results, fields){
        console.log(results);
        if(error) throw error;
        res.json(results);
        connection.end();
    })
})

app.delete('/budget', async (req, res) => {
    
    const authHeader = req.headers.authorization;
    
    if (authHeader){
        let token = authHeader.split(' ')[1];
        token = token.replace('"', "")
        token = token.replace('"', "")
        //console.log("budget", token)
        let user = jwt_decode(token)
        let userid = user.userid
        //console.log(userid);
        jwt.verify(token, secretKey, (err, data)=>{
            if (err)
                res.send(err)
        }); 
        connection.query('DELETE FROM budget WHERE title = (?) AND userid = (?)', [req.body.title, userid], function (error, results, fields){
            console.log(results);
            if(error) throw error;
            res.json(results);
            
        })
    } else {
        res.sendStatus(403).send("Forbidden")
    }

})

//end of budget

//start of user login

app.post('/login', (req, res) => {
    
    connection.query('SELECT * FROM user where email= (?) AND password= md5((?))', [req.body.email, req.body.password], function (error, user){
        let userst = JSON.stringify(user)  
        let userid = userst.substr(11,1);
        console.log(userid)
            jwt.sign({ userid: userid, exp: Math.floor(Date.now() / 1000) + (60*60)}, secretKey, function(err, token){

                console.log("login", token);
                res.json({
                    success: true,
                    error: null,
                    token
                });
            });
})
});

app.post ('/user/signup', (req, res) => {
    
    connection.query('INSERT INTO user (email, password) VALUES (?,md5((?)))', [req.body.email, req.body.password], function (error, results, fields){
        
        if(error){
            console.log(error);
            return res.status(500).send("An error occurred during registration"); 
        } 
        
        res.status(200).send({status: 'ok'});
        });
});


app.listen (port, () => {
    console.log(`Server on port ${port}`);
})