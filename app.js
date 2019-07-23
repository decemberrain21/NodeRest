var express = require('express');
var session	= require('express-session');
var SessionStore = require('express-mysql-session');

var app 	= express();
var bodyParser = require('body-parser');

var port 	= process.env.PORT || 7090;

var options = {
    host: '127.0.0.1',//192.168.100.100 //127.0.0.1
   // port: 3306,
    database:'stc_db',
	user: 'root',
	password : '',
	dateStrings: 'date'
};

var sessionStore = new SessionStore(options);

app.use(session({
    key: 'mysession_cookie_name',
    secret: 'mysession_cookie_secret',
    store: sessionStore,
    resave: true,
	  rolling:true,
    saveUninitialized: true
}));

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({limit: "10mb",extended: true}));
app.use(require('./controllers'));

app.use(function(req, res, next){
  res.status(404).render('404', { url: req.url });
    return;
 
 });
 
 app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})
 
app.listen(port, function() {
  console.log('Listening on port ' + port);
});