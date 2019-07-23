var express = require('express');
var router = express.Router();
var user_model = require('../../models/user_model');
var message_model = require('../../models/message_model');
var fs = require('fs');

var options = { 
  uploadDir: __dirname + '/../../public/upload/import_user',
  uploadUrl: '/../../public/upload/import_user/',
  storage: {
    type: 'local',
	
  }
};

var uploader = require('blueimp-file-upload-expressjs')(options);

router.get('/test', function(req, res) {
	//var params ={query_str:req.query};
	user_model.test(function(err, data) { 	
		res.send("ok");
	});
});
router.post('/check',function(req, res){
	
	if(!req.body.control_value)
	{
		res.json({msg: ""});
	}
	user_model.check_exist(req.body, function(err, data) { 
		res.json({msg:data});
	});
	
});
router.post('/verify', function(req, res) {
	//console.log("Passed from auth for verify");
	var user ={name:req.body.Username,password:req.body.Password};
	user_model.admin_verify(user, function(err, data) { 
	
		if( data.user.length == 0)
		{
			res.render('admin/login', {error: "Invalid user name or password!"});
		}
		else
		{	
			req.session.cookie.maxAge = 3600000;//session timeout in milli seconds
			session 			= req.session;
			session.user 		= {};
			session.user.email 	= data.user[0].email;
			session.user.user_id 	= data.user[0].employee_id;
			session.user.allow_cms	= data.user[0].allow_cms;
			session.user.profile_image = data.user[0].photo;
			res.redirect('/admin/dashboard/');		
			/*
				Common.header(data.user[0].id, function(err, data) {
				if(err)
				{
					showerror(err);
				}
				
				header = data;
				session.permission  = {};
				session.permission  = data.permission;
				session.menu 		= {};
				session.menu.menu	= data.menu;
				res.redirect('/admin');
			});
			*/
		}
 
	});
	/*if(req.body.Username == "metro" && req.body.Password == "metropass" )
	{
		session = req.session;
		session.user = {};
		session.user.name = "Metro";
		res.redirect('/admin');
	}
	else
	{
		res.render('admin/login', {error: "Invalid user name or password!"});
	}*/
});


router.get('/usermanagement', function(req, res) {
//console.log(req.query.id);
//console.log(req);
	var gid = (typeof req.query.group == "undefined" ) ? "":req.query.group;
	var kw = (typeof req.query.keyword == "undefined" ) ? "":req.query.keyword;
	var bz = (typeof req.query.biz_sector == "undefined" ) ? "":req.query.biz_sector;
	var com = (typeof req.query.company == "undefined" ) ? "":req.query.company;
	var dept = (typeof req.query.department == "undefined" ) ? "":req.query.department;
	var gen = (typeof req.query.gender == "undefined" ) ? "":req.query.gender;
	var sl = (typeof req.query.site_location == "undefined" ) ? "":req.query.site_location;
	var pp = (typeof req.query.probation_permanent == "undefined" ) ? "":req.query.probation_permanent;
	var nat = (typeof req.query.nationality == "undefined" ) ? "":req.query.nationality;
	var toc = (typeof req.query.type_of_contract == "undefined" ) ? "":req.query.type_of_contract;
	var r_o = (typeof req.query.rank == "undefined" ) ? "":req.query.rank;
	var r_n = (typeof req.query.rank_new == "undefined" ) ? "":req.query.rank_new;
	var rol_o = (typeof req.query.role_old == "undefined" ) ? "":req.query.role_old;
	var rol_n = (typeof req.query.role_new == "undefined" ) ? "":req.query.role_new;
	var sort_col = (typeof req.query.sortedCol == "undefined" ) ? "0":req.query.sortedCol;
	var sort_dir = (typeof req.query.sortedDir == "undefined" ) ? "desc":req.query.sortedDir;
	var pl = (typeof req.query.display == "undefined" ) ? "10":req.query.display;
	var pstart = (typeof req.query.start == "undefined" ) ? "0":req.query.start;
	var group = {};
	var output = function(){
		if(!req.xhr)
		{
			res.render('admin/index.ejs', {
				session:req.session,
				bodypage 	: 'usermanagement.ejs',	
				group_list: group,
				groupID : gid,
				keyword :kw,
				biz_sector :bz,
				company :com,
				department :dept,
				gender :gen,
				site_location :sl,
				probation_permanent :pp,
				nationality :nat,
				type_of_contract :toc,
				rank :r_o,
				rank_new :r_n,
				role_old :rol_o,
				role_new :rol_n,
				sortedCol :sort_col,
				sortedDir :sort_dir,
				display:pl,
				start:pstart
				
			});	
		}else{
			res.render('admin/usermanagement',{
				session:req.session,
				group_list: group,
				groupID : gid,
				keyword :kw,
				biz_sector :bz,
				company :com,
				department :dept,
				gender :gen,
				site_location :sl,
				probation_permanent :pp,
				nationality :nat,
				type_of_contract :toc,
				rank :r_o,
				rank_new :r_n,
				role_old :rol_o,
				role_new :rol_n,
				sortedCol :sort_col,
				sortedDir :sort_dir,
				display:pl,
				start:pstart
			});
		}
	}
	user_model.group_list(function(err, data){
		if(err)
		{
			//showerror(err);
		}else{
			//console.log(data[1]);
			group = data;	
			output();
		}
	});
			
});

router.get('/userlist', function(req, res) {
	var params ={query_str:req.query};
	user_model.userlist(params, function(err, data) { 	
		res.send(data);
	});
});
router.get('/alluserlist', function(req, res) {
	var params ={query_str:req.query};
	user_model.alluserlist(params, function(err, data) { 	
		return res.json({code:1,results: data});
	});
});

router.get('/useredit/:id', function(req, res) {
	//console.log("");
	var lock = 1;
	var settings = {};
	var page = [];
	var output = function() {
		console.log(page['rank_new']);
		if(!req.xhr)
		{
			res.render('admin/index.ejs', {
				session:req.session,
				bodypage 	: 'useredit.ejs',
				page			: page
			});	
		}else{
			res.render('admin/useredit',{
				session:req.session,
				page	: page
			});
		}
	}
	var showerror = function(err) {
		res.send("Error " + err.message);return;
	}
	
	user_model.useredit(req.params.id ,function(err, data) {
			if(err)
			{
				//showerror(err);
				res.redirect('/admin/user/usermanagement');
					return;
			}else{
			
				if(!data || data[0].length == 0){				
					res.redirect('/admin/user/usermanagement');
					return;
				}else{
					page['user'] = data[0];
					page['biz_sector'] = data[1];//biz_sector
					page['company'] = data[2];//company
					page['department'] = data[3];//department
					page['gender'] = data[4];//gender
					page['site_location'] = data[5];//site_location
					page['probation_permanent'] = data[6];//probation_permanent
					page['nationality'] = data[7];//nationality
					page['type_of_contract'] = data[8];//type_of_contract
					page['rank'] = data[9];//rank
					page['rank_new'] = data[10];
					page['role_old'] = data[11];
					page['role_new'] = data[12];
					//console.log(page);
					lock -= 1;
				
					if(lock === 0 )
					{
						output();
					}
				}
			}
			
		});
});

router.post('/editedUser',function(req,res){
	var params = req.body;
	
	user_model.editedUser(params, function(err, data) { 
			if(err){
				console.log(err);
				res.send(err);
			}else{
				res.send(JSON.stringify(data));
			}
		});	
});
router.post('/cleartoken',function(req,res){
	var params = req.body.uid;
	
	user_model.cleartoken(params, function(err, data) { 
			if(err){
				//console.log(err);
				res.send({status:"0",msg:err});
			}else{
				res.send({status:"1",msg:data});
			}
		});	
});

router.get('/pointHistory/:userId', function(req, res) {
	//console.log(req.params.userId);
	if(!req.xhr)
	{
		res.render('admin/index.ejs', {
			session:req.session,
			bodypage 	: 'pointhistory.ejs',
			userId	: req.params.userId
		});	
	}else{
		res.render('admin/pointhistory',{
			session:req.session,
			userId	: req.params.userId
		});
	}
			
});

router.get('/pointHistoryList/:userId', function(req, res) {
	//console.log(req.params);
	var userId = req.params.userId ;
	var params ={query_str:req.query};
	
	user_model.pointHistoryList(params,userId, function(err, data) { 	
		res.send(data);
	});
});


router.get('/newuser', function(req, res) {
	
	var lock = 1;
	var settings = {};
	var page = [];
	var output = function() {
		if(!req.xhr)
		{
			res.render('admin/index.ejs', {
				session:req.session,
				bodypage 	: 'createuser.ejs',
				page : page
			});	
		}else{
			res.render('admin/createuser',{
				session:req.session,
				page : page
			});
		}
	}
	var showerror = function(err) {
		res.send("Error " + err.message);return;
	}
	
	user_model.getAttrById(function(err, data) {
			if(err)
			{
				showerror(err);
			}else{
				//console.log(page);
				page['biz_sector'] = data[0];//biz_sector
				page['company'] = data[1];//company
				page['department'] = data[2];//department
				page['gender'] = data[3];//gender
				page['site_location'] = data[4];//site_location
				page['probation_permanent'] = data[5];//probation_permanent
				page['nationality'] = data[6];//nationality
				page['type_of_contract'] = data[7];//type_of_contract
				page['rank'] = data[8];//rank
				page['rank_new'] = data[9];//rank_new
				page['role_old'] = data[10];//role_old
				page['role_new'] = data[11];//role_new
				
		
				lock -= 1;
			
				if(lock === 0 )
				{
					output();
				}
			}
		});
			
});

router.post('/adduser',function(req,res){
	var params = req.body;
	
	user_model.adduser(params, function(err, data) { 
			if(err){
				console.log(err);
				res.send(err);
			}else{
				res.send(JSON.stringify(data));
			}
		});	
});

router.get('/attribute', function(req, res) {
	if(!req.xhr)
	{
		res.render('admin/index.ejs', {
			session:req.session,
			bodypage 	: 'attribute.ejs',
		});	
	}else{
		res.render('admin/attribute',{
			session:req.session,
		});
	}
			
});




router.get('/attributelist', function(req, res) {
	var params ={query_str:req.query};
	user_model.attributelist(params, function(err, data) { 	
		res.send(data);
	});
});


router.get('/addAttribute', function(req, res) {
	
	var lock = 1;
	var settings = {};
	var page = [];
	var output = function() {
		if(!req.xhr)
		{
			res.render('admin/index.ejs', {
				session:req.session,
				bodypage 	: 'addAttribute.ejs',
				page : page
			});	
		}else{
			res.render('admin/addAttribute',{
				session:req.session,
				page : page
			});
		}
	}
	var showerror = function(err) {
		res.send("Error " + err.message);return;
	}
	
	user_model.getAttribute(function(err, data) {
			if(err)
			{
				showerror(err);
			}
			page['attribute'] = data;
	
			lock -= 1;
		
			if(lock === 0 )
			{
				output();
			}
			
		});
			
});

router.post('/createAttr',function(req,res){
	var params = req.body;
	
	user_model.createAttribute(params, function(err, data) { 
			if(err){
				console.log(err);
				res.send(err);
			}else{
				res.send(JSON.stringify(data));
			}
		});	
});

router.get('/attributeEdit/:id', function(req, res) {
	//console.log("id>>>" + req.params.id);
	var lock = 1;
	var settings = {};
	var page = [];
	var output = function() {
		
		if(!req.xhr)
		{
			res.render('admin/index.ejs', {
				session:req.session,
				bodypage 	: 'attributeedit.ejs',
				page			: page,
			});	
		}else{
			res.render('admin/attributeedit',{
				session:req.session,
				page	: page,
			});
		}
	}
	var showerror = function(err) {
		res.send("Error " + err.message);return;
	}
	
	user_model.attributeedit(req.params.id ,function(err, data) {
			if(err)
			{
				res.redirect('/admin/user/attribute');
				return;
			}
			if(!data || data.length == 0){				
				res.redirect('/admin/user/attribute');
				return;
			}else{
				page['attribute'] = data;
			
				lock -= 1;
			
				if(lock === 0 )
				{
					output();
				}
			}
		});
});


router.post('/updateAttribute',function(req,res){
	var params = req.body;
	
	user_model.updateAttribute(params, function(err, data) { 
			if(err){
				console.log(err);
				res.send(err);
			}else{
				res.send(JSON.stringify(data));
			}
		});	
});


router.post('/delete_user', function(req, res) {		
	var params = req.body.id;
	user_model.delete_user(params, function(err, data) { 		
		res.send(JSON.stringify(data));
	});	
});


router.get('/usercsvupload', function(req, res) {
	if(!req.xhr)
	{
		res.render('admin/index.ejs', {
			session:req.session,
			bodypage 	: 'csvupload.ejs',
		});	
	}else{
		res.render('admin/csvupload',{
			session:req.session,
		});
	}
			
});

router.post('/uploaduserwithcsv', function(req, res) {
	//console.log("herejs");
	res.setHeader('Content-Type', 'text/html; charset=UTF-8');
	res.setHeader('Transfer-Encoding', 'chunked');
	
	var user={};
	console.log("upload started");
	uploader.post(req, res, function(obj) {

		var start = new Date();
		var Converter = require("csvtojson").Converter;
		var converter = new Converter({delimiter: ["\t",";",","]});
		var userFilepath='public/upload/import_user/'+obj.files[0].name;
		
		//res.flush();
		converter.fromFile(userFilepath,function(err,result){		
			if(err) {
				res.send({status:"0", description:err});
				console.log(err);
				return;
			}
			// res.write("Reading done! <br/>");
			// console.log("Reading done!");
		
			var end = new Date();  
			
			user["user"] = result;		
			var getUser = user.user[0];
			//console.log(getUser);
			var column = ['Sr','employee_code','employee_id','name','Display','login_name','gender','nationality','rank_old','rank_new','role_old','role_new','biz_sector','company','site_location','department','date_of_employment','date_of_birth','probation_permanent','type_of_contract','direct_report_to','contact_number','corporate_sim_card'];
			var key=[];
			for(var j in getUser){
				 key.push(j);
			} 
			a = key.toString();
			b = column.toString();

			if(a==b){
				var beforeDate = new Date();
				//console.log(user);
				user_model.uploaduserwithcsv(user,  function(err, data) { 

					if(err)
					{	console.log(err);
						res.send({status:"0", description:err});
						return;
					}
					else{
				
						res.send({status:"1", description:"success",user:data.user});
						//res.end();
					}
				});
			}else{
				//console.log('a>>>'+a);
				//console.log('b>>>'+b);
				res.send({status:"0", description:"Error : Wrong File!. Please upload csv file"});
				
			}
			//res.end();
		});
			//return;
	});		
		//res.send(JSON.stringify(obj));	
});

router.get('/appdownload', function(req, res) {
	if(!req.xhr)
	{
		res.render('admin/index.ejs', {
			session:req.session,
			bodypage 	: 'appdownload.ejs',
		});	
	}else{
		res.render('admin/appdownload',{
			session:req.session,
		});
	}
			
});
router.get('/download', function(req, res) {
	 var file = 'public/app/stc_app.apk';
	 //console.log(file);
	// res.download(file); 
	 res.download(file,'stc_app.apk', function(err){
		 if (err) {
			console.log(err);
		 } 
		// res.redirect('/admin/user/appdownload');	
	});
			
});


router.post('/check_employeeid',function(req, res){
	
	if(!req.body.control_value)
	{
		res.json({msg: ""});
		return;
	}
	user_model.check_employeeid(req.body, function(err, data) { 
		res.json({msg:data});
	});
	
});


module.exports = router;