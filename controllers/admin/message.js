var express = require('express');
var router = express.Router();
var message_model = require('../../models/message_model');
var fs = require('fs');
var async = require('async');
var images = require('images');
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

router.post('/setexisted_files', function(req, res) {
	
	//
	var all_files = req.body.setfiles;
	var new_files = [];
	async.eachSeries(all_files,function iteratee(item, callback) {	
	
		var updir = __dirname + '/../../public/assets/upload/'+req.body.type;
		var type_arr = item.split('.');
		var changedtype = type_arr[1];
		var changedname =formatDate(new Date());
		if(req.body.from == "schedule")
		{
			changedname =formatDate(new Date(req.body.scheduled_date));
		}
		
		if((req.body.from == "schedule" || req.body.from =="draft") && req.body.state !="forward")
		{
			var stream = fs.createReadStream(updir+'/'+item);
			stream.pipe(fs.createWriteStream(updir+'/' +changedname+'.'+changedtype));

			var had_error = false;
			stream.on('error', function(err){
			  had_error = true;
			});
			stream.on('close', function(){
			  if (!had_error) fs.unlink(updir+'/'+item);
			});
		}
		else
		{
			fs.createReadStream(updir+'/'+item).pipe(fs.createWriteStream(updir+'/' +changedname+'.'+changedtype));
		}
		
		//fs.rename(updir+'/'+obj.files[0].name,updir+'/' +changedname+'.'+changedtype, function(err) {
		new_files.push(changedname+'.'+changedtype);
		callback();
		
	}, function done() {
		res.send(new_files);
		
	});
	

});

router.get('/compose/*', function(req, res) {
	//req.originalUrl = req.originalUrl.substr(0,req.originalUrl.indexOf('?'));
	req.originalUrl = req.originalUrl.split("?").shift();
	var params = req.originalUrl.split('/');
	
	var lock = 2;
	var group = {};
	var page = {};
	var state="compose";
	
	var output = function() {
	//console.log(state);
		if(state == "compose")
		{
			page["sent_user"] = {};
		}
		if(!req.xhr)
		{
			res.render('admin/index.ejs', {
				group_list	: group,
				bodypage 	: 'compose.ejs',
				session:req.session,
				page : page,
				state:state
			});
		}else
		{
			res.render('admin/compose',{
				group_list	: group,
				session:req.session,
				page : page,
				state:state
				
			});
		}
	}
	
	var showerror = function(err) {
		res.send("Error " + err.message);
		return;
	}
	
	if(params[4] != "schedule"){
		if(params[4] != ''){
		if(params[5] != undefined)
		{
			state="forward";
		}
		else
		{
			state="drafts";
		}
		message_model.draftsbyID(params[4] ,function(err, data) {
			if(err)
			{
				console.log(err);
				res.redirect('/admin/message/drafts/');
				//showerror(err);
				return;
			}else{
				//console.log(data);
				if(!data || data.length == 0){				
						res.redirect('/admin/message/drafts/');
						return;
				}else{
					page =data;
					//console.log(page);
					//var draft_sent_user = page["sent_user"];
					//console.log(draft_sent_user);
					//var get_userID = [];
					//var mydata={};
					/*if(draft_sent_user!=""){
						for(var i=0;i< draft_sent_user.length;i++){
											
							mydata['employee_id']=draft_sent_user[i]["user_id"];
							mydata['name']=draft_sent_user[i]["name"];
							//mydata.json(get_userID);
							//get_userID.push(mydata);
							
						}
					}*/
					
					//page["for_indivUser"] = get_userID;
					page["msg_id"] = params[4];
					lock -= 1;
					if(lock === 0 )
					{
						output();
					}
				}
			}
		});
		}
	}else{
		if(params[5] != ''){
			if(params[6] != undefined)
			{
				state="forward";
			}
			else
			{
				state="schedule";
			}
				
			message_model.schedulebyID(params[5] ,function(err, data) {
				// console.log("schedulebyID");
				// console.log(data);
				if(err)
				{
					console.log(err);
					res.redirect('/admin/message/schedule_message/');
					//showerror(err);
					return;
				}else{
					//console.log(data);
					if(!data || data.length == 0){				
							res.redirect('/admin/message/schedule_message/');
							return;
					}else{
						page =data;
						
						
						//page["for_indivUser"] = get_userID;
						page["msg_id"] = params[5];
						lock -= 1;
						if(lock === 0 )
						{
							output();
						}
					}
				}
			});
		}
	}
	

	message_model.group_list(function(err, data){
		if(err)
		{
			showerror(err);
		}
		
		group = data;
		
		if(params[4]!="schedule"){
			if(params[4] != ''){
				lock -= 1;
			}else{
				lock -= 2;
			}
		}else{
			if(params[5] != ''){
				lock -= 1;
			}else{
				lock -= 2;
			}
		}
		
		
		
		if(lock === 0 )
		{
			output();
		}
	});
});

router.get('/schedule_message', function(req, res) {
	if(!req.xhr)
	{
		res.render('admin/index.ejs', {
			session:req.session,
			bodypage 	: 'schedulemessage.ejs',	
		});	
	}else{
		res.render('admin/schedule_message',{
			session:req.session
		});
	}
			
});



router.post('/upload_file/:type/:from', function(req, res) {
	
	//res.setHeader('Content-Type', 'text/html; charset=UTF-8');
	//res.setHeader('Transfer-Encoding', 'chunked');
	var type = req.params.type;
	var from = req.params.from;
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
	var updir = __dirname + '/../../public/assets/upload/'+type;
	var options = {
		tmpDir: __dirname + '/../../public/assets/upload/tmp',
		uploadDir: __dirname + '/../../public/assets/upload/'+type,
		uploadUrl: '/assets/upload/files'+type,
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
			if(from != "current")//schedule
			{
				changedname =formatDate(new Date(from));
				console.log("change>>"+changedname);
			}
			fs.rename(updir+'/'+obj.files[0].name,updir+'/' +changedname+'.'+changedtype[1], function(err) {
				
				if ( err ){ 
					//console.log('ERROR: ' + err);
					return;
				}else{
					if(type == "image" &&  changedtype[1] != "gif")
					{
							//console.log(changedtype[1]);
							images('public/assets/upload/'+type+'/'+changedname+'.'+changedtype[1])                    
													
							.size(1000)                          
							
							.save('public/assets/upload/'+type+'/'+changedname+'.'+changedtype[1], {               
								quality : 100                    
							});
					}
					res.send({code:1,description:"", data:changedname+'.'+changedtype[1]});
				}
			});
			
			//res.write("upload success <br/>");
			
			
		//}
	});		
		//res.send(JSON.stringify(obj));	
});

router.post('/compose_save', function(req, res) {
	var params = req.body;
	//console.log(params);
	//console.log(params.group_id.join());
	//res.send("ok");
	//return;
	message_model.compose_save(params, function(err,inserted_id) {
		if(err)
		{
			res.send({status:"0", description:err});
		}
		else{
			res.send({status:"1", description:"success",msg_id:inserted_id});
		}
	});
});
router.post('/set_files', function(req, res) {
	var params = req.body;
	//console.log(params);
	message_model.set_files(params, function(err, data) {
		if(err)
		{
			res.send({status:"0", description:err});
		}
		else{
			res.send({status:"1", description:"success"});
		}
	});
});


router.get('/sent', function(req, res) {
	var sort_col = (typeof req.query.sortedCol == "undefined" ) ? "0":req.query.sortedCol;
	var sort_dir = (typeof req.query.sortedDir == "undefined" ) ? "desc":req.query.sortedDir;
	var pl = (typeof req.query.display == "undefined" ) ? "10":req.query.display;
	var pstart = (typeof req.query.start == "undefined" ) ? "0":req.query.start;
	var psearch = (typeof req.query.search == "undefined" ) ? "":req.query.search;
	if(!req.xhr)
	{
		res.render('admin/index.ejs', {
			session:req.session,
			bodypage 	: 'sentemail.ejs',	
			sortedCol :sort_col,
			sortedDir :sort_dir,
			display:pl,
			start:pstart,
			search:psearch
		});	
	}else{
		res.render('admin/sentemail',{
			session:req.session,
			sortedCol :sort_col,
			sortedDir :sort_dir,
			display:pl,
			start:pstart,
			search:psearch
		});
	}
			
});

router.get('/sentemaillist', function(req, res) {
	var params ={query_str:req.query};
	message_model.get_sentemail(params, function(err, data) { 	
		res.send(data);
	});
});

router.get('/sentemailbyId/:id', function(req, res) {
	//console.log("");
	var settings = {};
	var page = [];
	var output = function() {
		//console.log(page);
		if(!req.xhr)
		{
			res.render('admin/index.ejs', {
				session:req.session,
				bodypage 	: 'sentemailbyid.ejs',
				page			: page,
				msg_id:req.params.id 
			});	
		}else{
			res.render('admin/sentemailbyid',{
				session:req.session,
				page	: page,
				msg_id:req.params.id 
			});
		}
	}
	var showerror = function(err) {
		res.send("Error " + err.message);return;
	}
	
	message_model.msg_detail(req.params.id ,function(err, data) {
			if(err)
			{
				console.log(err);
				res.redirect('/admin/message/sent/');
				//showerror(err);
				return;
			}else{
				//console.log(data);
				if(!data || data.length == 0){				
						res.redirect('/admin/message/sent/');
						return;
				}else{
					page =data;	
					output();
				}
			}
		});
});


router.get('/conversation', function(req, res) {
	var lock = 1;
	var page = {};
	var output = function() {
		var sort_col = (typeof req.query.sortedCol == "undefined" ) ? "0":req.query.sortedCol;
		var sort_dir = (typeof req.query.sortedDir == "undefined" ) ? "desc":req.query.sortedDir;
		var pl = (typeof req.query.display == "undefined" ) ? "10":req.query.display;
		var pstart = (typeof req.query.start == "undefined" ) ? "0":req.query.start;
		var psearch = (typeof req.query.search == "undefined" ) ? "":req.query.search;
		if(!req.xhr)
		{
			res.render('admin/index.ejs', {
				session:req.session,
				bodypage 	: 'conversation.ejs',
				page			: page,
				sortedCol :sort_col,
				sortedDir :sort_dir,
				display:pl,
				start:pstart,
				search:psearch
			});	
		}else{
			res.render('admin/conversation',{
				session:req.session,
				page			: page,
				sortedCol :sort_col,
				sortedDir :sort_dir,
				display:pl,
				start:pstart,
				search:psearch
			});
		}
	}
	var showerror = function(err) {
		res.send("Error " + err.message);return;
	}
	
		message_model.select_user(function(err, data) {
			if(err)
			{
				showerror(err);
			}
			page['user'] = data;
			
			lock -= 1;
		
			if(lock === 0 )
			{
				output();
			}
			
		});
			
});


router.get('/messagebyuserid', function(req, res) {
	var params ={query_str:req.query};
	//console.log("params");
	//console.log(params);
	message_model.conversationbyuserid(params, function(err, data) { 	
		res.send(data);
	});	
});



router.get('/messagedetailforconversation/:id',function(req,res){
//console.log(req.protocol+"://"+req.headers.host);
	var lock = 1;
	var page = {};
	var messagebody = {};
	var output = function() {
		//console.log(page);
		if(!req.xhr)
		{
			res.render('admin/index.ejs', {
				session:req.session,
				bodypage 	: 'conversationdetail.ejs',
				page			: page,
				//messagebody	: messagebody
			});	
		}else{
			res.render('admin/conversationdetail',{
				session:req.session,
				page	: page,
				//messagebody	: messagebody
			});
		}
	}
	var showerror = function(err) {
		res.send("Error " + err.message);return;
	}
	
	message_model.messagedetailforconversation(req.params.id,function(err, data) {
		if(err)
		{
			console.log(err);
			res.redirect('/admin/message/conversation/');
					return;
			//showerror(err);
		}else{
			
			if(!data || data.length == 0){				
					res.redirect('/admin/message/conversation/');
					return;
			}else{
				page['conversation'] = data[0];
				page['c_message'] = data[1];
				page['maxid'] = data[2][0].max_id;
				
				lock -= 1;
			
				if(lock === 0 )
				{
					output();
				}
			}
			
		}
	});
});



router.post('/conversationDetailFiles', function(req, res) {
	var params = req.body;
	message_model.conversationDetailFiles(params, function(err, data) {
		if(err)
		{
			res.send({status:"0", description:err});
		}
		else{
			res.send({status:"1", description:"success"});
		}
	});
});




router.post('/saveHrReplyMessage', function(req, res) {
	var params = req.body;
	message_model.saveHrReplyMessage(params, function(err, data,inserted_id) {
		if(err)
		{
			res.send({status:"0", description:err});
		}
		else{
			res.send({status:"1", description:"success",msg_id:inserted_id});
		}
	});
});

router.post('/searchCMForseemore', function(req, res) {
	var params = req.body;
	var page={};
	message_model.searchCMForseemore(params, function(err, data) {
		page['c_message'] = data;
		res.render('admin/seemore', {
				session:req.session,
				page	: page
			});	
	});	
});


//answer
router.get('/answer', function(req, res) {
	var ans = (typeof req.query.ans_type == "undefined" ) ? "":req.query.ans_type;
	var f_date = (typeof req.query.from == "undefined" ) ? "":req.query.from;
	var t_date = (typeof req.query.to == "undefined" ) ? "":req.query.to;
	var kw = (typeof req.query.keyword == "undefined" ) ? "":req.query.keyword;
	var sort_col = (typeof req.query.sortedCol == "undefined" ) ? "0":req.query.sortedCol;
	var sort_dir = (typeof req.query.sortedDir == "undefined" ) ? "desc":req.query.sortedDir;
	var pl = (typeof req.query.display == "undefined" ) ? "10":req.query.display;
	var pstart = (typeof req.query.start == "undefined" ) ? "0":req.query.start;
	if(!req.xhr)
	{
		res.render('admin/index.ejs', {
			session:req.session,
			bodypage 	: 'answer.ejs',	
			ans_type :ans,
			fromdt :f_date,
			todt :t_date,
			keyword :kw,
			sortedCol :sort_col,
			sortedDir :sort_dir,
			display:pl,
			start:pstart
		});	
	}else{
		res.render('admin/answer',{
			session:req.session,
			ans_type :ans,
			fromdt :f_date,
			todt :t_date,
			keyword :kw,
			sortedCol :sort_col,
			sortedDir :sort_dir,
			display:pl,
			start:pstart
		});
	}
			
});
router.get('/report_search', function(req, res) {
	var params ={query_str:req.query};
	message_model.conversationbyuserid(params, function(err, data) { 	
		res.send(data);
	});
});
router.get('/answerlist', function(req, res) {
	var params ={query_str:req.query};
	message_model.answerlist(params, function(err, data) { 	
		res.send(data);
	});
});
router.get('/get_ansdata', function(req, res) {
	var filter_data ={query_str:req.query};
	message_model.answer_data(filter_data,function(err, data) { 
		return res.json({code:1,results: data});
	});
});
router.get('/answerbyId/:id', function(req, res) {
	//console.log("");
	var lock = 1;
	var settings = {};
	var page = [];
	var output = function() {
		
		if(!req.xhr)
		{
			res.render('admin/index.ejs', {
				session:req.session,
				bodypage 	: 'answerbyid.ejs',
				page			: page
			});	
		}else{
			res.render('admin/answerbyid',{
				session:req.session,
				page	: page
			});
		}
	}
	var showerror = function(err) {
		res.send("Error " + err.message);return;
	}
	
	message_model.answerbyid(req.params.id ,function(err, data) {
			if(err)
			{
				res.redirect('/admin/message/answer/');
				return;
				//console.log(err);
				//showerror(err);
			}else{
				if(!data ||data.length == 0){	
					res.redirect('/admin/message/answer/');
					return;
				}else{
					page['answer'] = data;
		
					lock -= 1;
				
					if(lock === 0 )
					{
						output();
					}
				}
			}
			
		});
});


// conversation refresh
router.get('/newreport',function(req,res){

	message_model.newreport(function(err, data) {
		if(err)
		{
			res.json({status:"0",msg:""});
		}else
		{
			res.json({status:"1",msg:data});
		}
		
	});
});
router.get('/conversationRefreshdata/:cid/:id',function(req,res){

	var lock = 1;
	var page = {};
	var messagebody = {};

	var showerror = function(err) {
		res.send("Error " + err.message);return;
	}
	//messagedetailforconversation
	message_model.getnewmsg(req.params.cid,req.params.id,function(err, data) {
		if(err)
		{
			showerror(err);
		}else{
			page['conversation'] = data[0];
			page['max'] = data[1][0].max_id;
			res.json(page);

		}
	});
});


router.get("/tousers",function(req,res){

	message_model.tousers(req.query,function(err, data){
		if(err)
		{
			show_error(err);
		}else{
			res.json({userlist:data});
		}
	});
});



router.get('/drafts', function(req, res) {
	if(!req.xhr)
	{
		res.render('admin/index.ejs', {
			session:req.session,
			bodypage 	: 'drafts.ejs',	
		});	
	}else{
		res.render('admin/drafts',{
			session:req.session
		});
	}
			
});

router.get('/draftslist', function(req, res) {
	var params ={query_str:req.query};
	message_model.draftslist(params, function(err, data) { 	
		res.send(data);
	});
});

router.post('/deleteDraft', function(req, res) {	
		var params = req.body.id;
		message_model.deleteDraft(params, function(err, data) { 		
		if(err)
		{
			res.send(err);return;
		}
		else{
			res.send(JSON.stringify(data));
		}			
	});	
});

router.get('/schedulelist', function(req, res) {
	var params ={query_str:req.query};
	message_model.schedulelist(params, function(err, data) { 	
		res.send(data);
	});
});
router.post('/deleteSchedule', function(req, res) {	
		var params = req.body.id;
		message_model.deleteSchedule(params, function(err, data) { 		
		if(err)
		{
			res.send(err);return;
		}
		else{
			res.send(JSON.stringify(data));
		}			
	});	
});
module.exports = router;