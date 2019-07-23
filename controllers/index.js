var express = require('express');
var router = express.Router();

router.use(require('../middlewares/auth'));
var user_model = require('../models/user_model');

console.log("Request Start");

// Backend Control System
router.get('/admin', function(req, res) {

	//var settings = {};
	//settings.user = req.session.user;
	
	//console.log(settings);
  	//res.render('admin/index', {session: req.session});
	res.redirect("/admin/message/compose/");
});

router.get('/admin/login', function(req, res) {

  res.render('admin/login');
});

router.post('/admin/login/forgetpassword', function(req, res) {
	console.log("forgetpassword");
	var email = req.body.email;
	console.log(email);
	user_model.forget_password(email, function(err, data) { 
		if(err){
			res.send(err);
		}else{
			res.send(data);
		}
	});
  
});



router.get('/admin/logout', function(req, res) {
/*
req.session.login = null;
// this also works
delete req.session.login;
The function destroy() is for removing the entire session.
*/
delete req.session.user;
res.redirect('/admin/login');
  /*req.session.destroy(function(err){
		if(err){
			console.log(err);
		}
		else
		{
			res.redirect('/admin/login');
		}
	});*/
});



router.use('/admin/user', require('./admin/user'));
router.use('/admin/message', require('./admin/message'));
router.use('/admin/dashboard', require('./admin/dashboard'));
router.use('/api', require('./api'));
router.use('/scheduler', require('./scheduler'));
router.use('/admin/group', require('./admin/group'));
//router.use('/admin/admin_user', require('./admin/admin_user'));

// Front-End system

/*router.use('/', require('./home'));
router.use('/user', require('./user'));
router.use('/myaccount', require('./myaccount'));*/
router.get('/logout', function(req, res) {

req.session.cookie.maxAge = 1000;
delete req.session.frontuser;
res.redirect('/');
 
});


//router.use('/*', require("./content"));




module.exports = router;