var express = require('express');
var router = express.Router();
var api_model = require('../models/api_model');
var fs = require('fs');
var images = require('images');
//checktoken
//api testing start
//http://localhost:7090/admin/api/inbox

var formatDate = function(date) {
	var d = new Date(date),
		month = '' + (d.getMonth() + 1),
		day  = '' + d.getDate(),
		year = d.getFullYear();	
		hour = '' +d.getHours();
		min  = '' +d.getMinutes();
		sec  = '' +d.getSeconds();

	if (month.length < 2) month = "0" + month;
	if (day.length < 2) day = "0" + day;	
	if (hour.length < 2) hour = "0" + hour;
	if (min.length < 2) min = "0" + min;
	if (sec.length < 2) sec = "0" + sec;
	
	//return [year, month, day].join('-');
	return [year, month, day].join('')+"_"+Math.random().toString(36).substring(7);
					
}

router.get('/inbox', function(req, res) {
	res.render('admin/inbox',{});		
});

router.post('/getMessageList', function(req, res) {
	api_model.checktoken(req.body.login_token, function(err, userdata) { 
	
		if( userdata.length == 0)
		{
			res.json({status:"0",msg: "Invalid token"});
			return;
		}
		else
		{			
			var params = req.body;
			params['user_id'] = userdata[0].employee_id;
			var showerror = function(err) {
				//res.send("Error " + err.message);return;
				res.json({status:"0",msg: err.message});
			}
			api_model.inboxdataforapi(params, function(err, data) {
				if(err)
				{
					showerror(err);
				}
				else{
					res.json({status:"1",msg:"success",result:data});		
				}
			});
		}
 
	});
	
});
router.post('/clear_token', function(req, res) {
	api_model.checktoken(req.body.login_token, function(err, userdata) { 
	
		if( userdata.length == 0)
		{
			res.json({status:"0",msg: "Invalid token"});
			return;
		}
		else
		{			
			var params = req.body;
			params['user_id'] = userdata[0].employee_id;
			var showerror = function(err) {
				//res.send("Error " + err.message);return;
				res.json({status:"0",msg: err.message});
			}
			api_model.clearnoti_token(params, function(err, data) {
				if(err)
				{
					showerror(err);
				}
				else{
					res.json({status:"1",msg:"success"});		
				}
			});
		}
 
	});
	
});


//http://localhost:7090/admin/api/apimessagedetail
router.get('/apimessagedetail', function(req, res) {
	res.render('admin/message_detail',{});		
});

router.post('/getMessageDetails', function(req, res) {
	//check token and msg_id 
	var host_name= req.headers.host;
	
	api_model.checkMsgandToken(req.body.login_token,req.body.msg_id, function(err, userdata) { 
	
		if( userdata.length == 0)
		{
			res.json({status:"0",msg: "Invalid token"});
			return;
		}
		else
		{			
			var showerror = function(err) {
				res.json({status:"0",msg: err.message});
				return;
			}
			var check_msg = {msg_id:req.body.msg_id,user_id:userdata[0].user_id,login_token:req.body.login_token,hostname:host_name};
			api_model.getMessageDetails(check_msg, function(err2, data) {
					
				if(err2)
				{
					res.json("Error " + err2.message);return;
				}
				else{
				
					//console.log(data);
					res.json({status:"1",result:data});
			
				}
			});
		}
 
	});
	
});


router.post('/getquestion', function(req, res) {
	
	api_model.checktoken(req.body.login_token, function(err, userdata) { 
	
		if( userdata.length == 0)
		{
			res.json({status:"0",msg: "Invalid token"});
			return;
		}
		else
		{			
			var showerror = function(err) {
				res.json({status:"0",msg: err.message});
				return;
			}
			var check_msg = {msg_id:req.body.msg_id,user_id:userdata[0].employee_id,login_token:req.body.login_token};
			api_model.Searchmessagedetail(check_msg, function(err2, data) {
					
				if(err2)
				{
					res.send("Error " + err2.message);return;
				}
				else{
					if( data.length == 0)
					{
						res.json({status:"0",msg: "Invalid Data"});
						return;
					}
					else
					{	
						res.json({status:"1",msg: "success",result:data});
						return;
					}
			
				}
			});
		}
 
	});
	
});


//http://localhost:7090/admin/api/apicomposemessage
router.get('/apicomposemessage', function(req, res) {
	res.render('admin/composeMessagebyUser',{});		
});

router.post('/savingcomposemessage', function(req, res) {
	
	var params = req.body;
	api_model.savingcomposemessage(params, function(err, data,inserted_id) {
		if(err)
		{
			res.send({status:"0", description:err});
		}
		else{
			res.send({status:"1", description:"success",msg_id:inserted_id});
		}
	});
});


router.post('/api_set_files', function(req, res) {
	var params = req.body;
	api_model.api_set_files(params, function(err, data) {
		if(err)
		{
			res.send({status:"0", description:err});
		}
		else{
			res.send({status:"1", description:"success"});
		}
	});
});

//http://localhost:7090/admin/api/replyMessage
router.get('/replyMessage', function(req, res) {
	res.render('admin/replyMessage',{});		
});

router.post('/submitAnswer', function(req, res) {
	//console.log("hrer>>>>>>>>>>>>>>>>>>>>");
	//console.log(req.body);
	api_model.checkMsgandToken(req.body.login_token,req.body.msg_id, function(err, userdata) { 
	
		if( userdata.length == 0)
		{
			res.json({status:"0",msg: "Invalid token"});
			return;
		}
		else
		{		
			var params = req.body;
			params['user_id'] = userdata[0].user_id;
			
			api_model.save_survey(params, function(err, data) {
				if(err)
				{
					res.json({status:"0",msg: err});
					return;
				}
				else{
					res.send({status:"1", msg:"success"});
				}
			});
		}
	});
	
});

//http://localhost:7090/admin/api/replybyhr
router.get('/replybyhr', function(req, res) {
	res.render('admin/replybyhr',{});
});
router.get('/testmyconversation', function(req, res) {
	res.render('admin/myconversation',{});		
});
router.post('/getReportList',function(req,res){
	api_model.checktoken(req.body.login_token, function(err, userdata) { 
	
		if( userdata.length == 0)
		{
			res.json({status:"0",msg: "Invalid token"});
			return;
		}
		else
		{			
			var params = req.body;
			params['user_id'] = userdata[0].employee_id;
			params['login_token'] = req.body.login_token;
			
			var showerror = function(err) {
				//res.send("Error " + err.message);return;
				res.json({status:"0",msg: err.message});
			}
			api_model.myconversation(params, function(err, data) {
				if(err)
				{
					showerror(err);
				}
				else{
					res.json({status:"1",msg:"success",result:data});		
				}
			});
		}
 
	});
});
router.post('/getReportMessages', function(req, res) {
	api_model.checktoken(req.body.login_token, function(err, userdata) { 
	
		if( userdata.length == 0)
		{
			res.json({status:"0",msg: "Invalid token"});
			return;
		}
		else
		{	api_model.check_user(req.body.c_id,userdata[0].employee_id, function(err2, data) { 
				if( data.length == 0)
				{
					res.json({status:"0",msg: "Invalid Data"});
					return;
				}
				else
				{	
					
					var params = req.body;
					params['user_id'] = userdata[0].employee_id;
					var myhost = req.protocol+"://"+req.headers.host+"/";
					//params['myhost'] = myhost;
					var showerror = function(err2) {
						//res.send("Error " + err.message);
						res.json({status:"0",msg: err2.message});
						return;
					}
					api_model.search_replyfromuser(params, function(err3, data) {
						if(err3)
						{
							showerror(err3);
						}
						else{
							//res.json(JSON.stringify(data));	
							
							var host_url = myhost+"assets/upload/"; 
							console.log(host_url);
							res.json({status:"1",msg: "success",result:data,host_url:host_url});
						}
					});
				}
			});
			
		}
	});
	
});
router.post('/new_reportmsg', function(req, res) {
	api_model.checktoken(req.body.login_token, function(err, userdata) { 
	
		if( userdata.length == 0)
		{
			res.json({status:"0",msg: "Invalid token"});
			return;
		}
		else
		{			
			var params = req.body;
			params['user_id'] = userdata[0].employee_id;
			params['login_token'] = req.body.login_token;
			params['last_update'] = req.body.last_update;
			
			var showerror = function(err) {
				//res.send("Error " + err.message);return;
				res.json({status:"0",msg: err.message});
			}
			api_model.myconversation_new(params, function(err, data) {
				if(err)
				{
					showerror(err);
				}
				else{
					res.json({status:"1",msg:"success",result:data});		
				}
			});
		}
 
	});
	
});

//http://localhost:7090/admin/api/userconverstionrelpy
router.get('/userconverstionrelpy', function(req, res) {
	res.render('admin/userconverstionrelpy',{});
});
router.post('/upload_file/:type', function(req, res) {
	
	//res.setHeader('Content-Type', 'text/html; charset=UTF-8');
	//res.setHeader('Transfer-Encoding', 'chunked');
	var type = req.params.type;
	
	// 5MB for audio 10,000,000,000 GB 1,000,000 MB
	// 15MB for video
	var filesize;
	if(type == "audio"){
		filesize = 5000000;
	}else if(type == "video"){
		filesize = 15000000;
	}else{
		filesize = 15000000;
	}
	var updir = __dirname + '/../public/assets/upload/'+type;
	var options = {
		tmpDir: __dirname + '/../public/assets/upload/tmp',
		uploadDir: __dirname + '/../public/assets/upload/'+type,
		uploadUrl: '/assets/upload/files/'+type,
			maxFileSize:  filesize,
			//acceptFileTypes:  /.+/i,
			// Files not matched by this regular expression force a download dialog,
			// to prevent executing any scripts in the context of the service domain:
			/*inlineFileTypes:  /\.(gif|jpe?g|png)/i,
			imageTypes:  /\.(gif|jpe?g|png)/i,
			imageVersions :{
				maxWidth : 200,
				maxHeight : 200
			},*/
			accessControl: {
				allowOrigin: '*',
				allowMethods: 'OPTIONS, HEAD, GET, POST, PUT, DELETE',
				allowHeaders: 'Content-Type, Content-Range, Content-Disposition'
			},
		  storage: {
			type: 'local'
		  }
	};
	var uploader = require('blueimp-file-upload-expressjs')(options);
	console.log("video uploading started");
	uploader.post(req, res, function(obj) {
		
		//console.log(err);
		/*if(err){
			console.log(err);
			req.session.state = '1';
			res.send({status:"0", description:err});
			res.end();
			return;
		 }else{*/
			
			//console.log("testttttttttttt");
			//console.log(obj.files[0].name); 
			var changedtype = obj.files[0].type.split('/');
			var changedname =formatDate(new Date());
			
			fs.rename(updir+'/'+obj.files[0].name,updir+'/' +changedname+'.'+changedtype[1], function(err) {
				
				if ( err ){ 
					console.log('ERROR: ' + err);
					return;
				}else{
					
					res.send({code:1,description:"", data:changedname+'.'+changedtype[1]});
				}
			});
			
			//res.write("upload success <br/>");
			
			
		//}
	});		
		//res.send(JSON.stringify(obj));	
});
router.post('/sendReportMessage', function(req, res) {
	//console.log(req);
	api_model.checktoken(req.body.login_token, function(err, userdata) { 
	
		if( userdata.length == 0)
		{
			res.json({status:"0",msg: "Invalid token"});
			return;
		}
		else
		{			
			api_model.check_user(req.body.c_id,userdata[0].employee_id, function(err2, data) { 
				if( data.length == 0)
				{
					res.json({status:"0",msg: "Invalid Data"});
					return;
				}
				else
				{	
					function esc_chars(objdata)
					{
						var esc_data = objdata.replace(/[\\]/g, '\\\\')
						.replace(/[\"]/g, '\\\"')
					   // .replace(/[\']/g, '\\\'')
						.replace(/[\/]/g, '\\/')
						.replace(/[\b]/g, '\\b')
						.replace(/[\f]/g, '\\f')
						.replace(/[\n]/g, '\\n')
						.replace(/[\r]/g, '\\r')
						.replace(/[\t]/g, '\\t');
						return esc_data;
					}															
					var showerror = function(err2) {
						//res.send("Error " + err.message);return;
						res.json({status:"0",msg: err2.message});
						return;
					}
					
					var params={};
					params['c_id'] = req.body.c_id;
					params['type'] = req.body.type;
					params['login_token'] = req.body.login_token;
					
					var type = req.body.type;
					var message = req.body.message;
					var imageNames;
					if(req.body.type == 'image'){
						var decodeBase64Image = function(dataString) {
							var matches = dataString.match(/^data:([A-Za-z0-9-+\/]+);base64,(.+)$/),
							response = {};

							if (matches.length !== 3) {
								return new Error('Invalid input string');
							}

							response.type = matches[1];	
							response.data = new Buffer(matches[2], 'base64');
							var changedname =formatDate(new Date());	
							if(req.body.type == 'image')
							{
								response.name = changedname +"."+ matches[1].replace("image/", "");		
							}
							else
							{
								response.name = changedname +"."+ matches[1].replace("video/", "");	
							}
							return response;
						};
						//var imagename = req.body.imagename;
						var imagedata = req.body.data ;
						//console.log(imagedata);
						var imageBuffer = decodeBase64Image(imagedata);	
						
						userUploadedImagePath =  __dirname + '/../public/assets/upload/'+req.body.type+"/"+imageBuffer.name;
						fs.writeFile(userUploadedImagePath, imageBuffer.data,  
						function(err) 
						{
							if(err)
							{
								console.log("err");
								console.log(err);
								res.send({message:"file upload failed"});
								return;
							}else
							{
								if(req.body.type == "image")
								{
									images('public/assets/upload/image/'+imageBuffer.name)                    
															
									.size(1000)                          
									
									.save('public/assets/upload/image/'+imageBuffer.name, {               
										quality : 70                    
									});
								
								}
								imageNames = imageBuffer.name;
								var result = "{";
								if(!message || message != null){
									result +='"message":"'+esc_chars(req.body.message.trim())+'",';
								}
								result +=  '"files":"'+imageNames+'"}';
								params['data'] = result;
								newFunction();
							}
							
						});
					}
					else if(req.body.type == 'video'){
						var file_name = req.body.filename;
						var result = "{";
						if(!message || message != null){
							result +='"message":"'+esc_chars(req.body.message.trim())+'",';
						}
						result +=  '"files":"'+file_name+'"}';
						params['data'] = result;
						newFunction();
					}
					else{
						params['data'] = '{"message":"'+esc_chars(req.body.message.trim())+'"}';
						newFunction();
					}
				function newFunction(){
					api_model.conversationreplybyuser(params, function(err, inserted_id) {
						if(err)
						{
							res.send({status:"0",msg: err.message});
							return;
						}
						else{
							//res.send({status:"1", description:"success",msg_id:inserted_id});
							res.send({status:"1",msg: "success",msg_id:inserted_id});
						}
					});
				}
					
				}
			});
			
		}
 
	});
	
});

router.post('/uploadforuserconversationreply', function(req, res) {
	var params = req.body;
	api_model.uploadforuserconversationreply(params, function(err, data) {
		if(err)
		{
			res.send({status:"0", description:err});
		}
		else{
			res.send({status:"1", description:"success"});
		}
	});
});     


//http://localhost:7090/admin/api/apiusercompose
router.get('/apiusercompose', function(req, res) {
	res.render('admin/apiusercompose',{});
});


router.post('/createReport', function(req, res) {
	
	//var params = req.body;
	api_model.checktoken(req.body.login_token, function(err, userdata) { 
	
		if( userdata.length == 0)
		{
			res.json({status:"0",msg: "Invalid token"});
			return;
		}
		else
		{			
			var params = req.body;
			params['user_id'] = userdata[0].employee_id;
			var showerror = function(err) {
				//res.send("Error " + err.message);return;
				res.json({status:"0",msg: err.message});
			}
			api_model.saveUserCompose(params,req.body.login_token, function(err2, data,inserted_id) {
				if(err2)
				{
					res.json({status:"0",msg: err2});
				}
				else{
					//res.send({status:"1", description:"success",msg_id:inserted_id});
					res.json({status:"1",msg: "success",report_id:inserted_id});
				}
			});
		}
 
	});
	
});

/*router.post('/mactingUserAndMessage',function(req, res){
	var params = req.body;
	api_model.mactingUserAndMessage(params, function(err, data) {
		if(err)
		{
			res.send({status:"0", description:err});
			return;
		}
		else{
			if(data.length > 0)
			{
				res.send({status:"1", description:"success"});
			}else{
				res.send({status:"2", description:"fail"});
			}
			
		}
	});
});
*/

//http://localhost:7090/admin/api/apiLogin
router.get('/apiLogin', function(req, res) {
	res.render('admin/apiLogin',{});		
});

router.post('/login', function(req, res) {
	//console.log("Passed from auth for verify");
	var user ={name:req.body.email,password:req.body.password,noti_token:req.body.noti_token};
	//console.log(user);
	api_model.admin_verify(user, function(err, data) { 
	
		if(err)
		{
			res.send( {status:"0", msg: "Invalid user name or password!"});
			
		}
		else
		{			
			/*session 			= req.session;
			session.user 		= {};
			session.user.name 	= data.user[0].email;
			session.user.id 	= data.user[0].user_id;
			session.user.status	= data.user[0].allow_cms;*/
			//console.log(data);
			if(data.login_token)
			{
				res.send({status:"1", msg:" login success",login_token:data.login_token,first_login:data.first_login});
			}
			else
			{
				res.send( {status:"0", msg: "Invalid user name or password!"});
			}
			
		}
	});

});
router.post('/login_new', function(req, res) {
	//console.log("Passed from auth for verify");
	var user ={name:req.body.email,password:req.body.password,noti_token:req.body.noti_token};
	//console.log(user);
	api_model.admin_verify_new(user, function(err, data) { 
	
		if(err)
		{
			res.send( {status:"0", msg: "Invalid user name or password!"});
			
		}
		else
		{			
			
			if(data.login_token)
			{
				res.send({status:"1", msg:" login success",login_token:data.login_token});
			}
			else
			{
				//res.send( {status:"0", msg: "Invalid user name or password!"});
				res.send({status:"1", msg:" login failed",login_token:data.login_token});
			}
			
		}
	});

});
router.post('/save_images/:type', function(req, res) {
	var type = req.params.type;
	var decodeBase64Image = function(dataString) {
		var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
		response = {};

		if (matches.length !== 3) {
			return new Error('Invalid input string');
		}

		response.type = matches[1];	
		response.data = new Buffer(matches[2], 'base64');
		var changedname =formatDate(new Date());		
		response.name = changedname +"."+ matches[1].replace("image/", "");		
		return response;
	};
	//var imagename = req.body.imagename;
	var data = req.body.encodedimg ;
	var imageBuffer = decodeBase64Image(data);	
	
	userUploadedImagePath =  __dirname + '/../public/assets/upload/'+type+'/'+imageBuffer.name;
	fs.writeFile(userUploadedImagePath, imageBuffer.data,  
	function(err) 
	{
		if(err)
		{
			console.log("err");
			console.log(err);
			res.send({message:"file upload failed"});
			return;
		}else
		{
			images('public/assets/upload/'+type+'/'+imageBuffer.name)                    
                                        
				.size(1000)                          
				
				.save('public/assets/upload/'+type+'/'+imageBuffer.name, {               
					quality : 70                    
				});
			res.send(imageBuffer.name);
		}
		
	});
	
});

//http://localhost:7090/api/Password
//change password
router.get('/password', function(req, res) {
	res.render('admin/apichangepassword',{});
});

router.post('/changePassword',function(req,res){
	var params = req.body;
	//console.log("params");
	//console.log(params);
	api_model.checktoken(req.body.login_token, function(err, userdata) { 
	
		if( userdata.length == 0)
		{
			res.json({status:"0",msg: "Invalid token"});
			return;
		}
		else
		{	
			api_model.updatePassword(params, function(err, data) { 
			
				if(!err){
					
						res.send(data);
									
				}
				else
				{
					res.send(data);
				}
			
			});	
		}
	});
	
});


//http://localhost:7090/api/getProfile
//getProfile
router.get('/getProfile', function(req, res) {
	res.render('admin/apigetprofile',{});
});

router.post('/getUserProfile',function(req,res){
	var params = req.body;
	var myhost = req.protocol+"://"+req.headers.host+"/";
	params['myhost'] = myhost;
	api_model.checktoken(req.body.login_token, function(err, userdata) { 
	
		if( userdata.length == 0)
		{
			res.json({status:"0",msg: "Invalid token"});
			return;
		}
		else
		{	
			api_model.getUserProfile(params, function(err, data) { 
				
				if(!err){
					//data.push ({pointHistory :"[{'1st Step','56 points'},{'21st Step','96 points'},{'1st Oct','86 points'},{'21st Oct','66 points'}]"});
					//console.log(data);
					res.send({status:"1", msg:data});
					
				}
				else
				{
					res.send( {status:"0"});
				}
				
			});	
		
		}
	
	});
});



//http://localhost:7090/api/notifyMessageReceived
//notify message received
router.get('/MessageReceived', function(req, res) {
	res.render('admin/notifyMessageReceived',{});
});


router.post('/notifymessageReceived',function(req,res){
	var params = req.body;
	api_model.checktoken(req.body.login_token, function(err, userdata) { 
	
		if( userdata.length == 0)
		{
			res.json({status:"0",msg: "Invalid token"});
			return;
		}
		else
		{
			api_model.messageReceived(params, function(err, data) { 
			
			if(!err){
				
				res.send({status:"1", msg:"update success"});
				
			}
			else
			{
				res.send( {status:"0"});
			}
			
		});	
		}
		
		
	});
	
});


router.get('/apiphotochange', function(req, res) {
	res.render('admin/apiphotochange',{});
});

router.post('/changeprofilepicture',function(req,res){
	var params = req.body;
	var eid = "";
	api_model.checktoken(req.body.login_token, function(err, userdata) { 
	
		if( userdata.length == 0)
		{
			res.json({status:"0",msg: "Invalid token"});
			return;
		}
		else
		{			
			//var params = req.body;
			params['user_id'] = userdata[0].employee_id;
			eid = userdata[0].employee_id;
			var decodeBase64Image = function(dataString) {
			var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
			response = {};

			if (matches.length !== 3) {
				return new Error('Invalid input string');
			}

			response.type = matches[1];	
			response.data = new Buffer(matches[2], 'base64');
			var changedname =userdata[0].employee_id;		
			response.name = changedname +".jpg";		
			return response;
		};
		//var imagename = req.body.imagename;
		var imagedata = req.body.photo ;
		if(imagedata)
		{
			var imageBuffer = decodeBase64Image(imagedata);	
			userUploadedImagePath =  __dirname + '/../public/assets/upload/users/'+imageBuffer.name;
			fs.writeFile(userUploadedImagePath, imageBuffer.data,  
			function(err) 
			{
				if(err)
				{
					console.log("err");
					console.log(err);
					res.send({message:"file upload failed"});
					return;
				}else
				{
					images('public/assets/upload/users/'+imageBuffer.name)                    
												
						.size(1000)                          
						
						.save('public/assets/upload/users/'+imageBuffer.name, {               
							quality : 70                    
						});
					
					imageNames = imageBuffer.name;
					params['image'] = imageNames;
					//console.log(params);
						api_model.changeprofilepicture(params, function(err, data) { 
				
							if(!err){
								
								res.send({status:"1", msg:"update success"});
								
							}
							else
							{
								res.send( {status:"0"});
							}
							
						});	
				}
				
			});
		}
		else
		{
			fs.createReadStream('public/assets/upload/users/defaultprofile.jpg').pipe(fs.createWriteStream('public/assets/upload/users/'+eid+'.jpg'));
			res.send({status:"1", msg:"update success"});			
		}
		
		}
 
	});
	//
	

});


router.post('/getlatestconversation', function(req, res) {
	
	var params = req.body;
	//login_token
	//id
	api_model.checktoken(req.body.login_token, function(err, userdata) { 
	
		if( userdata.length == 0)
		{
			res.json({status:"0",msg: "Invalid token"});
			return;
		}
		else
		{			
			//var id = req.body.id;
			//params['user_id'] = userdata[0].user_id;
			
			var showerror = function(err) {
				//res.send("Error " + err.message);return;
				res.json({status:"0",msg: err.message});
			}
			api_model.getlatestconversation(params,function(err2, data) {
				if(err2)
				{
					res.json({status:"0",msg: err2});
				}
				else{
					var myhost = req.protocol+"://"+req.headers.host+"/";
					var host_url = myhost+"assets/upload/"; 
					res.json({status:"1",msg: "success",result:data,host_url:host_url});
				}
			});
		}
 
	});
	
});

router.get('/getorg', function(req, res) {
	api_model.sendorg(function(err, data) {
		if(err)
			{
				res.json({status:"0",msg: err});
			}
		else{
				res.json({status:"1",msg: "success",result:data});
			}
	});
});

router.post('/checknewuser', function(req, res) {
	var name = req.body.name;
	var organization = req.body.organization;
	var ph = req.body.ph; 
	var nric = req.body.nric;
	var noti_token = req.body.noti_token;
	api_model.checknewuser(name,organization,ph,nric,noti_token,function(err, data) {
		if(err)
			{
				res.json({status:"0",msg: err});
			}
		else{
			
				res.json({status:"1",msg: data});
			}
	});
});

router.post('/checkotp', function(req, res) {
	var login_token = req.body.login_token;
	var otp = req.body.otp;
	api_model.checktoken(login_token, function(err, userdata) { 
	
		if( userdata.length == 0)
		{
			res.json({status:"0",msg: "Invalid token"});
			return;
		}
		else
		{			
			
			api_model.checkotp(userdata[0].employee_id,otp,function(err, data) {
				if(err)
					{
						res.json({status:"0",msg: err});
					}
				else{
						res.json({status:"1",msg:data});
					}
			});
		}
 
	});
	
});

router.post('/firstNewPassword', function(req, res) {
	var password = req.body.password;
	var login_token = req.body.login_token;
	// 3a181f10aab219125d2096384c3c3e2c
	api_model.checktoken(login_token, function(err, userdata) { 
	
		if( userdata.length == 0)
		{
			res.json({status:"0",msg: "Invalid token"});
			return;
		}
		else
		{			
			api_model.firstNewPassword(password,userdata[0].employee_id, function(err, data) {
				if(err)
					{
						res.json({status:"0",msg: err});
					}
				else{
						res.json({status:"1",msg:data});
					}
			
			});	
		}
 
	});
	
});

module.exports = router;