const express = require('express');
const http = require('http');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const config = require('./config');
const {route} = require('./Routes/Main')
const {mongoose} = require('./DB/connection')
const fileUpload = require('express-fileupload');
const session = require('express-session');

var app = express();
var server = http.createServer(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(fileUpload());
app.use(session({secret:config.session_secret, saveUninitialized:true, resave:true}))
app.set('view engine','hbs');
hbs.registerPartials(__dirname+'/views/partials');
app.use('/public', express.static(__dirname+'/public'));
app.use('/',route);

server.listen(config.port, (err)=>{
    if(err) console.log('Internal server error',err);
    else console.log(`server is started on http://localhost:${config.port}`);
});