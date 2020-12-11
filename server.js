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
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Headers', 'Content-type,Authorization');
    
    next();
});






app.get('/budget', async (req, res) => {
    const authHeader = req.headers.authorization;
    //console.log(req.headers)
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        //console.log(data)

        jwt.verify(token, secretKey, function (err, d) {
            if (err) {
                console.log(err);
                // return res.sendStatus(403);
            }

                console.log(d)
            // req.user = user;
            // userID = user
            // user

            //next();
        });
    } else {
        // res.sendStatus(401);
        console.log("no authorization")
    }
   
    // connection.query('SELECT * FROM budget WHERE userid = ?', [userid], function (error, results, fields){
        
    //     if(error) throw error;
    //     res.json(results);
        
    // })
})

app.post('/budget', jwtMW, async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    const title = req.body.title;
    const budget = req.body.budget;
    const userid = req.body.userid;
    connection.query('INSERT INTO budget (title, budget, userid) VALUES (?,?,?)', [title, budget, userid], function (error, results, fields){
        console.log(results);
        if(error) throw error;
        res.json(results);
        connection.end();
    })
})

app.put('/budget', jwtMW, async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
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

app.delete('/budget', jwtMW, async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    const title = req.body.title;
    const budget = req.body.budget.

    connection.query('DELETE FROM budget WHERE title = (?) AND userid = (?)', [title, userid], function (error, results, fields){
        console.log(results);
        if(error) throw error;
        res.json(results);
        connection.end();
    })
})

//end of budget

//start of user login

app.post('/user/login', (req, res) => {
    
    connection.query('SELECT * FROM user where email= (?) AND password= md5((?))', [req.body.email, req.body.password], function (error, user){  
        
        if (user.length > 0){
            let token = jwt.sign({ id: user.id, email: user.email}, secretKey, {expiresIn: '1800'});
            res.json({
                success: true,
                error: null,
                token
                
            });
            //console.log(token);
            
        } else{
            res.status(401).json({
                        success: false,
                        token: null,
                        error: 'Username or password is incorrect'
                    })
        }
        
    });
});

app.post ('/user/signup', (req, res) => {
    
    //var hashedPassword = bcrypt.hashSync(req.body.password, 10);

    connection.query('INSERT INTO user (email, password) VALUES (?,md5((?)))', [req.body.email, req.body.password], function (error, results, fields){
        
        if(error){
            console.log(error);
            return res.status(500).send("An error occurred during registration"); 
        } 
        
        res.status(200).send({status: 'ok'});
        });
});

// app.get('/auth', jwtAuth, function(req, res, next){
//     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
//     connection.query("SELECT id, email FROM users WHERE id=(?)", [req.id], function (error, user){
//         if (error){
//             return res.status(500).send("There was a problem finding the user.");
//         }
//         if (!user){
//             return res.status(404).send("No user found");
//         }
//         res.status(200).send(user);
//     });
// });

// function jwtAuth(req, res, next) {
//     const auth
//     var secret = 'mysecret'
//     if (!req.token) {
//         return res.status(403).send({ auth: false, message: 'No token provided'});
//     }

//     nJwt.verify(req.token, secret, function(error, decoded){
//         if (error){
//             return res.status(500).send({ auth: false, message: 'Could not authenticate token'});
//         }
//         req.userId = decoded.body.id;
//         next();
//     });
// }




app.listen (port, () => {
    console.log(`Server on port ${port}`);
})