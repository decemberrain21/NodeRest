var db = require('../helpers/database');
var message_model = require('../models/message_model');
var formatDate=function (date) {
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
		
		return [year, month, day].join('-')+" "+[hour, min, sec].join(':');
	};
var generate_key = function() {
	var d = new Date(),
		month = '' + (d.getMonth()),
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
	return Math.random().toString(36).substring(7)+[year, month, day].join('')+Math.random().toString(36).substring(3)+[hour, min, sec].join('');
					
}

function generateotp (ph){
	var genotp = Math.random().toString(10).substr(2,6);
	
	/*var client = require('twilio')('AC7830139e971765f14ba642c61accf296', '91c1f94ab9402d3670ab89fbebda3c55'); 
						client.sendMessage({
							to:'+9595419183', 							
							from: '+14188008551', 
							body: genotp
						}, function(err, responseData) {
							if (!err) { 
								console.log(responseData.from);
								console.log(responseData.body);
							}
	});*/
	return genotp;
	
}
exports.inboxdataforapi = function(obj,cb){
	var result = [];
	//var str = "SELECT * FROM message WHERE id IN (SELECT msg_id FROM inbox WHERE user_id = '"+obj.user_id+"' AND `date` BETWEEN '"+ c +"' AND '"+ obj.dateto +"' )";
	var str = "SELECT msg_id AS meessageId, inbox.title, inbox.`date`, `type`, is_question AS isQuestion, is_answered AS isAnswered, is_read AS isRead, is_notified AS isNotified FROM inbox JOIN message ON inbox.msg_id = message.id  WHERE message.is_drafts = 0 AND user_id = '"+obj.user_id+"' ORDER BY inbox.`date` DESC LIMIT "+obj.offset+','+obj.limit;
	//console.log(str);
	str +=";UPDATE `inbox` SET is_notified =1 WHERE user_id ='"+obj.user_id+"';UPDATE `user` SET last_update = NOW() WHERE login_token='"+obj.login_token+"';";
	db.getConnection(function(err, connection){
		var i= connection.query(str, function(err, results) {
			connection.release();
			if (err) {
				cb(err, null);
		  	}else {				
		  		cb(null, results[0]);
		  	}
		});
    });

}
exports.clearnoti_token = function(obj,cb){
	var result = [];
	//var str = "SELECT * FROM message WHERE id IN (SELECT msg_id FROM inbox WHERE user_id = '"+obj.user_id+"' AND `date` BETWEEN '"+ c +"' AND '"+ obj.dateto +"' )";
	var str = "";
	//console.log(str);
	str +="UPDATE `user` SET noti_token = NULL,last_update = NOW() WHERE employee_id = '"+obj.user_id+"'";
	db.getConnection(function(err, connection){
		var i= connection.query(str, function(err, results) {
			connection.release();
			if (err) {
				cb(err, null);
		  	}else {				
		  		cb(null, results);
		  	}
		});
    });

}
exports.myconversation = function(obj,cb){
	var result = [];
	//var str = "SELECT * FROM message WHERE id IN (SELECT msg_id FROM inbox WHERE user_id = '"+obj.user_id+"' AND `date` BETWEEN '"+ c +"' AND '"+ obj.dateto +"' )";
	//[{"c_id":2,"user_id":"w4tpneolprtppeprq","subject":"Report Api Test 1","is_read":null,"is_notified":null,"created_date":"2016-10-21 16:14:08","last_update":"2016-10-21 16:14:08","is_anonymous":1}]
	var str = " SELECT  `c_id` AS reportId ,`subject`,`last_update` ,is_anonymous AS isAnonymous,(SELECT COUNT(id) FROM conversation_message WHERE conversation_message.c_id=conversation.c_id AND sender='hr' AND is_read = 0) AS `unread` FROM `conversation` WHERE conversation.user_id= '"+obj.user_id+"' GROUP BY conversation.`c_id` ORDER BY last_update  DESC LIMIT "+obj.offset+","+obj.limit;
	console.log(str);
	str += ";UPDATE `user` SET last_update = NOW() WHERE login_token='"+obj.login_token+"';";
	
	db.getConnection(function(err, connection){
		var i= connection.query(str, function(err, results) {
			connection.release();
			if (err) {
				cb(err, null);
		  	}else {				
		  		cb(null, results[0]);
		  	}
		});
    });

}
exports.myconversation_new = function(obj,cb){
	var result = [];
	//var str = "SELECT * FROM message WHERE id IN (SELECT msg_id FROM inbox WHERE user_id = '"+obj.user_id+"' AND `date` BETWEEN '"+ c +"' AND '"+ obj.dateto +"' )";
	//[{"c_id":2,"user_id":"w4tpneolprtppeprq","subject":"Report Api Test 1","is_read":null,"is_notified":null,"created_date":"2016-10-21 16:14:08","last_update":"2016-10-21 16:14:08","is_anonymous":1}]
	var str = " SELECT `c_id` AS reportId ,`subject`,`last_update` ,is_anonymous AS isAnonymous,(SELECT COUNT(id) FROM conversation_message WHERE conversation_message.c_id=conversation.c_id AND sender='hr' AND is_read = 0) AS `unread` FROM `conversation` WHERE conversation.user_id= '"+obj.user_id+"' AND last_update >'"+obj.last_update+"' GROUP BY conversation.`c_id` ORDER BY last_update  DESC ";
	console.log(str);
	str += ";UPDATE `user` SET last_update = NOW() WHERE login_token='"+obj.login_token+"';";
	
	db.getConnection(function(err, connection){
		var i= connection.query(str, function(err, results) {
			connection.release();
			if (err) {
				cb(err, null);
		  	}else {				
		  		cb(null, results[0]);
		  	}
		});
    });

}


exports.Searchmessagedetail = function(data,cb){
	var result = [];
	var str = "SELECT message.*,inbox.is_answered FROM message JOIN inbox ON inbox.msg_id = message.id WHERE user_id = '"+ data.user_id+"' AND msg_id = '" + data.msg_id+"';";
	str += "UPDATE `user` SET last_update = NOW() WHERE login_token='"+data.login_token+"';";
	//str += "UPDATE `inbox` SET is_read=1 WHERE msg_id = '" + data.msg_id+"';";

	db.getConnection(function(err, connection){
		connection.query(str, function(err, results) {
			connection.release();
			if (err) {
				cb(err, null);
		  	}else {				
		  		cb(null, results[0]);
		  	}
		});
    });
}

exports.getMessageDetails = function(data,cb){
 var hostname = data.hostname;
	var result = [];
	var str = "SELECT message.id, message.title,message.date,message.type,message.data,inbox.is_answered,answer.answer FROM message JOIN inbox ON inbox.msg_id = message.id left JOIN answer ON answer.msg_id=message.id AND answer.user_id=inbox.user_id WHERE inbox.user_id = '"+ data.user_id+"' AND inbox.msg_id = '" + data.msg_id+"';";
	//console.log(str);
	str += "UPDATE `user` SET last_update = NOW() WHERE login_token='"+data.login_token+"';";
	str += "UPDATE `inbox` SET is_read=1,is_notified=1 WHERE msg_id = '" + data.msg_id+"' AND user_id = (SELECT employee_id FROM `user` WHERE login_token = '"+data.login_token+"');";

	db.getConnection(function(err, connection){
		connection.query(str, function(err, results) {
			connection.release();
			if (err) {
				cb(err, null);
		  	}else {		
			var page={};
			//console.log(results);
			var data = results[0][0].data;
			//start 
			var res_data= results[0][0].data;
			var rep_str = res_data.replace(/[\\]/g, '\\\\')
			.replace(/[']/g, "\\'")
			.replace(/[\/]/g, '\\/')
			.replace(/[\b]/g, '\\b')
			.replace(/[\f]/g, '\\f')
			.replace(/[\n]/g, '\\n')
			.replace(/[\r]/g, '\\r')
			.replace(/[\t]/g, '\\t');
			rep_str = eval("'"+rep_str+"'");
			
			var parseData =JSON.parse(rep_str);
			page['id'] = results[0][0].id;
			page['title'] = results[0][0].title;
			page['date'] = results[0][0].date;
			page['type'] = results[0][0].type;
			page['message'] = parseData.message;
			page['files'] = parseData.files;
			page['links'] = parseData.links;
			page['question'] = parseData.qa;
			page['answerType'] = parseData.ans_type;
			page['files'] = parseData.files;
			page['answers'] = parseData.options;
			page['n_a'] = parseData.n_a;
			
			page['submittedAnswer'] = results[0][0].answer;
			page['hostname'] =hostname;
			//console.log(page);
		  		cb(null, page);
		  	}
		});
    });

}

exports.savingcomposemessage = function(obj,cb){
	var result = [];
	var subject = obj.subject
		if(subject == ""){
			subject = new Date();
		}
		
	var anonymous = obj.anonymous;
	var is_anonymous = 1;
	//console.log(">>>>>>>>>");
	console.log(obj);
	if(anonymous === false || anonymous == "false"){
		is_anonymous = 0;
	}	
	var conversation = {
		user_id : obj.user_id,
		subject : subject,
		is_anonymous : is_anonymous
	}
	var str = "INSERT INTO `conversation` SET ?";
	db.getConnection(function(err, connection){
		var i = connection.query(str, conversation, function(err, results) {
			if (err) {
				connection.release();
				cb(err, null);
				return;
		  	}else {				
		  		var conversation_message = {
					type 	: obj.type,
					data 	: obj.postdata,
					sender	: "user",
					c_id	: results.insertId
				}
				var nextstr = "INSERT INTO `conversation_message` SET ?"
				connection.query(nextstr, conversation_message, function(err2, result2) {
					connection.release();
					if (err2) {
						cb(err2, null);
					}else {				
						var cm_id =   result2.insertId;
						cb(err2, result2,cm_id);
					}
				});
		  	}
		  
		});//console.log(i.sql);
    });

}

exports.api_set_files = function(params, cb) {
	
	db.getConnection(function(err, connection){		
		
		var myquery = connection.query("SELECT `data` FROM conversation_message WHERE id = '"+ params.id+"'", function(err, result) {
		  if (err) {
				connection.release();
				cb(err, null);
				return;
		  	}
			else
			{
				json_data = JSON.parse(result[0].data);
				json_data['files'] = params.names.join();
				//console.log(json_data);
				data_str = JSON.stringify(json_data);
				str_query  = "UPDATE conversation_message SET `data` ='"+data_str+"' WHERE id = '"+ params.id+"';";	
				//console.log(str_query);
					connection.query(str_query , function(err, result) {   
					connection.release();			
					if (err) {
						cb(err, {});
						return;
					}
					cb(err, result);
				});
			}
		});//console.log(myquery);
		//console.log("string >>> "+string);
		
	});
}


exports.save_survey = function(obj, cb) {

	var result = [];
	var conversation = {
		user_id : obj.userid,		
		msg_id : obj.msg_id,		
		question : obj.qa,		
		answer : obj.ans,		
		subject	:obj.subject,
		ans_type : obj.ans_type
	}
	
	
	db.getConnection(function(err, connection){	
	var i = connection.query("SELECT * FROM answer WHERE user_id ='"+obj.user_id+"' and msg_id='"+obj.msg_id+"'", function(err, result) {
		
		if (err) {
			connection.release();
			cb(err, null);
		}
		else{
			if(result.length == 0)
			{
				var str = "INSERT INTO `answer`(user_id,msg_id,answer,`subject`,`question`,ans_type) VALUES ('"+obj.user_id+"','"+obj.msg_id+"',"+connection.escape(obj.ans)+","+connection.escape(obj.subject)+","+connection.escape(obj.qa)+","+connection.escape(obj.ans_type)+");";
				//console.log(str);
				str +="Update inbox set is_answered = 1 where msg_id = '"+obj.msg_id+"' and user_id = '"+obj.user_id+"'; ";
				str += "UPDATE `user` SET last_update = NOW() WHERE login_token='"+obj.login_token+"';";
				console.log(str);
				connection.query(str,  function(err2, result2) {
					connection.release();
					if (err2) {
						cb(err2, null);
					}else {				
						//var cm_id =   result2.insertId;
						cb(err2, result2[0]);
					}
				});	  
			}
			else
			{
				connection.release();
				cb(err, null);
			}
		}
		
	});//console.log(i.sql);
		
	});  
}



exports.search_replyfromuser = function(obj,cb){
	var result = [];
	var c_id = obj.c_id;
	var offset = obj.offset;
	var limit = obj.limit;
	
	var	nextstr = "  UPDATE `conversation_message`  SET is_read = 1  WHERE id IN   (SELECT id FROM (SELECT id FROM conversation_message WHERE c_id ="+ c_id +" AND sender='hr' ) AS u); ";
	nextstr += "SELECT * FROM (SELECT * FROM `conversation_message` WHERE c_id ="+ c_id +" ORDER BY id  DESC LIMIT "+ limit +" OFFSET "+ offset +" )AS CONV  ORDER BY id ASC; ";
	 
	//console.log(nextstr);	
	nextstr += "UPDATE `user` SET last_update = NOW() WHERE login_token='"+obj.login_token+"';";
	//result[0][0]["photo"] = obj.myhost+"assets/upload/users/"+result[0][0]["photo"];  
	db.getConnection(function(err, connection){
		var i = connection.query(nextstr, function(err2, result) {
			connection.release();
			if (err2) {
				cb(err2, null);
			}else {		
				
				cb(err2, result[1]);
			}
		});//console.log(i.sql);
    });
}
exports.checktoken = function(token,cb){
	
	var nextstr = "SELECT * FROM `user` WHERE login_token ='"+ token +"' AND `active` = 1 AND is_deleted = 0 ";
	db.getConnection(function(err, connection){
		var i = connection.query(nextstr, function(err2, result) {
			connection.release();
			if (err2) {
				cb(err2, null);
			}else {	
				cb(err2, result);
			}
		});console.log(i.sql);
    });
}


exports.check_user = function(c_id,u_id,cb){
	
	var nextstr = "SELECT * FROM conversation WHERE c_id ='"+c_id+"' AND user_id='"+ u_id +"'";
	db.getConnection(function(err, connection){
		var i = connection.query(nextstr, function(err2, result) {
			connection.release();
			if (err2) {
				cb(err2, null);
			}else {	
				cb(err2, result);
			}
		});//console.log(i.sql);
    });
}


exports.conversationreplybyuser = function(obj,cb){
	
	var result = [];
	var newdate = formatDate(new Date());
	var nextstr ="UPDATE `conversation` SET `last_update` = '"+ newdate+"' WHERE c_id = '"+ obj.c_id+"';";
	nextstr += "UPDATE `user` SET last_update = NOW() WHERE login_token='"+obj.login_token+"';";
	var conversation_message = {
					type 	: obj.type,
					data 	: obj.data,
					sender	: "user",
					c_id	: obj.c_id,
					date : newdate
				}
	nextstr += "INSERT INTO `conversation_message` SET ?"
	db.getConnection(function(err, connection){
		
	//	nextstr += "INSERT INTO `conversation_message`(`type`,`data`,`sender`,`c_id`,`date`) VALUES ('"+obj.type+"','"+obj.postdata+"','user','"+obj.c_id+"','"+newdate+"')";

		var w = connection.query(nextstr, conversation_message, function(err2, result2) {
			connection.release();
			if (err2) {
			//console.log(err2);
				cb(err2, null);
			}else {		
				var cm_id =   result2[2].insertId;
				cb(err2,cm_id);
			}
		});//console.log(w.sql);
    });
}


exports.checkMsgandToken = function(token,msg_id,cb){
	
	
	var nextstr = "SELECT * FROM inbox WHERE user_id = (SELECT employee_id FROM `user` WHERE login_token = '"+ token +"') AND msg_id="+msg_id;
	db.getConnection(function(err, connection){
		var i = connection.query(nextstr, function(err2, result) {
			connection.release();
			if (err2) {
				cb(err2, null);
			}else {	
				cb(err2, result);
			}
		});console.log(i.sql);
    });
}

exports.uploadforuserconversationreply = function(params, cb) {
	
	db.getConnection(function(err, connection){		
		
		var myquery = connection.query("SELECT `data` FROM conversation_message WHERE id = '"+ params.id+"'", function(err, result) {
		  if (err) {
				connection.release();
				cb(err, null);
				return;
		  	}
			else
			{
				
				var res_data= result[0].data;
				var rep_str = res_data.replace(/[\\]/g, '\\\\')
				.replace(/[']/g, "\\'")
				.replace(/[\/]/g, '\\/')
				.replace(/[\b]/g, '\\b')
				.replace(/[\f]/g, '\\f')
				.replace(/[\n]/g, '\\n')
				.replace(/[\r]/g, '\\r')
				.replace(/[\t]/g, '\\t');
				
				rep_str = rep_str.substr(0,rep_str.length-1);
				rep_str += ',"files":"'+params.names.join()+'"}';
				str_query  = "UPDATE conversation_message SET `data` ='"+rep_str+"' WHERE id = '"+ params.id+"';";	
				
				//console.log(str_query);
					connection.query(str_query , function(err, result) {   
					connection.release();			
					if (err) {
						cb(err, {});
						return;
					}
					cb(err, result);
				});
			}
		});//console.log(myquery);
		//console.log("string >>> "+string);
		
	});
}

exports.saveUserCompose = function(obj,login_token,cb){
	//only create a query for conversation
	var formatmyDate=function (date) {
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
		
		return [day, month,year].join('/');
	};
	var subject = obj.subject;
	//var count="";
	db.getConnection(function(err, connection){
		var firststr = "SELECT CONCAT('Report',' ',DATE(NOW()),' ', LPAD(COUNT(c_id)+1,3,0)) AS num FROM conversation WHERE user_id = '"+obj.user_id+"' AND DATE(created_date) =DATE(NOW()) AND blank_report = 1";
		//console.log(firststr);
		connection.query(firststr, function(err, result) {
				
				if (err) {
					connection.release();
					cb(err, null);
				}else {
					//console.log(result[0].num);
					//var countmessage = result[0].num + 1;
					var blank_report = 0;
					if(subject == ""){
						blank_report = 1;
						//subject = "Report " +formatmyDate(new Date())+ " 00"+countmessage;
						subject = result[0].num;
					}
					//console.log(subject);
					//get report count
					//Reprot dd/mm/yyyy ()
					var anonymous = obj.anonymous;console.log(anonymous);	
					var is_anonymous = 1;

					if(anonymous === false || anonymous == "false"){
						is_anonymous = 0;
					}	
					var newdate = formatDate(new Date());
					var conversation = {
						user_id : obj.user_id,
						subject : subject,
						is_anonymous : is_anonymous,
						created_date : newdate,
						last_update:newdate,
						blank_report :blank_report
					}
					//(user_id,subject,is_anonymous,created_date,last_update) VALUES ('"+obj.user_id+"','"+subject+"','"+is_anonymous+"','"+newdate+"','"+newdate+"')
					var str = "UPDATE `user` SET last_update = NOW() WHERE login_token='"+login_token+"';";
					str += "INSERT INTO `conversation` set ?";

					//conversation['subject'] = connection.escape(conversation['subject']);
						var w = connection.query(str,conversation, function(err2, result2) {
							connection.release();
							if (err2) {
								cb(err2, null);
							}else {				
								var cm_id =   result2[1].insertId;
								cb(err2, result2,cm_id);
							}
						});//console.log(w.sql);
				}
		});
		
    });
	
}


exports.mactingUserAndMessage=function(obj, cb){
	var msg_id = obj.msgId;
	var user_id  = obj.userId;
	var str = "SELECT * FROM inbox WHERE msg_id='"+ msg_id +"' AND user_id = '"+ user_id +"' ; ";
	db.getConnection(function(err, connection){
		var w = connection.query(str, function(err, result) {
			connection.release();
			if (err) {
				cb(err, null);
			}else {
				cb(err, result);
			}
		});//console.log(w.sql);
    });
}


exports.admin_verify = function(user,cb) {
	
	var md5	= require('md5');
	//console.log(user);
	var str = "SELECT * FROM `user` WHERE `active` = 1 AND is_deleted =0 AND `email` = '"+ user.name +"' AND `cms_password` = '"+ md5(user.password) +"' ";	
	//console.log(str);
	var key = "";
	db.getConnection(function(err, connection){
		
		
		connection.query(str, function(err, result){
			if(result.length>0)
			{
				var my_query = "";
				var first_time = "no";
				//console.log(result[0].login_token);
				if(result[0].login_token)
				{
					key = result[0].login_token;
					my_query = "UPDATE `user` SET noti_token ='"+user.noti_token +"',last_update = NOW() WHERE employee_id = '"+result[0].employee_id+"'";
				}
				else
				{
					//Input Welcome Message by yzt ;)
					var msg1 = "Shwe Taung Connect မွ ၾကိဳဆိုပါသည္။\\n\\nသင္သည္ ေရႊေတာင္၀န္ထမ္းမ်ားအားလံုးအတြက္ ဖြဲ႕စည္းေပးထားသည့္ Shwe Taung Connect ၏ အဖြဲ႔၀င္သစ္တစ္ဦး ျဖစ္သြားျပီျဖစ္ပါသည္။ ေရႊေတာင္၌ ျဖစ္ပြားေနေသာ အေၾကာင္းအရာမ်ား၊ ေရႊေတာင္၏ သတင္းအခ်က္အလက္အသစ္မ်ားႏွင့္ အျခားေသာ သတင္းမ်ားကို Shwe Taung Connect တြင္ သိရွိႏိုင္ပါသည္။\\n\\nသင္သည္ ေရႊေတာင္ႏွင့္ပတ္သက္သည့္ သတင္းမ်ားႏွင့္ အဆက္အသြယ္မျပတ္ ရွိေနမည္ျဖစ္သည္။\\n\\nWelcome to Shwe Taung Connect!\\n\\nYou are the new member of “Shwe Taung Connect”, a community for all Shwe Taung employees. “Shwe Taung Connect” is all about what’s happening right now at Shwe Taung. You will find up-to-date information about Shwe Taung and many other news here.\\n\\nYou will never be out of the loop anymore.";
					var msg2 = "User Guide Message\\n\\nShwe Taung Connect တြင္ လက္ရွိ ၌ Message ႏွင္႔ Report ဟူ၍ Function ႏွစ္ခုရွိသည္။ Message တြင္ စာသား၊ ဓာတ္ပံု၊ အသံဖိုင္၊ video ဖိုင္၊ link ႏွင့္ စစ္တမ္းေကာက္ယူမႈမ်ား ပါ၀င္မည္ျဖစ္သည္။ ဤပံုစံမ်ားျဖင့္ ေရႊေတာင္၏ သတင္းအခ်က္အလက္မ်ားကို အသိေပးသြားမည္ျဖစ္ၿပီး စစ္တမ္းေကာက္ယူမွုမ်ားတြင္ သင့္အေနျဖင့္ ပါ၀င္ရန္ လိုအပ္ပါသည္။\\nReport တြင္ Code of Conduct ႏွင့္ ေဘးအႏ ၱရာယ္ကင္းရွင္းေရးဆိုင္ရာ စည္းကမ္းလိုက္နာရန္ပ်က္ကြက္မႈမ်ားအတြက္ report တင္ျပႏိုင္ပါသည္။ သင့္အေနျဖင့္ အမည္ႏွင္႔တကြ (Normal Report) သို႔မဟုတ္ အမည္မပါဘဲ (Anonymous Report) ျဖင့္တင္ျပႏိုင္ပါသည္။ Anonymous report တင္ပါက သင္၏ report အား အမည္မေဖာ္ျပဘဲ လက္ခံရရွိမည္ျဖစ္ျပီး ေပးပို႔သူအား မသိရွိႏိုင္ပါ။\\n\\n“Shwe Taung Connect” currently has 2 functions: Messages and Reporting. Messages might be in the form of text, image, audio, video and even in a survey form. This is how you will be informed of anything that happens at Shwe Taung and you will be included in all surveys.\\nWith the Report function, you can report safety violations or breaches of the Code of Conduct. You can decide if you want to report anonymously or by using your own name. If you decide to go anonymous, nobody will know where your report comes from.";
					var msg3 = "User Engagement Score Calculation\\n\\nဤ application အား အသံုးျပဳျခင္း၊ messages မ်ားအား ဖတ္ရွူျခင္း၊ စစ္တမ္းေကာက္ယူမႈမ်ားတြင္ ပါ၀င္ေျဖဆိုျခင္းျဖင့္ သင္၏ Point ရမွတ္မ်ား တိုးလာမည္ ျဖစ္သည္။\\nျခြင္းခ်က္။ ။ Report တင္ျခင္းျဖင့္ သင္၏ Point ရမွတ္ တိုးမည္ မဟုတ္ပါ။\\n\\nThe more you use the app, the more you check the messages, the more surveys you participate to, the higher your score will be.\\nPlease Note: Reports do not contribute to the engagement score.";
					var msg4 = "Go and Change the password\\n\\nအေကာင့္အား Login ဝင္ၿပီးသည္ႏွင့္ default password အားေၿပာင္းလဲေပးပါ။ Password ေၿပာင္းရန္ Profile Tab သို႔သြားပါ။ Profile ညာဘက္အေပၚေထာင့္တြင္ password ေၿပာင္းလဲရန္ ခလုတ္ကိုႏွိပ္ကာ password ေၿပာင္းလဲေသာ စာမ်က္ႏွာသို႔သြားႏိုင္ပါသည္။\\n\\nPlease change your default password once you have logged into your account. To change your password, go to the Profile tab and on the top right corner you will find the change password button. Press it to get to the change password page..";
					var msg5 = "You can downlod Userguide here.";
					var file = "Userguide.pdf";
					var noti1 = "Welcome to Shwe Taung Connect";
					var noti2 = "“Shwe Taung Connect” currently has";
					var noti3 = "The more you use the app,";
					var noti4 = "Please change your default password";
					var noti5 = "User guide";
					var param1 = {
						to: [result[0].employee_id],
						group_id : '',
						g_i : '1',
						type : '',
						title : 'Welcome to Shwe Taung Connect',
						message : "'"+noti1+"'",
						postdata : '{"message":"'+msg1+'","n_a":"0"}',
						is_answered : '',
						n_a : '0',
						is_drafts : '0',
						is_schedule : '0',
						state : 'compose',
						draft_id : ''
					};
					var param2 = {
						to: [result[0].employee_id],
						group_id : '',
						g_i : '1',
						type : '',
						title : 'User Guide Message',
						message : "'"+noti2+"'",
						postdata : '{"message":"'+msg2+'","n_a":"0"}',
						is_answered : '',
						n_a : '0',
						is_drafts : '0',
						is_schedule : '0',
						state : 'compose',
						draft_id : ''
					};
					var param3 = {
						to: [result[0].employee_id],
						group_id : '',
						g_i : '1',
						type : '',
						title : 'User Engagement Score Calculation',
						message : "'"+noti3+"'",
						postdata : '{"message":"'+msg3+'","n_a":"0"}',
						is_answered : '',
						n_a : '0',
						is_drafts : '0',
						is_schedule : '0',
						state : 'compose',
						draft_id : ''
					};
					var param4 = {
						to: [result[0].employee_id],
						group_id : '',
						g_i : '1',
						type : '',
						title : 'Go and change the password',
						message : "'"+noti4+"'",
						postdata : '{"message":"'+msg4+'","n_a":"0"}',
						is_answered : '',
						n_a : '0',
						is_drafts : '0',
						is_schedule : '0',
						state : 'compose',
						draft_id : ''
					};
					var param5 = {
						to: [result[0].employee_id],
						group_id : '',
						g_i : '1',
						type : 'file',
						title : 'User Guide',
						message : "'"+noti5+"'",
						postdata : '{"message":"'+msg5+'","n_a":"0","files":"'+file+'"}',
						is_answered : '',
						n_a : '0',
						is_drafts : '0',
						is_schedule : '0',
						state : 'compose',
						draft_id : ''
					};					
						message_model.compose_save(param1, function(err, data) {
							if(err){
								console.log(err);
							}else{
								console.log(data);
							}
						});
						message_model.compose_save(param2, function(err, data) {
							if(err){
								console.log(err);
							}else{
								console.log(data);
							}
						});
						message_model.compose_save(param3, function(err, data) {
							if(err){
								console.log(err);
							}else{
								console.log(data);
							}
						});
						message_model.compose_save(param4, function(err, data) {
							if(err){
								console.log(err);
							}else{
								console.log(data);
							}
						});
						message_model.compose_save(param5, function(err, data) {
						if(err){
							console.log(err);
						}else{
							console.log(data);
						}
						});
					//Input Welcome Message by yzt ;)
					key = generate_key();
					my_query = "UPDATE `user` SET noti_token ='"+user.noti_token +"',login_token='"+key+"',first_login_date = NOW(),last_update = NOW() WHERE employee_id = '"+result[0].employee_id+"'";
					first_time = "yes";
				}
				
				//my_query = "UPDATE `user` SET noti_token ='"+user.noti_token +"',login_token='"+key+"',last_update='"+formatDate(new Date())+"' WHERE employee_id = '"+result[0].employee_id+"'";

				//console.log(my_query);
				//cb(null, {user:result});
				//SELECT * FROM user_token WHERE device_id ='$device_id' AND user_id ='$user_id'
				connection.query(my_query, function(err, result){
					connection.release();
					if(!err){				
						cb(null, {login_token:key,first_login:first_time});
					}else{
						cb(err, null);
					}
				});
			}else
			{
				connection.release();
				if(!err){				
					cb(null, {login_token:null});
				}else{
				
				}
			}
			
		});
	});
}
exports.admin_verify_new = function(user,cb) {
	
	var md5	= require('md5');
	//console.log(user);
	var str = "SELECT * FROM `user` WHERE `active` = 1 AND otp_password IS NOT NULL AND first_login_date IS NOT NULL AND login_token IS NOT NULL AND is_deleted =0 AND `email` = '"+ user.name +"' AND `cms_password` = '"+ md5(user.password) +"' ";	
	//console.log(str);
	var key = "";
	db.getConnection(function(err, connection){	
		
		connection.query(str, function(err, result){
			if(result.length>0)
			{
				var my_query = "";
								
				key = generate_key();
				my_query = "UPDATE `user` SET noti_token ='"+user.noti_token +"',login_token='"+key+"',last_update = NOW() WHERE employee_id = '"+result[0].employee_id+"'";
				
				connection.query(my_query, function(err, result){
					connection.release();
					if(!err){				
						cb(null, {login_token:key});
					}else{
						cb(err, null);
					}
				});
			}else
			{
				connection.release();
				if(!err){				
					cb(null, {login_token:null});
				}else{
					cb(err, {login_token:null});
				}
			}
			
		});
	});
}

exports.updatePassword = function(obj,cb){
	var md5			= require('md5');
	var pwd;
		
	/*	login_token:$('#login_token').val(),
		new_password1 : $('#new_password1').val(),
		new_password2 : $('#new_password2').val(),				
		cms_password : $('#cms_password').val()*/
		

	var first_query = "select * from `user` where login_token='"+obj.login_token+"' and cms_password='"+md5(obj.cms_password)+"';";	
		console.log("first_query");
				//console.log(first_query);	
	db.getConnection(function(err, connection){
		connection.query(first_query, function(err, result){
	
			if(result.length>0)
			{
				pwd = md5(obj.new_password);		
			
				var snd_query = "UPDATE `user` SET cms_password ='"+ pwd+"',last_update = NOW() WHERE login_token='"+obj.login_token+"';";
				//console.log("snd_query");
				//console.log(snd_query);
				connection.query(snd_query, function(err, result){
					connection.release();
					if(!err){				
						cb(null, {status:"1",message:"update success"});
					}else{
						cb(err, {status:"0",message:"update failed"});
					}
				});
			}else
			{
				connection.release();
				cb(err, {status:"0",message:"invalid login_token or cms_password"});
				
			}
		});
	});
}


exports.getUserProfile=function(obj, cb){

	var str = "select `name`,`point`,department,role_new as 'rank',photo,biz_sector  from `user` where login_token='"+obj.login_token+"';";
	str +="SELECT from_date,display_score as 'score',WEEKOFYEAR(from_date) AS week_of_year FROM `point` WHERE user_id = (SELECT employee_id FROM `user` WHERE login_token='"+obj.login_token+"') ORDER BY from_date DESC LIMIT 4;"
	//console.log(str);
	str += "UPDATE `user` SET last_update = NOW() WHERE login_token='"+obj.login_token+"';";
	//console.log(str);
	db.getConnection(function(err, connection){
		var w = connection.query(str, function(err, result) {
			connection.release();
			if (err) {
				cb(err, null);
			}else {
				var pointHistory = result[1];
					result[0][0]['pointHistory'] = pointHistory;
					result[0][0]["photo"] = obj.myhost+"assets/upload/users/"+result[0][0]["photo"];  
					//console.log(result[0][0]);
				cb(err, result[0][0]);
			}
		});//console.log(w.sql);
    });
}

exports.messageReceived=function(obj, cb){
	var msg_id = obj.msg_id;
	var loginToken = obj.login_token;
	
	var str = "UPDATE inbox SET is_notified = 1 WHERE user_id = (SELECT employee_id FROM `user` WHERE login_token = '"+loginToken+"') AND msg_id = "+msg_id+";";
	str += "UPDATE `user` SET last_update = NOW() WHERE login_token='"+obj.login_token+"';";
	
	db.getConnection(function(err, connection){
		var w = connection.query(str, function(err, result) {
			connection.release();
			if (err) {
				console.log(err);
				cb(err, null);
			}else {
				cb(err, result[0]);
			}
		});//console.log(w.sql);
    });
}

exports.changeprofilepicture=function(obj, cb){
	//var msg_id = obj.msg_id;
	var loginToken = obj.login_token;
	
	var str = "UPDATE `user` SET last_update = NOW(), photo='"+obj.image+"'  WHERE login_token='"+obj.login_token+"';";
	//console.log(str);
	db.getConnection(function(err, connection){
		var w = connection.query(str, function(err, result) {
			connection.release();
			if (err) {
				console.log(err);
				cb(err, null);
			}else {
				cb(err, result[0]);
			}
		});//console.log(w.sql);
    });
}

exports.getlatestconversation = function(obj,cb){
	
	var str = "UPDATE `user` SET last_update = NOW() WHERE login_token='"+obj.login_token+"';";
	str += "  SELECT * FROM `conversation_message` WHERE id >" + obj.id +" and c_id = "+ obj.c_id;
	db.getConnection(function(err, connection){
	//conversation['subject'] = connection.escape(conversation['subject']);
		var w = connection.query(str, function(err2, result2) {
			connection.release();
			if (err2) {
				cb(err2, null);
			}else {		
				//var host_url = obj.myhost+"assets/upload/";  
				//result2[1]['host_url'] = host_url;
				var data =   result2[1];
				cb(err2, data);
			}
		});//console.log(w.sql);
    });
	
}

exports.sendorg = function(cb){
 	var getorg = "SELECT DISTINCT biz_sector as name FROM user WHERE biz_sector !='' AND biz_sector IS NOT NULL";
 	db.getConnection(function(err, connection){
	    connection.query(getorg, function(err, results) {
			connection.release();
			if (err) {
				cb(err, null);
		  	}else {				
		  		cb(null, results);
		  	}
		});
    }); 
}

exports.checknewuser = function(name,organization,ph,nric,noti_token,cb){
 	var chkuser = "SELECT * FROM user WHERE name = ? AND biz_sector = ? AND contact_number =?";
	var key = "";
	var otp_key = "";
	var e_id = "";
	var my_query = "";
	var status = "success";
	
 	db.getConnection(function(err, connection){
		var send_email = function(){
		//send email to admin with data(status,nric,Fullname,biz_sector,phone)
			connection.query("SELECT GROUP_CONCAT(email) as admin_email FROM admin WHERE active = 1", function(err, results) {			
				if (err) {
					connection.release();
					console.log(err);
					cb(err, null);
				}else {
					console.log(results[0].admin_email);
					var des  = "<html>";
					des += "<p>Full Name:"+name+"<br>Biz Sector:"+organization+"<br>Phone:"+ph+"<br>NRIC:"+nric+"<br>Status:"+status+"</p>";	
					//des += url.substr(url.indexOf("//")+2);
					des += "</html>";
					var email 	= require("emailjs");
					var server 	= email.server.connect({
					   user:    "yar.zar@studioamk.com", 
					   password:"highlight194amk", 
					   host:    "smtp.gmail.com", 
					   ssl:     true
					});
					 
					// send the message and get a callback with an error or details of the message that was sent 
					server.send({
					   
					   from:    "you <yar.zar@studioamk.com>", 
					   to:      results[0].admin_email,
					   subject: "STC User Activation",
					   attachment: 
					   [
						  {data:des, alternative:true}		
					   ]
					}, function(err, message) { console.log(err); });
				}
			});
								
		}
	    connection.query(chkuser,[name,organization,ph], function(err, results) {			
			if (err) {
				connection.release();
				console.log(err);
				cb(err, null);
		  	}else {
		  		if (results.length>0){
					//regenerate login_token
					key = generate_key();
					//regenerate otp_password and send_sms
					otp_key = generateotp(results[0].contact_number);
					e_id = results[0].employee_id;
		  	// #########check noti_token for send######### 
		  			
					var upnoti = "UPDATE user SET noti_token=?,login_token=?,otp_password=? WHERE employee_id=?";
		  			if(results[0].login_token){ //login_token already exists
						//forget password
						//check noti_token
						
						if(results[0].noti_token && results[0].noti_token !=noti_token)
						{
							//send sms if login from other devices
							//*******send sms***********
							//var client = require('twilio')('AC7830139e971765f14ba642c61accf296', '91c1f94ab9402d3670ab89fbebda3c55'); 
							// client.sendMessage({
							// 	to:'+9595419183', 							
							// 	from: '+14188008551', 
							// 	body: genotp
							// }, function(err, responseData) {
							// 	if (!err) { 
							// 		console.log(responseData.from);
							// 		console.log(responseData.body);
							// 	}
							// });
							//*******send sms***********
						}
						
						
						
		  				//update noti_token		
		  			}
					else //new user
					{
						var msg1 = "Shwe Taung Connect မွ ၾကိဳဆိုပါသည္။\\n\\nသင္သည္ ေရႊေတာင္၀န္ထမ္းမ်ားအားလံုးအတြက္ ဖြဲ႕စည္းေပးထားသည့္ Shwe Taung Connect ၏ အဖြဲ႔၀င္သစ္တစ္ဦး ျဖစ္သြားျပီျဖစ္ပါသည္။ ေရႊေတာင္၌ ျဖစ္ပြားေနေသာ အေၾကာင္းအရာမ်ား၊ ေရႊေတာင္၏ သတင္းအခ်က္အလက္အသစ္မ်ားႏွင့္ အျခားေသာ သတင္းမ်ားကို Shwe Taung Connect တြင္ သိရွိႏိုင္ပါသည္။\\n\\nသင္သည္ ေရႊေတာင္ႏွင့္ပတ္သက္သည့္ သတင္းမ်ားႏွင့္ အဆက္အသြယ္မျပတ္ ရွိေနမည္ျဖစ္သည္။\\n\\nWelcome to Shwe Taung Connect!\\n\\nYou are the new member of “Shwe Taung Connect”, a community for all Shwe Taung employees. “Shwe Taung Connect” is all about what’s happening right now at Shwe Taung. You will find up-to-date information about Shwe Taung and many other news here.\\n\\nYou will never be out of the loop anymore.";
						var msg2 = "User Guide Message\\n\\nShwe Taung Connect တြင္ လက္ရွိ ၌ Message ႏွင္႔ Report ဟူ၍ Function ႏွစ္ခုရွိသည္။ Message တြင္ စာသား၊ ဓာတ္ပံု၊ အသံဖိုင္၊ video ဖိုင္၊ link ႏွင့္ စစ္တမ္းေကာက္ယူမႈမ်ား ပါ၀င္မည္ျဖစ္သည္။ ဤပံုစံမ်ားျဖင့္ ေရႊေတာင္၏ သတင္းအခ်က္အလက္မ်ားကို အသိေပးသြားမည္ျဖစ္ၿပီး စစ္တမ္းေကာက္ယူမွုမ်ားတြင္ သင့္အေနျဖင့္ ပါ၀င္ရန္ လိုအပ္ပါသည္။\\nReport တြင္ Code of Conduct ႏွင့္ ေဘးအႏ ၱရာယ္ကင္းရွင္းေရးဆိုင္ရာ စည္းကမ္းလိုက္နာရန္ပ်က္ကြက္မႈမ်ားအတြက္ report တင္ျပႏိုင္ပါသည္။ သင့္အေနျဖင့္ အမည္ႏွင္႔တကြ (Normal Report) သို႔မဟုတ္ အမည္မပါဘဲ (Anonymous Report) ျဖင့္တင္ျပႏိုင္ပါသည္။ Anonymous report တင္ပါက သင္၏ report အား အမည္မေဖာ္ျပဘဲ လက္ခံရရွိမည္ျဖစ္ျပီး ေပးပို႔သူအား မသိရွိႏိုင္ပါ။\\n\\n“Shwe Taung Connect” currently has 2 functions: Messages and Reporting. Messages might be in the form of text, image, audio, video and even in a survey form. This is how you will be informed of anything that happens at Shwe Taung and you will be included in all surveys.\\nWith the Report function, you can report safety violations or breaches of the Code of Conduct. You can decide if you want to report anonymously or by using your own name. If you decide to go anonymous, nobody will know where your report comes from.";
						var msg3 = "User Engagement Score Calculation\\n\\nဤ application အား အသံုးျပဳျခင္း၊ messages မ်ားအား ဖတ္ရွူျခင္း၊ စစ္တမ္းေကာက္ယူမႈမ်ားတြင္ ပါ၀င္ေျဖဆိုျခင္းျဖင့္ သင္၏ Point ရမွတ္မ်ား တိုးလာမည္ ျဖစ္သည္။\\nျခြင္းခ်က္။ ။ Report တင္ျခင္းျဖင့္ သင္၏ Point ရမွတ္ တိုးမည္ မဟုတ္ပါ။\\n\\nThe more you use the app, the more you check the messages, the more surveys you participate to, the higher your score will be.\\nPlease Note: Reports do not contribute to the engagement score.";
						var msg4 = "Go and Change the password\\n\\nအေကာင့္အား Login ဝင္ၿပီးသည္ႏွင့္ default password အားေၿပာင္းလဲေပးပါ။ Password ေၿပာင္းရန္ Profile Tab သို႔သြားပါ။ Profile ညာဘက္အေပၚေထာင့္တြင္ password ေၿပာင္းလဲရန္ ခလုတ္ကိုႏွိပ္ကာ password ေၿပာင္းလဲေသာ စာမ်က္ႏွာသို႔သြားႏိုင္ပါသည္။\\n\\nPlease change your default password once you have logged into your account. To change your password, go to the Profile tab and on the top right corner you will find the change password button. Press it to get to the change password page..";
						var msg5 = "You can downlod Userguide here.";
						var file = "Userguide.pdf";
						var noti1 = "Welcome to Shwe Taung Connect";
						var noti2 = "“Shwe Taung Connect” currently has";
						var noti3 = "The more you use the app,";
						var noti4 = "Please change your default password";
						var noti5 = "User guide";
					var param1 = {
						to: [results[0].employee_id],
						group_id : '',
						g_i : '1',
						type : '',
						title : 'Welcome to Shwe Taung Connect',
						message : "'"+noti1+"'",
						postdata : '{"message":"'+msg1+'","n_a":"0"}',
						is_answered : '',
						n_a : '0',
						is_drafts : '0',
						is_schedule:'0',
						state : 'compose',
						draft_id : ''
					};
					var param2 = {
						to: [results[0].employee_id],
						group_id : '',
						g_i : '1',
						type : '',
						title : 'User Guide Message',
						message : "'"+noti2+"'",
						postdata : '{"message":"'+msg2+'","n_a":"0"}',
						is_answered : '',
						n_a : '0',
						is_drafts : '0',
						is_schedule:'0',
						state : 'compose',
						draft_id : ''
					};
					var param3 = {
						to: [results[0].employee_id],
						group_id : '',
						g_i : '1',
						type : '',
						title : 'User Engagement Score Calculation',
						message : "'"+noti3+"'",
						postdata : '{"message":"'+msg3+'","n_a":"0"}',
						is_answered : '',
						n_a : '0',
						is_drafts : '0',
						is_schedule:'0',
						state : 'compose',
						draft_id : ''
					};
					var param4 = {
						to: [results[0].employee_id],
						group_id : '',
						g_i : '1',
						type : '',
						title : 'Go and change the password',
						message : "'"+noti4+"'",
						postdata : '{"message":"'+msg4+'","n_a":"0"}',
						is_answered : '',
						n_a : '0',
						is_drafts : '0',
						is_schedule:'0',
						state : 'compose',
						draft_id : ''
					};
					var param5 = {
						to: [results[0].employee_id],
						group_id : '',
						g_i : '1',
						type : 'file',
						title : 'User Guide',
						message : "'"+noti5+"'",
						postdata : '{"message":"'+msg5+'","n_a":"0","files":"'+file+'"}',
						is_answered : '',
						n_a : '0',
						is_drafts : '0',
						is_schedule:'0',
						state : 'compose',
						draft_id : ''
					};					
						message_model.compose_save(param1, function(err, data) {
							if(err){
								console.log(err);
							}else{
								console.log(data);
							}
						});
						message_model.compose_save(param2, function(err, data) {
							if(err){
								console.log(err);
							}else{
								console.log(data);
							}
						});
						message_model.compose_save(param3, function(err, data) {
							if(err){
								console.log(err);
							}else{
								console.log(data);
							}
						});
						message_model.compose_save(param4, function(err, data) {
							if(err){
								console.log(err);
							}else{
								console.log(data);
							}
						});
						message_model.compose_save(param5, function(err, data) {
						if(err){
							console.log(err);
						}else{
							console.log(data);
						}
						});
						//*******send sms***********
							//var client = require('twilio')('AC7830139e971765f14ba642c61accf296', '91c1f94ab9402d3670ab89fbebda3c55'); 
							// client.sendMessage({
							// 	to:'+9595419183', 							
							// 	from: '+14188008551', 
							// 	body: genotp
							// }, function(err, responseData) {
							// 	if (!err) { 
							// 		console.log(responseData.from);
							// 		console.log(responseData.body);
							// 	}
							// });
						//*******send sms***********
					}		  			
		  				connection.query(upnoti,[noti_token,key,otp_key,e_id], function(err, results) {
		  					connection.release();
							if(err){
		  						
		  						console.log(err);
		  					}
							
							cb(null,{login_token:key});
							
		  				});
						//console.log(test.sql);
		  	// #########check noti_token for send######### 
			  		send_email();
		  		}else{
					 status = "failed";
					 connection.release();
		  			 cb(null,{login_token:key});
					 return;
		  		}
				
		  	}
		});
    }); 
}



exports.checkotp = function(e_id,otp,cb){
	var newtok = "SELECT email,login_token FROM `user` WHERE employee_id = ? AND otp_password =? ";
	
 	db.getConnection(function(err, connection){
	    connection.query(newtok,[e_id,otp], function(err2, results2) {		
			connection.release();
			if(!err2){
				if(results2.length>0){
					cb(null, results2);
				}else{
					cb(null, "invalid input");
				}
			}else{		   		 			
				cb(err2,null);
			}
		   	
		});
    });
}

exports.firstNewPassword = function(password,e_id,cb){
	var md5			= require('md5');
	var first_time = "no";	
	var pwd = md5(password);
	var snd_query = "UPDATE `user` SET cms_password = ?,last_update = NOW()";
	db.getConnection(function(err, connection){
		connection.query("SELECT first_login_date FROM `user` WHERE employee_id = ?",[e_id],function(err2,results2){
			if(!results2[0].first_login_date)
			{
				first_time = "yes";
				snd_query += ",first_login_date = NOW()";
			}
			snd_query +=" WHERE employee_id = ?";
			connection.query(snd_query,[pwd,e_id], function(err, result){
			connection.release();
			if(!err){
				cb(null, {status:"1",message:"update success",first_login:first_time});
			}else{
				cb(err, {status:"0",message:"update failed"});
			}
		});
		});
		
	});
	
}
