var db = require('../helpers/database');
var async = require("async");
//var nodemailer = require('nodemailer');



var fs = require('fs');
//var mysql_1 = global.mysql;
/*
var userID = function () {
  
  return  Math.random().toString(36).substr(2, 14);
};*/

var formatDate = function(date) {
//DD/MM/YYYY
	var mydate = date.split('-');
	var year = mydate[0];
	var month = mydate[1];	
	var day = mydate[2];
	//return [year, month, day].join('-');
	return [year, month, day].join('-');
					
}

exports.forget_password = function(email,cb){
	var chkMail = "SELECT * FROM user WHERE admin_email =?";
	db.getConnection(function(err, connection){
		connection.query(chkMail,[email], function(err, result){
			if(err){
				cb(err);
			}else{
				if(result.length>0){
					//send email
					var email 	= require("emailjs");
					var server 	= email.server.connect({
					   user:    "yar.zar@studioamk.com", 
					   password:"highlight194amk", 
					   host:    "smtp.gmail.com", 
					   ssl:     true
					});
					 
					// send the message and get a callback with an error or details of the message that was sent 
					server.send({
					   text:    "i hope this works", 
					   from:    "you <yar.zar@studioamk.com>", 
					   to:      "yarzartun.sead@gmail.com",
					   cc:      "else <else@your-email.com>",
					   subject: "testing emailjs"
					}, function(err, message) { console.log(err || message); });
					//send email
					cb(null,"Send recovery mail successfully");
				}else{
					cb(null,"Your email is invalid");
				}
			}
		});
	});
}

exports.test = function(cb){
	var biz_arr = ["Corporate Office","Shwe Taung Infrastructure","Shwe Taung Construction","Shwe Taung Distribution","GGI","Shwe Taung REAL Estate","Shwe Taung Building Materials"];
	var com_arr = ["Shwe Taung Development","High Tech Concrete Technology","Shwe Taung Distribution","Grand Guardian Insurance","Shwe Taung Cement"];
	var dep_arr = ["BOD","Finance & Account","Shareholder Relation Department","Administrative","Chairman Office","Corporate Communication","Human Resource","CEO Office","Audit","Education","Business Development","Organization Development","IT","Shareholder Relation Department","Admin & HR","Maintenance","Procurement","Mandalay Office Incharge","Sale & Marketing","Steel Construction","International Trade Department"];
	var gen_arr = ["Male","Female"];
	var rank_arr = ["Chairman","Chief Executive Officer","Vice Chairman","Managing Director","Division Head","Deputy Managing Director","Assistant Director","Director","Deputy General Manager","Senior Security","General Manager","Assistant General Manager","Senior Cleaner","Senior Manager","Driver G4","Security G3","Cleaner G2","Assistant Manager","Chief Audit Manager","Driver G5","Driver G3","Driver G2","Manager","Deputy Senior Audit Manager","Supervisor","Assistant Supervisor","IT Manager","Junior Assistant Supervisor","Driver G1","Corporate Legal Advisor","Organization Development Associate","Organization Development Assistant"];
	var loc_arr = ["500-Aca","Ba Yint Naung","Head Office","Junction Center Office","Mandalay Office","National Landmark","Nay Pyi Taw Office","Steel"];
	var emp_arr = ["2016-10-01","2006-01-01","2000-09-12","2012-05-01","1994-01-05","2004-01-06","2002-08-01","2005-03-01","2015-01-01","2010-10-01","2011-06-01","1995-08-01"];
	var dob_arr = ["1996-10-14","1986-01-01","1950-09-12","1992-05-21","1994-01-05","1995-04-16","1982-07-01","1985-03-01","1972-11-21","1969-10-01","1988-06-19","1965-03-01"];
	var probation_arr = ["Probation","Permanent"];
	var contract_arr = ["Flat","Employment"];
	var nationality_arr = ["Myanmar","Foreigner"];
	var getemail = function () {
	  return  Math.random().toString(36).substr(2, 10);
	};
	var getname = function()
	{
		return  Math.random().toString(36).substr(2, 10);
	};
	var getbiz = function()
	{
		return biz_arr[Math.floor(Math.random() * biz_arr.length)];
	}
	var getcom = function()
	{
		return com_arr[Math.floor(Math.random() * com_arr.length)];
	}
	var getdep = function()
	{
		return dep_arr[Math.floor(Math.random() * dep_arr.length)];
	}
	var getrank = function()
	{
		return rank_arr[Math.floor(Math.random() * rank_arr.length)];
	}
	var getgen = function()
	{
		return gen_arr[Math.floor(Math.random() * gen_arr.length)];
	}
	var getloc = function()
	{
		return loc_arr[Math.floor(Math.random() * loc_arr.length)];
	}
	var getedate = function()
	{
		return emp_arr[Math.floor(Math.random() * emp_arr.length)];
	}
	var getcontract = function()
	{
		return contract_arr[Math.floor(Math.random() * contract_arr.length)];
	}
	var getprobation = function()
	{
		return probation_arr[Math.floor(Math.random() * probation_arr.length)];
	}
	var getdob = function()
	{
		return dob_arr[Math.floor(Math.random() * dob_arr.length)];
	}
	var getnationality = function()
	{
		return nationality_arr[Math.floor(Math.random() * nationality_arr.length)];
	}
	var md5			= require('md5');
	var pwd = md5("password");			
	//var user_id = userID();
	var test = [];
	for(var i =0;i<10000;i++)
	{
		test[i] = i;
	}
	var async = require("async");
	setTimeout(function(){
	db.getConnection(function(err, connection){
		async.eachSeries(test, function iteratee(item, callback) {
			/*if (inCache(item)) {
				callback(null, cache[item]); // if many items are cached, you'll overflow
			} else {
				doSomeIO(item, callback);
			}*/
			var	data =  {
			
				email :	getemail(),	
				cms_password : pwd,
				name : getname(),
				biz_sector : getbiz(),
				company : getcom(),
				department : getdep(),
				rank : getrank(),
				gender :getgen(),
				site_location : getloc(),
				date_of_employment : getedate(),
				type_of_contract : getcontract(),
				probation_permanent : getprobation(),
				date_of_birth : getdob(),
				nationality : getnationality(),
				//direct_report_to : obj.direct_report_to,
				//employee_id : obj.employee_id	
			};
		var str = "INSERT into `user` SET ? ";
			var i= connection.query(str, data, function(err, result){		
				callback();
			});
		}, function done() {
			connection.release();
			cb(err, null);
		});
		//console.log(i.sql);
		
	});
		
	},8000);
	
	
		
}

exports.admin_verify = function(user,cb) {
	var md5	= require('md5');
	
	db.getConnection(function(err, connection){
		var str = "SELECT * FROM `user` WHERE `email` = "+ connection.escape(user.name) +" AND `cms_password` = "+ connection.escape(md5(user.password)) +" AND allow_cms = 1 AND active = 1 AND is_deleted = 0 ";	
		
		connection.query(str, function(err, result){
			if(result.length>0)
			{
				connection.query("DELETE FROM sessions WHERE `data` LIKE '%\"user_id\":\""+result[0].employee_id+"\"%'", function(err2, result2){
					connection.release();
					if(!err2){				
						cb(null, {user:result});
					}else{
					
					}
			
				});
			}
			else
			{
				connection.release();
				if(!err){				
					cb(null, {user:result});
				}else{
				
				}
			}
			
		});
	});
}
exports.cleartoken = function(uid,cb) {
	
	db.getConnection(function(err, connection){
	var str = "UPDATE `user` set login_token=NULL,noti_token=NULL WHERE employee_id="+connection.escape(uid);	
	//console.log(str);
		connection.query(str, function(err, result){
			connection.release();
			if(!err){				
				cb(null, "success");
			}else{
			}
		});
	});
}


exports.userlist = function(user,cb) {
	 var querystring = user.query_str;	 
	//start
	 var aColumns = ["employee_id","email","name","point","active","allow_cms","biz_sector","company","department","role_new","site_location"];
	 
	 /* Indexed column (used for fast and accurate table cardinality)*/
	 var sIndexColumn = "employee_id";
  
	/* DB table to use */
	var sTable = "user";
	//Paging
	var sLimit = "";
	if (querystring.iDisplayStart != 'null' && querystring.iDisplayLength != '-1' )
	{
		sLimit = "LIMIT "+querystring.iDisplayStart  +", "+
		querystring.iDisplayLength ;
	}
  
	//Ordering  
	if (querystring.iSortCol_0 != 'null' )
	{
		var sOrder = "ORDER BY  ";

		for ( var i=0 ; i< parseInt(querystring.iSortingCols) ; i++ )
		{			
			if ( querystring["bSortable_"+parseInt(querystring["iSortCol_"+i])] == "true" )
			{
				
				sOrder += aColumns[ parseInt(querystring["iSortCol_" +i])]+" "+querystring["sSortDir_"+i]  +" , ";
			}
		}
		
		sOrder = sOrder.substring(0, sOrder.length-2);
		if ( sOrder == "ORDER BY" )
		{
			sOrder = "";
		}
	}
	
	// search		
	var sWhere = " WHERE is_deleted = 0 ";
	
	//console.log(decodeURIComponent(querystring.biz_sector));
	if (querystring.biz_sector != "" && querystring.biz_sector != "null" )
	{
		sWhere += " AND (biz_sector ='"+decodeURIComponent(querystring.biz_sector)+"' )";
	}
	if (querystring.company != "" && querystring.company != "null" )
	{
		sWhere += " AND (company = '"+decodeURIComponent(querystring.company)+"' )";
	}
	if (querystring.rank != "" && querystring.rank != "null" )
	{
		sWhere += " AND (rank = '"+decodeURIComponent(querystring.rank)+"' )";
	}
	if (querystring.rank_new != "" && querystring.rank_new != "null" )
	{
		sWhere += " AND (rank_new = '"+decodeURIComponent(querystring.rank_new)+"' )";
	}
	if (querystring.role_old != "" && querystring.role_old != "null" )
	{
		sWhere += " AND (role_old = '"+decodeURIComponent(querystring.role_old)+"' )";
	}
	if (querystring.role_new != "" && querystring.role_new != "null" )
	{
		sWhere += " AND (role_new = '"+decodeURIComponent(querystring.role_new)+"' )";
	}
	if (querystring.department != "" && querystring.department != "null" )
	{
		sWhere += " AND (department = '"+decodeURIComponent(querystring.department)+"' )";
	}
	if (querystring.gender != "" && querystring.gender != "null" )
	{
		sWhere += " AND (gender = '"+querystring.gender+"' )";
	}
	/*if (querystring.date_of_employment != "" && querystring.date_of_employment != "null" )
	{
		sWhere += " AND (date_of_employment LIKE '%"+querystring.date_of_employment+"%' )";
	}*/
	if (querystring.probation_permanent != "" && querystring.probation_permanent != "null" )
	{
		sWhere += " AND (probation_permanent = '"+decodeURIComponent(querystring.probation_permanent)+"' )";
	}
	if (querystring.type_of_contract != "" && querystring.type_of_contract != "null" )
	{
		sWhere += " AND (type_of_contract = '"+decodeURIComponent(querystring.type_of_contract)+"' )";
	}
	if (querystring.site_location != "" && querystring.site_location != "null" )
	{
		sWhere += " AND (site_location = '"+decodeURIComponent(querystring.site_location)+"' )";
	}
	/*if (querystring.date_of_birth != "" && querystring.date_of_birth != "null" )
	{
		sWhere += " AND (date_of_birth LIKE '%"+querystring.date_of_birth+"%' )";
	}*/
	if (querystring.nationality != "" && querystring.nationality != "null" )
	{
		sWhere += " AND (nationality = '"+decodeURIComponent(querystring.nationality)+"' )";
	}
	if (querystring.keyword != "" && querystring.keyword != "null" )
	{
		//sWhere += " AND (name LIKE '%"+querystring.keyword+"%' OR `point` LIKE '%"+querystring.keyword+"%' )";
		sWhere += " AND (";
		for ( var k=0 ; k<aColumns.length ; k++ )
		{	
			var search_str = querystring.keyword.replace(/'/g, "\\'");
			sWhere += aColumns[k]+" LIKE '%"+ search_str +"%' OR ";
		}
		sWhere = sWhere.substring(0 , sWhere.length-3 );
		sWhere += ')';
	}
	
	var matched_results = [];	
	var findinarr = function(arrhaystack,needle)
	{
		return (arrhaystack.indexOf(needle) > -1);
	};
	db.getConnection(function(err, connection){	 
	
	if (querystring.group != "" && querystring.group != "null")
	{
		var async = require("async");
		//sWhere +=" AND ans_type = '"+querystring.ans_type+"' ";
		//start 
		
		var str_query  = "SELECT filtered_by,id FROM stc_group WHERE id IN ("+ querystring.group+");";	
					//console.log(str_query);
					connection.query(str_query , function(err, result) {   
					//connection.release();			
					if (err) {
						connection.release();
						cb(err, {},null);
						return;
					}else{
						if(result.length>0)
						{
							var where_condition = "";
							async.each(result, function(i_data, fcallback) {
							
							/*string += (string == "")? "" : ",";
							string += "('"+msg_id+"','"+ i_data.user_id +"','"+ i_data.group_id +"','"+ params.title +"')";
							*/
							
							async.waterfall([
								async.apply(myFirstFunction, i_data.filtered_by,i_data.id),
									mySecondFunction,
									
								], function (err, result) {
									//console.log('waterfall done');
									fcallback();
									// result now equals 'done'
								});
								function myFirstFunction(arg1,arg2, callback) {
									//attribute_1;equalto;Web Development|attribute_2;equalto;yangon|attribute_3;equalto;male|attribute_4;equalto;33|attribute_5;equalto;single
									//console.log('inside first function');
									if(arg1)
									{
										if(arg1 == "allusers")
										{
											callback(null,"",arg2);
										}
										else
										{
											var split_str = arg1.split('|');
										where_condition = " WHERE  ";
										var count = 0;
										async.each(split_str, function(check_condition, callback_1) {
											//check_condition = attribute_1;equalto;Web Development
											var split_str2 = check_condition.split(';');
											var operator = "";
											if(split_str2[1] == "equalto")
											{
												operator = " = ";
											}
											else if(split_str2[1] == "ignored")
											{
												operator = "";
											}
											else if(split_str2[1] == "notequalto")
											{
												operator = " != ";
											}
											if(operator != "")
											{
												if(count != 0)
												{
													where_condition += " AND ";
												}
												if(split_str2[0] == "date_of_employment")
												{
													if(split_str2[2] == "probies")
													{
														if(operator == " = ")
														{
															where_condition += "(TIMESTAMPDIFF( YEAR, date_of_employment, NOW() ) = 0 AND (TIMESTAMPDIFF( MONTH, date_of_employment, NOW() ) % 12) < 3)"; 
														}
														else
														{
															where_condition += "(TIMESTAMPDIFF( YEAR, date_of_employment, NOW() )> 0 OR (TIMESTAMPDIFF( MONTH, date_of_employment, NOW() ) % 12) >= 3)"; 
														}
													}
													else if(split_str2[2] == "newbies")
													{
														if(operator == " = ")
														{
															where_condition += "(TIMESTAMPDIFF( YEAR, date_of_employment, NOW() ) = 0 AND ((TIMESTAMPDIFF( MONTH, date_of_employment, NOW() ) % 12 = 3 AND FLOOR( TIMESTAMPDIFF( DAY, date_of_employment, NOW() ) % 30.4375 ) >0) OR TIMESTAMPDIFF( MONTH, date_of_employment, NOW() ) % 12 > 3) )"; 
														}
														else
														{
															where_condition += "(TIMESTAMPDIFF( YEAR, date_of_employment, NOW() ) >=1 OR TIMESTAMPDIFF( MONTH, date_of_employment, NOW() ) % 12 <3) "; 
														}
													}
													else if(split_str2[2] == "juniors")
													{
														if(operator == " = ")
														{
															where_condition += "(((TIMESTAMPDIFF( YEAR, date_of_employment, NOW() ) = 1 AND (TIMESTAMPDIFF( MONTH, date_of_employment, NOW() ) % 12 >0 OR FLOOR( TIMESTAMPDIFF( DAY, date_of_employment, NOW() ) % 30.4375 ) >0)) OR TIMESTAMPDIFF( YEAR, date_of_employment, NOW() ) > 1 ) AND TIMESTAMPDIFF( YEAR, date_of_employment, NOW() ) <3)"; 
														}
														else
														{
															where_condition += "(TIMESTAMPDIFF( YEAR, date_of_employment, NOW() ) =0 OR TIMESTAMPDIFF( YEAR, date_of_employment, NOW() ) >=3 ) "; 
														}
													}
													else if(split_str2[2] == "seniors")
													{
														if(operator == " = ")
														{
															where_condition += "(((TIMESTAMPDIFF( YEAR, date_of_employment, NOW() ) = 3 AND (TIMESTAMPDIFF( MONTH, date_of_employment, NOW() ) % 12 >0 OR FLOOR( TIMESTAMPDIFF( DAY, date_of_employment, NOW() ) % 30.4375 ) >0)) OR TIMESTAMPDIFF( YEAR, date_of_employment, NOW() ) > 3 ) AND TIMESTAMPDIFF( YEAR, date_of_employment, NOW() ) <7)"; 
														}
														else
														{
															where_condition += "(TIMESTAMPDIFF( YEAR, date_of_employment, NOW() ) <3 OR TIMESTAMPDIFF( YEAR, date_of_employment, NOW() ) >=7 ) "; 
														}
													}
													else if(split_str2[2] == "loyals")
													{
														if(operator == " = ")
														{
															where_condition += "(((TIMESTAMPDIFF( YEAR, date_of_employment, NOW() ) = 7 AND (TIMESTAMPDIFF( MONTH, date_of_employment, NOW() ) % 12 >0 OR FLOOR( TIMESTAMPDIFF( DAY, date_of_employment, NOW() ) % 30.4375 ) >0)) OR TIMESTAMPDIFF( YEAR, date_of_employment, NOW() ) > 7 ) AND TIMESTAMPDIFF( YEAR, date_of_employment, NOW() ) <15)"; 
														}
														else
														{
															where_condition += "(TIMESTAMPDIFF( YEAR, date_of_employment, NOW() ) <7 OR TIMESTAMPDIFF( YEAR, date_of_employment, NOW() ) >=15 ) "; 
														}
													}
													else if(split_str2[2] == "columns")
													{
														if(operator == " = ")
														{
															where_condition += "(TIMESTAMPDIFF( YEAR, date_of_employment, NOW() ) >= 15)"; 
														}
														else
														{
															where_condition += "(TIMESTAMPDIFF( YEAR, date_of_employment, NOW() ) < 15)"; 
														}
													}
												}
												else if(split_str2[0] == "date_of_birth")
												{
													if(split_str2[2] == "paper")
													{
														if(operator == " = ")
														{
															where_condition += "(TIMESTAMPDIFF( YEAR, date_of_birth, NOW() ) < 20)"; 
														}
														else
														{
															where_condition += "(TIMESTAMPDIFF( YEAR, date_of_birth, NOW() ) >= 20)"; 
														}
													}
													else if(split_str2[2] == "bamboo")
													{
														if(operator == " = ")
														{
															where_condition += "(TIMESTAMPDIFF( YEAR, date_of_birth, NOW() ) >= 20) AND (TIMESTAMPDIFF( YEAR, date_of_birth, NOW() ) < 30)"; 
														}
														else
														{
															where_condition += "(TIMESTAMPDIFF( YEAR, date_of_birth, NOW() ) < 20 OR TIMESTAMPDIFF( YEAR, date_of_birth, NOW() ) >= 30)"; 
														}
													}
													else if(split_str2[2] == "steel")
													{
														if(operator == " = ")
														{
															where_condition +="(TIMESTAMPDIFF( YEAR, date_of_birth, NOW() ) >= 30) AND (TIMESTAMPDIFF( YEAR, date_of_birth, NOW() ) < 50)"; 
														}
														else
														{
															where_condition += "(TIMESTAMPDIFF( YEAR, date_of_birth, NOW() ) < 30 OR TIMESTAMPDIFF( YEAR, date_of_birth, NOW() ) >= 50)"; 
														}
													}
													else if(split_str2[2] == "silver")
													{
														if(operator == " = ")
														{
															where_condition += "(TIMESTAMPDIFF( YEAR, date_of_birth, NOW() ) >= 50) AND (TIMESTAMPDIFF( YEAR, date_of_birth, NOW() ) < 60)"; 
														}
														else
														{
															where_condition += "(TIMESTAMPDIFF( YEAR, date_of_birth, NOW() ) < 50 OR TIMESTAMPDIFF( YEAR, date_of_birth, NOW() ) >= 60)"; 
														}
													}
													else if(split_str2[2] == "platinum")
													{
														if(operator == " = ")
														{
															where_condition += "(TIMESTAMPDIFF( YEAR, date_of_birth, NOW() ) >= 60)"; 
														}
														else
														{
															where_condition += "(TIMESTAMPDIFF( YEAR, date_of_birth, NOW() ) > 60)"; 
														}
													}
													
												}
												else
												{
													where_condition += split_str2[0]+operator+"'"+split_str2[2]+"'"; 
												}
												count ++;
											}
											//
											callback_1();
											
										}, function(err1) {
											//where_condition = where_condition.trim();
											//where_condition = where_condition.substr(0,where_condition.length-3);
											//where_condition +=")";
											//console.log(where_condition);
											callback(null,where_condition,arg2);
										});
										}
										
									}
									else
									{
										callback(null,"is_userid",arg2);
									}
									/*connection.query("SELECT * FROM saved_searches WHERE user_id ="+arg1,function(err2,result2){
										callback(null, result2,arg2);
									});
									*/
								}
								function mySecondFunction(arg1,arg2, callback) {
									//console.log(arg1);
									var q_str = "";
									if(arg1 != "is_userid")
									{
										q_str = "SELECT * FROM `user` "+arg1 ;
									}
									else
									{
										q_str = "SELECT * FROM user_groups WHERE group_id = "+arg2;
									}
									//console.log(q_str);
									connection.query(q_str , function(err3, result3) {
									if(result3.length == 0)
									{
										callback(null,matched_results);
									}
									else
									{
										if(arg1 != "is_userid")
										{
											async.each(result3, function(mydata, mycallback) {
												
												if(!findinarr(matched_results,mydata.employee_id))
												{
													// do insert
													/*string += (string == "")? "" : ",";
													string += '("'+msg_id+'","'+ mydata.user_id +'",'+ params.title+','+is_answered+','+is_question+')';*/
													matched_results.push(connection.escape(mydata.employee_id));
												}
												mycallback();
												//console.log(matched_results.length);
												}, function(err) {
												callback(null,matched_results);
											});
										}
										else
										{
											var res_arr = result3[0].user_id.split('\n');
											async.each(res_arr, function(mydata, mycallback) {
												if(mydata != "")
												{
													if(!findinarr(matched_results,mydata))
													{
														// do insert
														/*string += (string == "")? "" : ",";
														string += '("'+msg_id+'","'+ mydata +'",'+ params.title+','+is_answered+','+is_question+')';*/
														matched_results.push(connection.escape(mydata));
													}
												}
												mycallback();
												
												}, function(err) {
												callback(null,matched_results);
											});
										}
										
									}
									
									
								});
								}
							
							}, function(err) {
								// if any of the file processing produced an error, err would equal that error
								if( err ) {
								  // One of the iterations produced an error.
								  // All processing will now stop.
								  connection.release();	
								} else {
									
									if(matched_results.length>0)
									{	
										/*connection.query("INSERT INTO inbox(`msg_id`,`user_id`,`title`,is_answered,is_question) VALUES "+string , function(err2, result2) {   
											connection.release();		
											cb(err2, result2,msg_id);
										});*/
										// to do here
										sWhere += " AND employee_id IN("+matched_results.join()+")"
										sQuery = "SELECT SQL_CALC_FOUND_ROWS "+aColumns.join()+" ,@s:=@s+1 serial_number FROM "+sTable+" ,(SELECT @s:= "+(querystring.iDisplayStart)+") AS s "+sWhere+ sOrder+ sLimit;
										//console.log(sQuery);
										connection.query(sQuery , function(err, results) {
											if (err) {
												connection.release();
												cb(err, null);
												return;
											}else {
												connection.query("SELECT FOUND_ROWS() as num_row" , function(err, myres) {
													if (err) {
														connection.release();
														cb(err, null);
														return;
													}else {
														var iFilteredTotal = myres[0].num_row;					
														var rResult = results;    
														var total_query = "SELECT COUNT("+sIndexColumn+") as total_record FROM "+sTable +" WHERE is_deleted = 0";
														connection.query(total_query, function(err, result) {
															connection.release();
															if (err) {
																cb(err, null);
																return;
															}else {
																var iTotal = result[0].total_record;							
																var output = {};
																output["sEcho"] = querystring.sEcho;
																output["iTotalRecords"] = iTotal;
																output["iTotalDisplayRecords"] = iFilteredTotal; 
																output["aaData"] = [];
																var count = 0;
																for (var k in rResult)    
																{
																 output['aaData'][count] =[rResult[k].employee_id,rResult[k].email,rResult[k].name,rResult[k].point,rResult[k].active,rResult[k].allow_cms,rResult[k].biz_sector,rResult[k].company,rResult[k].department,rResult[k].role_new,rResult[k].site_location];
																 count++;
																}
																var json_data = JSON.stringify(output);    
																cb(null, json_data);
															}
															
													   });							
													}							  
												});
											}	
											});
									}
									else
									{
										var total_query = "SELECT COUNT("+sIndexColumn+") as total_record FROM "+sTable+" WHERE is_deleted = 0";
										connection.query(total_query, function(err, result) {
											connection.release();
											if (err) {
												cb(err, null);
												return;
											}else {
												var iTotal = result[0].total_record;							
												var output = {};
												output["sEcho"] = querystring.sEcho;
												output["iTotalRecords"] = iTotal;
												output["iTotalDisplayRecords"] = 0; 
												output["aaData"] = [];
												/*var count = 0;
												for (var k in rResult)    
												{
												 output['aaData'][count] =[rResult[k].user_id,rResult[k].email,rResult[k].point,rResult[k].active,rResult[k].allow_cms];
												 count++;
												}*/
												var json_data = JSON.stringify(output);    
												cb(null, json_data);
											}
											
									   });	
									}
									
								}
							});
						}
						else
						{
							
							connection.release();
							cb(null, {},null);
							return;
						}
					}
							  	
				});
		//end
	}
	
	/* " WHERE player_key is not null   ";  */
	/*	
	*/
	else{
		sQuery = "SELECT SQL_CALC_FOUND_ROWS "+aColumns.join()+" ,@s:=@s+1 serial_number FROM "+sTable+" ,(SELECT @s:= "+(querystring.iDisplayStart)+") AS s "+sWhere+ sOrder+ sLimit;
	//console.log(sQuery); 
	
		connection.query(sQuery , function(err, results) {
			if (err) {
				connection.release();
				cb(err, null);
				return;
		  	}else {
		  		connection.query("SELECT FOUND_ROWS() as num_row" , function(err, myres) {
					if (err) {
						connection.release();
						cb(err, null);
						return;
					}else {
						var iFilteredTotal = myres[0].num_row;					
						var rResult = results;    
						var total_query = "SELECT COUNT("+sIndexColumn+") as total_record FROM "+sTable +" WHERE is_deleted = 0";
						connection.query(total_query, function(err, result) {
							connection.release();
							if (err) {
								cb(err, null);
								return;
							}else {
								var iTotal = result[0].total_record;							
								var output = {};
								output["sEcho"] = querystring.sEcho;
								output["iTotalRecords"] = iTotal;
								output["iTotalDisplayRecords"] = iFilteredTotal; 
								output["aaData"] = [];
								var count = 0;
								for (var k in rResult)    
								{
								 output['aaData'][count] =[rResult[k].employee_id,rResult[k].email,rResult[k].name,rResult[k].point,rResult[k].active,rResult[k].allow_cms,rResult[k].biz_sector,rResult[k].company,rResult[k].department,rResult[k].role_new,rResult[k].site_location];
								 count++;
								}
								var json_data = JSON.stringify(output);    
								cb(null, json_data);
							}
							
					   });							
					}							  
				});
		  	}		   
		});	   
	
	}
	});
}
exports.alluserlist = function(user,cb) {
	 var querystring = user.query_str;	 
	//start
	//
	 var aColumns =  ['e_id','e_code','employee_id','name','email','gender','nationality','rank','rank_new','role_old','role_new','biz_sector','company','site_location','department','date_of_employment','date_of_birth','probation_permanent','type_of_contract','direct_report_to','contact_number','corporate_sim_card'];
	 /* Indexed column (used for fast and accurate table cardinality)*/
	 var sIndexColumn = "employee_id";
  
	/* DB table to use */
	var sTable = "user";
	
	
	// search		
	var sWhere = " WHERE is_deleted = 0  ";
	if (querystring.keyword != "" && querystring.keyword != "null" )
	{
		sWhere += " AND (name LIKE '%"+querystring.keyword+"%' OR `point` LIKE '%"+querystring.keyword+"%' OR `employee_id` LIKE '%"+querystring.keyword+"%' )";
	}
	//console.log(decodeURIComponent(querystring.biz_sector));
	if (querystring.biz_sector != "" && querystring.biz_sector != "null" )
	{
		sWhere += " AND (biz_sector = '"+decodeURIComponent(querystring.biz_sector)+"' )";
	}
	if (querystring.company != "" && querystring.company != "null" )
	{
		sWhere += " AND (company = '"+decodeURIComponent(querystring.company)+"' )";
	}
	if (querystring.rank != "" && querystring.rank != "null" )
	{
		sWhere += " AND (rank = '"+decodeURIComponent(querystring.rank)+"' )";
	}
	if (querystring.rank_new != "" && querystring.rank_new != "null" )
	{
		sWhere += " AND (rank_new = '"+decodeURIComponent(querystring.rank_new)+"' )";
	}
	if (querystring.role_old != "" && querystring.role_old != "null" )
	{
		sWhere += " AND (role_old = '"+decodeURIComponent(querystring.role_old)+"' )";
	}
	if (querystring.role_new != "" && querystring.role_new != "null" )
	{
		sWhere += " AND (role_new = '"+decodeURIComponent(querystring.role_new)+"' )";
	}
	if (querystring.department != "" && querystring.department != "null" )
	{
		sWhere += " AND (department = '"+decodeURIComponent(querystring.department)+"' )";
	}
	if (querystring.gender != "" && querystring.gender != "null" )
	{
		sWhere += " AND (gender = '"+querystring.gender+"' )";
	}
	/*if (querystring.date_of_employment != "" && querystring.date_of_employment != "null" )
	{
		sWhere += " AND (date_of_employment LIKE '%"+querystring.date_of_employment+"%' )";
	}*/
	if (querystring.probation_permanent != "" && querystring.probation_permanent != "null" )
	{
		sWhere += " AND (probation_permanent = '"+decodeURIComponent(querystring.probation_permanent)+"' )";
	}
	if (querystring.type_of_contract != "" && querystring.type_of_contract != "null" )
	{
		sWhere += " AND (type_of_contract = '"+decodeURIComponent(querystring.type_of_contract)+"' )";
	}
	if (querystring.site_location != "" && querystring.site_location != "null" )
	{
		sWhere += " AND (site_location = '"+decodeURIComponent(querystring.site_location)+"' )";
	}
	// if (querystring.corporate_sim_card != "" && querystring.corporate_sim_card != "null" )
	// {
	// 	sWhere += " AND (corporate_sim_card = '"+decodeURIComponent(querystring.corporate_sim_card)+"' )";
	// }
	/*if (querystring.date_of_birth != "" && querystring.date_of_birth != "null" )
	{
		sWhere += " AND (date_of_birth LIKE '%"+querystring.date_of_birth+"%' )";
	}*/
	if (querystring.nationality != "" && querystring.nationality != "null" )
	{
		sWhere += " AND (nationality = '"+decodeURIComponent(querystring.nationality)+"' )";
	}
	var sOrder = "ORDER BY  ";
	if (querystring.sortedCol)
	{
		sOrder += aColumns[querystring.sortedCol]+" "+querystring.sortedDir;
	}
	var matched_results = [];	
	var findinarr = function(arrhaystack,needle)
	{
		return (arrhaystack.indexOf(needle) > -1);
	};
	db.getConnection(function(err, connection){	 
	
	if (querystring.group != "" && querystring.group != "null")
	{
		var async = require("async");
		//sWhere +=" AND ans_type = '"+querystring.ans_type+"' ";
		//start 
		
		var str_query  = "SELECT filtered_by,id FROM stc_group WHERE id IN ("+ querystring.group+");";	
					//console.log(str_query);
					connection.query(str_query , function(err, result) {   
					//connection.release();			
					if (err) {
						connection.release();
						cb(err, {},null);
						return;
					}else{
						if(result.length>0)
						{
							var where_condition = "";
							async.each(result, function(i_data, fcallback) {
							
							/*string += (string == "")? "" : ",";
							string += "('"+msg_id+"','"+ i_data.user_id +"','"+ i_data.group_id +"','"+ params.title +"')";
							*/
							
							async.waterfall([
								async.apply(myFirstFunction, i_data.filtered_by,i_data.id),
									mySecondFunction,
									
								], function (err, result) {
									//console.log('waterfall done');
									fcallback();
									// result now equals 'done'
								});
								function myFirstFunction(arg1,arg2, callback) {
									//attribute_1;equalto;Web Development|attribute_2;equalto;yangon|attribute_3;equalto;male|attribute_4;equalto;33|attribute_5;equalto;single
									//console.log('inside first function');
									if(arg1)
									{
										if(arg1 == "allusers")
										{
											callback(null,"",arg2);
										}
										else
										{
											var split_str = arg1.split('|');
											where_condition = " WHERE  ";
											var count = 0;
											async.each(split_str, function(check_condition, callback_1) {
											//check_condition = attribute_1;equalto;Web Development
											var split_str2 = check_condition.split(';');
											var operator = "";
											if(split_str2[1] == "equalto")
											{
												operator = " = ";
											}
											else if(split_str2[1] == "ignored")
											{
												operator = "";
											}
											else if(split_str2[1] == "notequalto")
											{
												operator = " != ";
											}
											if(operator != "")
											{
												if(count != 0)
												{
													where_condition += " AND ";
												}
												if(split_str2[0] == "date_of_employment")
												{
													if(split_str2[2] == "probies")
													{
														if(operator == " = ")
														{
															where_condition += "(TIMESTAMPDIFF( YEAR, date_of_employment, NOW() ) = 0 AND (TIMESTAMPDIFF( MONTH, date_of_employment, NOW() ) % 12) < 3)"; 
														}
														else
														{
															where_condition += "(TIMESTAMPDIFF( YEAR, date_of_employment, NOW() )> 0 OR (TIMESTAMPDIFF( MONTH, date_of_employment, NOW() ) % 12) >= 3)"; 
														}
													}
													else if(split_str2[2] == "newbies")
													{
														if(operator == " = ")
														{
															where_condition += "(TIMESTAMPDIFF( YEAR, date_of_employment, NOW() ) = 0 AND ((TIMESTAMPDIFF( MONTH, date_of_employment, NOW() ) % 12 = 3 AND FLOOR( TIMESTAMPDIFF( DAY, date_of_employment, NOW() ) % 30.4375 ) >0) OR TIMESTAMPDIFF( MONTH, date_of_employment, NOW() ) % 12 > 3) )"; 
														}
														else
														{
															where_condition += "(TIMESTAMPDIFF( YEAR, date_of_employment, NOW() ) >=1 OR TIMESTAMPDIFF( MONTH, date_of_employment, NOW() ) % 12 <3) "; 
														}
													}
													else if(split_str2[2] == "juniors")
													{
														if(operator == " = ")
														{
															where_condition += "(((TIMESTAMPDIFF( YEAR, date_of_employment, NOW() ) = 1 AND (TIMESTAMPDIFF( MONTH, date_of_employment, NOW() ) % 12 >0 OR FLOOR( TIMESTAMPDIFF( DAY, date_of_employment, NOW() ) % 30.4375 ) >0)) OR TIMESTAMPDIFF( YEAR, date_of_employment, NOW() ) > 1 ) AND TIMESTAMPDIFF( YEAR, date_of_employment, NOW() ) <3)"; 
														}
														else
														{
															where_condition += "(TIMESTAMPDIFF( YEAR, date_of_employment, NOW() ) =0 OR TIMESTAMPDIFF( YEAR, date_of_employment, NOW() ) >=3 ) "; 
														}
													}
													else if(split_str2[2] == "seniors")
													{
														if(operator == " = ")
														{
															where_condition += "(((TIMESTAMPDIFF( YEAR, date_of_employment, NOW() ) = 3 AND (TIMESTAMPDIFF( MONTH, date_of_employment, NOW() ) % 12 >0 OR FLOOR( TIMESTAMPDIFF( DAY, date_of_employment, NOW() ) % 30.4375 ) >0)) OR TIMESTAMPDIFF( YEAR, date_of_employment, NOW() ) > 3 ) AND TIMESTAMPDIFF( YEAR, date_of_employment, NOW() ) <7)"; 
														}
														else
														{
															where_condition += "(TIMESTAMPDIFF( YEAR, date_of_employment, NOW() ) <3 OR TIMESTAMPDIFF( YEAR, date_of_employment, NOW() ) >=7 ) "; 
														}
													}
													else if(split_str2[2] == "loyals")
													{
														if(operator == " = ")
														{
															where_condition += "(((TIMESTAMPDIFF( YEAR, date_of_employment, NOW() ) = 7 AND (TIMESTAMPDIFF( MONTH, date_of_employment, NOW() ) % 12 >0 OR FLOOR( TIMESTAMPDIFF( DAY, date_of_employment, NOW() ) % 30.4375 ) >0)) OR TIMESTAMPDIFF( YEAR, date_of_employment, NOW() ) > 7 ) AND TIMESTAMPDIFF( YEAR, date_of_employment, NOW() ) <15)"; 
														}
														else
														{
															where_condition += "(TIMESTAMPDIFF( YEAR, date_of_employment, NOW() ) <7 OR TIMESTAMPDIFF( YEAR, date_of_employment, NOW() ) >=15 ) "; 
														}
													}
													else if(split_str2[2] == "columns")
													{
														if(operator == " = ")
														{
															where_condition += "(TIMESTAMPDIFF( YEAR, date_of_employment, NOW() ) >= 15)"; 
														}
														else
														{
															where_condition += "(TIMESTAMPDIFF( YEAR, date_of_employment, NOW() ) < 15)"; 
														}
													}
												}
												else if(split_str2[0] == "date_of_birth")
												{
													if(split_str2[2] == "paper")
													{
														if(operator == " = ")
														{
															where_condition += "(TIMESTAMPDIFF( YEAR, date_of_birth, NOW() ) < 20)"; 
														}
														else
														{
															where_condition += "(TIMESTAMPDIFF( YEAR, date_of_birth, NOW() ) >= 20)"; 
														}
													}
													else if(split_str2[2] == "bamboo")
													{
														if(operator == " = ")
														{
															where_condition += "(TIMESTAMPDIFF( YEAR, date_of_birth, NOW() ) >= 20) AND (TIMESTAMPDIFF( YEAR, date_of_birth, NOW() ) < 30)"; 
														}
														else
														{
															where_condition += "(TIMESTAMPDIFF( YEAR, date_of_birth, NOW() ) < 20 OR TIMESTAMPDIFF( YEAR, date_of_birth, NOW() ) >= 30)"; 
														}
													}
													else if(split_str2[2] == "steel")
													{
														if(operator == " = ")
														{
															where_condition +="(TIMESTAMPDIFF( YEAR, date_of_birth, NOW() ) >= 30) AND (TIMESTAMPDIFF( YEAR, date_of_birth, NOW() ) < 50)"; 
														}
														else
														{
															where_condition += "(TIMESTAMPDIFF( YEAR, date_of_birth, NOW() ) < 30 OR TIMESTAMPDIFF( YEAR, date_of_birth, NOW() ) >= 50)"; 
														}
													}
													else if(split_str2[2] == "silver")
													{
														if(operator == " = ")
														{
															where_condition += "(TIMESTAMPDIFF( YEAR, date_of_birth, NOW() ) >= 50) AND (TIMESTAMPDIFF( YEAR, date_of_birth, NOW() ) < 60)"; 
														}
														else
														{
															where_condition += "(TIMESTAMPDIFF( YEAR, date_of_birth, NOW() ) < 50 OR TIMESTAMPDIFF( YEAR, date_of_birth, NOW() ) >= 60)"; 
														}
													}
													else if(split_str2[2] == "platinum")
													{
														if(operator == " = ")
														{
															where_condition += "(TIMESTAMPDIFF( YEAR, date_of_birth, NOW() ) >= 60)"; 
														}
														else
														{
															where_condition += "(TIMESTAMPDIFF( YEAR, date_of_birth, NOW() ) > 60)"; 
														}
													}
													
												}
												else
												{
													where_condition += split_str2[0]+operator+"'"+split_str2[2]+"'"; 
												}
												count ++;
											}
											//
											callback_1();
											
										}, function(err1) {
											//where_condition = where_condition.trim();
											//where_condition = where_condition.substr(0,where_condition.length-3);
											//where_condition +=")";
											//console.log(where_condition);
											callback(null,where_condition,arg2);
										});
										}										
									}
									else
									{
										callback(null,"is_userid",arg2);
									}
									/*connection.query("SELECT * FROM saved_searches WHERE user_id ="+arg1,function(err2,result2){
										callback(null, result2,arg2);
									});
									*/
								}
								function mySecondFunction(arg1,arg2, callback) {
									//console.log(arg1);
									var q_str = "";
									if(arg1 != "is_userid")
									{
										q_str = "SELECT * FROM `user` "+arg1 ;
									}
									else
									{
										q_str = "SELECT * FROM user_groups WHERE group_id = "+arg2;
									}
									//console.log("SELECT * FROM `user` "+arg1 );
									connection.query(q_str , function(err3, result3) {
									if(result3.length == 0)
									{
										//console.log("heyyy");
										callback(null,matched_results);
									}
									else
									{
										// var item1 =  host+'/listing/'+(parseInt(result3[0].id)+1111)+'/'+result3[0].property_name;
										if(arg1 != "is_userid")
										{
											async.each(result3, function(mydata, mycallback) {
												
												if(!findinarr(matched_results,mydata.employee_id))
												{
													// do insert
													/*string += (string == "")? "" : ",";
													string += '("'+msg_id+'","'+ mydata.user_id +'",'+ params.title+','+is_answered+','+is_question+')';*/
													matched_results.push(connection.escape(mydata.employee_id));
												}
												mycallback();
												
												}, function(err) {
												callback(null,matched_results);
											});
										}
										else
										{
											var res_arr = result3[0].user_id.split('\n');
											async.each(res_arr, function(mydata, mycallback) {
												if(mydata != "")
												{
													if(!findinarr(matched_results,mydata))
													{
														// do insert
														/*string += (string == "")? "" : ",";
														string += '("'+msg_id+'","'+ mydata +'",'+ params.title+','+is_answered+','+is_question+')';*/
														//matched_results.push(connection.escape(mydata));
														matched_results.push(connection.escape(mydata));
													}
												}
												mycallback();
												
												}, function(err) {
												callback(null,matched_results);
											});
										}
										
									}
									
									
								});
								}
							
							}, function(err) {
								// if any of the file processing produced an error, err would equal that error
								if( err ) {
								  // One of the iterations produced an error.
								  // All processing will now stop.
								  connection.release();	
								} else {
									
									if(matched_results.length>0)
									{	
										
										//sWhere += " AND FIND_IN_SET (employee_id,'"+matched_results.join()+"')"
										sWhere += " AND employee_id IN("+matched_results.join()+")";
										sQuery = "SELECT  "+aColumns.join()+" ,@s:=@s+1 Sr FROM "+sTable+" ,(SELECT @s:= 0) AS s "+sWhere+ sOrder;
										//console.log(sQuery);
										//console.log(sQuery);
										connection.query(sQuery , function(err, results) {
											if (err) {
												connection.release();
												cb(err, null);
												return;
											}else {
												cb(null, results);
												//console.log(results);												
											}	
											});
									}
									else
									{
										cb(null, {});	
									}
									
								}
							});
						}
						else
						{
							
							connection.release();
							cb(null, {},null);
							return;
						}
					}
							  	
				});
		//end
	}
	
	/* " WHERE player_key is not null   ";  */
	/*if ( querystring["sSearch"] != "" )
	{
		sWhere += " AND (";
		for ( var k=0 ; k<aColumns.length ; k++ )
		{	
			var search_str = querystring['sSearch'].replace(/'/g, "\\'");
			sWhere += aColumns[k]+" LIKE '%"+ search_str +"%' OR ";
		}
		sWhere = sWhere.substring(0 , sWhere.length-3 );
		sWhere += ')';
	}	
	*/
	else{
		sQuery = "SELECT SQL_CALC_FOUND_ROWS @s:=@s+1 Sr, "+aColumns.join()+"  FROM "+sTable+" ,(SELECT @s:=0) AS s "+sWhere+ sOrder;
	//console.log(sQuery); 
	
		connection.query(sQuery , function(err, results) {
			if (err) {
				connection.release();
				cb(err, null);
				return;
		  	}else {
		  		cb(null, results);
		  	}		   
		});	   
	
	}
	});
}

exports.useredit = function(id,cb){
	var result = [];
	var str = "SELECT * FROM `user` WHERE employee_id = '"+ id +"'; ";
		str += "SELECT DISTINCT biz_sector as name FROM `user`;";//biz_sector
		str += "SELECT DISTINCT company as name FROM `user`; ";//company
		str += "SELECT DISTINCT department as name FROM `user`; ";//department
		str += "SELECT DISTINCT gender as name FROM `user`; ";//gender
		str += "SELECT DISTINCT site_location as name FROM `user`; ";//site_location
		str += "SELECT DISTINCT probation_permanent as name FROM `user`; ";//probation_permanent
		str += "SELECT DISTINCT nationality  as name FROM `user`; ";//nationality
		str += "SELECT DISTINCT type_of_contract as name FROM `user`; ";//type_of_contract
		str += "SELECT DISTINCT rank  as name FROM `user` WHERE rank IS NOT NULL AND rank !=''; ";
		str += "SELECT DISTINCT rank_new  AS name FROM `user` WHERE rank_new IS NOT NULL AND rank_new !=''; ";
		str += "SELECT DISTINCT role_old  as name FROM `user` WHERE role_old IS NOT NULL AND role_old !=''; ";
		str += "SELECT DISTINCT role_new  as name FROM `user` WHERE role_new IS NOT NULL AND role_new !=''; ";
	//console.log(str);
	db.getConnection(function(err, connection){
		var i = connection.query(str, function(err, results) {
			connection.release();
			if (err) {
				cb(err, null);
		  	}else {				
		  		cb(null, results);
		  	}
		});//console.log(i.sql);
    });

}

exports.editedUser = function(obj,cb){
	var binary_img = "";
	if(obj['binary_img'])
	{
		binary_img = obj['binary_img'];
		binary_img = binary_img.substr(binary_img.indexOf(',')+1);
		binary_img = binary_img.replace(/ /g, '+');
		
	}
	var md5			= require('md5');
	var pwd;
		if(obj.password1 != "" && obj.password2 != ""){
			pwd = md5(obj.password1);			
			}
		else{
			pwd = obj.cms_password;
			
		}
		data =  {
				email : obj.email,
				employee_id : obj.user_id,
				point : obj.point ,
				allow_cms : obj.allow_cms,
				active : obj.active,			
				corporate_sim_card : obj.corporate_sim_card,			
				cms_password : pwd,	
				name : obj.name,
				biz_sector : obj.biz_sector,
				company : obj.company,
				department : obj.department,
				rank : obj.rank,
				rank_new : obj.rank_new,
				role_old : obj.role_old,
				role_new : obj.role_new,
				gender : obj.gender,
				site_location : obj.site_location,
				date_of_employment : obj.date_of_employment || null,
				probation_permanent : obj.probation_permanent,
				type_of_contract : obj.type_of_contract,
				date_of_birth : obj.date_of_birth || null,
				nationality : obj.nationality,
				direct_report_to : obj.direct_report_to,
				contact_number : obj.contact_number,
				//employee_id : obj.employee_id
				};
		if(data["biz_sector"].toLowerCase() == "others")
		{
			data["biz_sector"] = obj.otherbizsector;
		}
		if(data["company"].toLowerCase() == "others")
		{
			data["company"] = obj.othercompany;
		}
		if(data["department"].toLowerCase() == "others")
		{
			data["department"] = obj.otherdepartment;
		}
		if(data["rank"].toLowerCase() == "others")
		{
			data["rank"] = obj.otherrank;
		}
		if(data["rank_new"].toLowerCase() == "others")
		{
			data["rank_new"] = obj.otherranknew;
		}
		if(data["role_old"].toLowerCase() == "others")
		{
			data["role_old"] = obj.otherroleold;
		}
		if(data["role_new"].toLowerCase() == "others")
		{
			data["role_new"] = obj.otherrolenew;
		}
		if(data["site_location"].toLowerCase() == "others")
		{
			data["site_location"] = obj.otherlocation;
		}
		if(data["probation_permanent"].toLowerCase() == "others")
		{
			data["probation_permanent"] = obj.otherprobation;
		}
		if(data["type_of_contract"].toLowerCase() == "others")
		{
			data["type_of_contract"] = obj.othercontract;
		}
		if(data["nationality"].toLowerCase() == "others")
		{
			data["nationality"] = obj.othernationality;
		}
		str = "UPDATE `user` SET ? WHERE employee_id = ? ";
	db.getConnection(function(err, connection){
		var i = connection.query(str, [data, data.employee_id], function(err, result){		
			if(!err){				
				if(binary_img != "")
				{
					
					fs.writeFile('public/assets/upload/users/'+data.employee_id+'.jpg', binary_img, 'base64', function(err) {
				
						if (err) {
							console.log(err);
						}
						else
						{
							connection.query("UPDATE `user` SET photo='"+data.employee_id+".jpg' WHERE employee_id='"+data.employee_id+"'", function(err, result) {
								if (err) {
									console.log(err);
								}
							});
						}
					});
				}
				cb(null, {message : "success"} );
			}else{	
				
				cb(err, null);				
			}
		});//console.log(i.sql);
		connection.release();
	});
}


exports.pointHistoryList = function(user,userId,cb) {
	 var querystring = user.query_str;	 
	//start
	 var aColumns = ["from_date","to_date","score","bonus"];
	 
	 /* Indexed column (used for fast and accurate table cardinality)*/
	 var sIndexColumn = "id";
  
	/* DB table to use */
	var sTable = "`point`";
	//Paging
	var sLimit = "";
	if (querystring.iDisplayStart != 'null' && querystring.iDisplayLength != '-1' )
	{
		sLimit = "LIMIT "+querystring.iDisplayStart  +", "+
		querystring.iDisplayLength ;
	}
  
	//Ordering  
	if (querystring.iSortCol_0 != 'null' )
	{
		var sOrder = "ORDER BY  ";

		for ( var i=0 ; i< parseInt(querystring.iSortingCols) ; i++ )
		{			
			if ( querystring["bSortable_"+parseInt(querystring["iSortCol_"+i])] == "true" )
			{
				
				sOrder += aColumns[ parseInt(querystring["iSortCol_" +i])]+" "+querystring["sSortDir_"+i]  +" , ";
			}
		}
		
		sOrder = sOrder.substring(0, sOrder.length-2);
		if ( sOrder == "ORDER BY" )
		{
			sOrder = "";
		}
	}
	
	// search		
	var sWhere = " WHERE 1=1 and user_id='"+userId+"'  ";
	/* " WHERE player_key is not null   ";  */
	if ( querystring["sSearch"] != "" )
	{
		sWhere += " AND (";
		for ( var k=0 ; k<aColumns.length ; k++ )
		{	
			var search_str = querystring['sSearch'].replace(/'/g, "\\'");
			sWhere += aColumns[k]+" LIKE '%"+ search_str +"%' OR ";
		}
		sWhere = sWhere.substring(0 , sWhere.length-3 );
		sWhere += ')';
	}	
 
	sQuery = "SELECT SQL_CALC_FOUND_ROWS "+aColumns.join()+" ,@s:=@s+1 serial_number FROM "+sTable+" ,(SELECT @s:= "+(querystring.iDisplayStart)+") AS s "+sWhere+ sOrder+ sLimit;
	//console.log(sQuery); 
	db.getConnection(function(err, connection){	 
		connection.query(sQuery , function(err, results) {
			if (err) {
				connection.release();
				cb(err, null);
				return;
		  	}else {
		  		connection.query("SELECT FOUND_ROWS() as num_row" , function(err, myres) {
					if (err) {
						connection.release();
						cb(err, null);
						return;
					}else {
						var iFilteredTotal = myres[0].num_row;					
						var rResult = results;    
						var total_query = "SELECT COUNT("+sIndexColumn+") as total_record FROM "+sTable;
						connection.query(total_query, function(err, result) {
							connection.release();
							if (err) {
								cb(err, null);
								return;
							}else {
								var iTotal = result[0].total_record;							
								var output = {};
								output["sEcho"] = querystring.sEcho;
								output["iTotalRecords"] = iTotal;
								output["iTotalDisplayRecords"] = iFilteredTotal; 
								output["aaData"] = [];
								var count = 0;
								for (var k in rResult)    
								{
								 output['aaData'][count] =[rResult[k].from_date,rResult[k].to_date,rResult[k].score,rResult[k].bonus];
								 count++;
								}
								var json_data = JSON.stringify(output);    
								cb(null, json_data);
							}
							
					   });							
					}							  
				});
		  	}		   
		});	   
	}); 
}

exports.check_exist = function(user,cb) {
	db.getConnection(function(err, connection){	
		var str_query = "";		
		str_query = "SELECT * FROM `user` WHERE `email`='"+user.control_value+"'";
		if(typeof user.uid != "undefined")
		{
			str_query +=" AND employee_id!='"+user.uid+"'";
		}
		
        connection.query(str_query , function(err, result) {
			connection.release();
        	var data = [];
			if (err) {
				cb(err, {});
				return;
		  	}
			
			if(result.length>0)
			{
			cb(null, "exist");
			}
			else
			{cb(null, "not_exist");}
		  	
		});
	});
}
exports.adduser = function(obj,cb){
	var binary_img = "";
	if(obj['binary_img'])
	{
		binary_img = obj['binary_img'];
		binary_img = binary_img.substr(binary_img.indexOf(',')+1);
		binary_img = binary_img.replace(/ /g, '+');
		
	}
	var md5			= require('md5');
	var pwd = md5(obj.cms_password);			
	//var user_id = userID();
	
	var	data =  {
			
				email :	obj.email,			
				point : obj.point,
				allow_cms : obj.allow_cms,
				active 	:obj. active,				
				corporate_sim_card 	:obj. corporate_sim_card,				
				cms_password : pwd,
				name : obj.name,
				biz_sector : obj.biz_sector,
				company : obj.company,
				department : obj.department,
				rank : obj.rank,
				rank_new : obj.rank_new,
				role_old : obj.role_old,
				role_new : obj.role_new,
				gender : obj.gender,
				site_location : obj.site_location,
				date_of_employment : obj.date_of_employment || null,
				probation_permanent : obj.probation_permanent,
				type_of_contract : obj.type_of_contract,
				date_of_birth : obj.date_of_birth || null,
				nationality : obj.nationality,
				direct_report_to : obj.direct_report_to,
				contact_number : obj.contact_number,
				e_id : obj.e_id	,
				e_code : obj.e_code,
				employee_id : obj.e_code+obj.e_id,
			};
		if(data["biz_sector"].toLowerCase() == "others")
		{
			data["biz_sector"] = obj.otherbizsector;
		}
		if(data["company"].toLowerCase() == "others")
		{
			data["company"] = obj.othercompany;
		}
		if(data["department"].toLowerCase() == "others")
		{
			data["department"] = obj.otherdepartment;
		}
		if(data["rank"].toLowerCase() == "others")
		{
			data["rank"] = obj.otherrank;
		}
		if(data["rank_new"].toLowerCase() == "others")
		{
			data["rank_new"] = obj.otherranknew;
		}
		if(data["role_old"].toLowerCase() == "others")
		{
			data["role_old"] = obj.otherroleold;
		}
		if(data["role_new"].toLowerCase() == "others")
		{
			data["role_new"] = obj.otherrolenew;
		}
		if(data["site_location"].toLowerCase() == "others")
		{
			data["site_location"] = obj.otherlocation;
		}
		if(data["probation_permanent"].toLowerCase() == "others")
		{
			data["probation_permanent"] = obj.otherprobation;
		}
		if(data["type_of_contract"].toLowerCase() == "others")
		{
			data["type_of_contract"] = obj.othercontract;
		}
		if(data["nationality"].toLowerCase() == "others")
		{
			data["nationality"] = obj.othernationality;
		}
		str = "INSERT into `user` SET ? ";
	db.getConnection(function(err, connection){
		var i= connection.query(str, data, function(err, result){		
			if(!err){		
				//start
				var affected_userid = data['employee_id'];		
				if(binary_img == "")
				{
					fs.createReadStream('public/assets/upload/users/defaultprofile.jpg').pipe(fs.createWriteStream('public/assets/upload/users/'+affected_userid+'.jpg'));	
				}
				else{
					fs.writeFile('public/assets/upload/users/'+affected_userid+'.jpg', binary_img, 'base64', function(err) {
					
					});
				}
				
				connection.query("UPDATE `user` SET photo='"+affected_userid+".jpg' WHERE employee_id='"+affected_userid+"'", function(err, result) {
					if (err) {
						console.log(err);
					}
					connection.release();
				});
				//end
				
				cb(null, {message : "success"} );
			}else{		
				connection.release();
				cb(err, null);				
			}
		});//console.log(i.sql);
		
	});
}


exports.attributelist = function(user,cb) {
	 var querystring = user.query_str;	 
	//start
	 var aColumns = ["id","`name` as attribute_values","(select name from attribute where id=attr_id) as attribute_name"];
	 
	 /* Indexed column (used for fast and accurate table cardinality)*/
	 var sIndexColumn = "id";
  
	/* DB table to use */
	var sTable = "`attribute_values`";
	//Paging
	var sLimit = "";
	if (querystring.iDisplayStart != 'null' && querystring.iDisplayLength != '-1' )
	{
		sLimit = "LIMIT "+querystring.iDisplayStart  +", "+
		querystring.iDisplayLength ;
	}
  
	//Ordering  
	if (querystring.iSortCol_0 != 'null' )
	{
		var sOrder = "ORDER BY  ";
		var aColumns2 = ["id","`name`","(select name from attribute where id=attr_id)"];
		for ( var i=0 ; i< parseInt(querystring.iSortingCols) ; i++ )
		{			
			if ( querystring["bSortable_"+parseInt(querystring["iSortCol_"+i])] == "true" )
			{
				
				sOrder += aColumns2[ parseInt(querystring["iSortCol_" +i])]+" "+querystring["sSortDir_"+i]  +" , ";
			}
		}
		
		sOrder = sOrder.substring(0, sOrder.length-2);
		if ( sOrder == "ORDER BY" )
		{
			sOrder = "";
		}
	}
	
	// search		
	var sWhere = " WHERE 1=1 ";

	 if ( querystring["sSearch"] != "" )
	{	var aColumns1 = ["id","`name`","(select name from attribute where id=attr_id)"];
		sWhere += " AND (";
		for ( var k=0 ; k<aColumns1.length ; k++ )
		{	
			var search_str = querystring['sSearch'].replace(/'/g, "\\'");
			sWhere += aColumns1[k]+" LIKE '%"+ search_str +"%' OR ";
		}
		sWhere = sWhere.substring(0 , sWhere.length-3 );
		sWhere += ')';
	}
 
	sQuery = "SELECT SQL_CALC_FOUND_ROWS "+aColumns.join()+" ,@s:=@s+1 serial_number FROM "+sTable+" ,(SELECT @s:= "+(querystring.iDisplayStart)+") AS s "+sWhere+ sOrder+ sLimit;
	//console.log(sQuery); 
	db.getConnection(function(err, connection){	 
		connection.query(sQuery , function(err, results) {
			if (err) {
				connection.release();
				cb(err, null);
				return;
		  	}else {
		  		connection.query("SELECT FOUND_ROWS() as num_row" , function(err, myres) {
					if (err) {
						connection.release();
						cb(err, null);
						return;
					}else {
						var iFilteredTotal = myres[0].num_row;					
						var rResult = results;    
						var total_query = "SELECT COUNT("+sIndexColumn+") as total_record FROM "+sTable;
						connection.query(total_query, function(err, result) {
							connection.release();
							if (err) {
								cb(err, null);
								return;
							}else {
								var iTotal = result[0].total_record;							
								var output = {};
								output["sEcho"] = querystring.sEcho;
								output["iTotalRecords"] = iTotal;
								output["iTotalDisplayRecords"] = iFilteredTotal; 
								output["aaData"] = [];
								var count = 0;
								for (var k in rResult)    
								{
								 output['aaData'][count] =[rResult[k].id,rResult[k].attribute_values,rResult[k].attribute_name];
								 count++;
								}
								var json_data = JSON.stringify(output);    
								cb(null, json_data);
							}
							
					   });							
					}							  
				});
		  	}		   
		});	   
	}); 
}


exports.getAttribute = function(cb){
	var result = [];
	var str = "SELECT * FROM `attribute`; ";
	//console.log(str);
	db.getConnection(function(err, connection){
		var i = connection.query(str, function(err, results) {
			connection.release();
			if (err) {
				cb(err, null);
		  	}else {				
		  		cb(null, results);
		  	}
		});//console.log(i.sql);
    });

}


exports.createAttribute = function(obj,cb){
	var data={		
			attr_id : obj.attr_id,
			name : obj.name
		}
	

	str = "INSERT into `attribute_values` SET ? ";
	db.getConnection(function(err, connection){
		var i= connection.query(str, data, function(err, result){		
			if(!err){				
				cb(null, {message : "success"} );
			}else{				
				cb(err, null);				
			}
		});//console.log(i.sql);
		connection.release();
	});
}

exports.updateAttribute = function(obj,cb){
	
	db.getConnection(function(err, connection){
		var str = "UPDATE   `attribute_values` SET `name` = "+connection.escape(obj.name)+" where id =  "+obj.id;
		var i= connection.query(str,  function(err, result){		
			if(!err){				
				cb(null, {message : "success"} );
			}else{				
				cb(err, null);				
			}
		});//console.log(i.sql);
		connection.release();
	});
}


exports.attributeedit = function(id,cb){
	

	var str = "select id,attr_id,(select a.name from `attribute` a where a.id = attr_id ) as attr_name, `name` as attr_value from  `attribute_values` where id= " + id;
	db.getConnection(function(err, connection){
		var i= connection.query(str,  function(err, result){		
			if(!err){				
				cb(null, result );
			}else{				
				cb(err, null);				
			}
		});//console.log(i.sql);
		connection.release();
	});
}

exports.getAttrById = function(cb){
	var result = [];
	var str = "SELECT DISTINCT biz_sector as name FROM `user`;";//biz_sector
		str += "SELECT DISTINCT company as name FROM `user`; ";//company
		str += "SELECT DISTINCT department as name FROM `user`; ";//department
		str += "SELECT DISTINCT gender as name FROM `user`; ";//gender
		str += "SELECT DISTINCT site_location as name FROM `user`; ";//site_location
		str += "SELECT DISTINCT probation_permanent as name FROM `user`; ";//probation_permanent
		str += "SELECT DISTINCT nationality  as name FROM `user`; ";//nationality
		str += "SELECT DISTINCT type_of_contract as name FROM `user`; ";//type_of_contract
		str += "SELECT DISTINCT rank  as name FROM `user` WHERE rank IS NOT NULL AND rank !=''; ";//rank
		str += "SELECT DISTINCT rank_new  AS name FROM `user` WHERE rank_new IS NOT NULL AND rank_new !=''; ";
		str += "SELECT DISTINCT role_old  as name FROM `user` WHERE role_old IS NOT NULL AND role_old !=''; ";
		str += "SELECT DISTINCT role_new  as name FROM `user` WHERE role_new IS NOT NULL AND role_new !=''; ";
	
	db.getConnection(function(err, connection){
		var i = connection.query(str, function(err, results) {
			connection.release();
			if (err) {
				cb(err, null);
		  	}else {				
		  		cb(null, results);
		  	}
		});//console.log(i.sql);
    });

}


exports.group_list = function(cb) {
	db.getConnection(function(err, connection){	
		
		str_query = "SELECT id, title FROM `stc_group`;";
		//str_query += "SELECT user_id, email FROM user ;";		
		str_query += "SELECT DISTINCT biz_sector as title FROM `user`;";//biz_sector
		str_query += "SELECT DISTINCT company as title FROM `user`; ";//company
		str_query += "SELECT DISTINCT department as title FROM `user`; ";//department
		str_query += "SELECT DISTINCT gender as title FROM `user`; ";//gender
		str_query += "SELECT DISTINCT site_location as title FROM `user`; ";//site_location
		str_query += "SELECT DISTINCT probation_permanent as title FROM `user`; ";//probation_permanent
		str_query += "SELECT DISTINCT nationality  as title FROM `user`; ";//nationality
		str_query += "SELECT DISTINCT type_of_contract as title FROM `user`; ";//type_of_contract
		str_query += "SELECT DISTINCT rank as title FROM `user` WHERE rank IS NOT NULL AND rank !=''; ";//rank
		str_query += "SELECT DISTINCT rank_new  as title FROM `user` WHERE rank_new IS NOT NULL AND rank_new !='' ;";
		str_query += "SELECT DISTINCT role_old  as title FROM `user` WHERE role_old IS NOT NULL AND role_old !='' ;";
		str_query += "SELECT DISTINCT role_new  as title FROM `user` WHERE role_new IS NOT NULL AND role_new !='' ;";
        connection.query(str_query , function(err, result) {
			connection.release();
        	var data = [];
			if (err) {
				cb(err, {});
				return;
		  	}else{
				if(result.length>0)
				{
				cb(null, result);
				}else
				{
					cb(null, {});
				}
		  	}
		});
	});
}

exports.delete_user = function(id, cb)
{
	db.getConnection(function(err, connection){
		connection.query('UPDATE `user` SET is_deleted = 1 WHERE employee_id = ? ', id, function(err, result){
			if(!err){
				cb(null, {message : "success"});
			}else{
				cb(err, null);
			}
		});
		connection.release();
	});
}


exports.uploaduserwithcsv = function(data, cb) {	
	//console.log(data[0]);
	var  jsondata = data.user;
	
	var mylist			= data.user;
	var count = 0;
	var md5			= require('md5');
	var pwd = md5("password");	
	//var last_update = new Date();
	//date_of_employement or date_of_birth - yyyy/mm/dd
	var userdateFormat = function(date) {
		//yyyy/mm/dd
			var mydate = date.split('/');
			var year = mydate[0];
			var month = mydate[1];	
			var day = mydate[2];
			//return [year, month, day].join('-');
			return [year, month, day].join('-');
							
	};
	
		console.log("Import Starting.....");
		
		async.eachOfSeries(mylist, function (row,key, callback) {
		
			db.select_one("user", ["employee_id", {employee_id: row.Display}], function(err, employee_id) {			
				
				if(err){
					console.log(err);
					return;
				}else{
					//var employee = row.employee_code + row.employee_id;
					
					var username = "";
					username = row.name.toLowerCase();					
					username = username.split(" ");
					//console.log(username);
					var loginname="";
					length = username.length;
					if(length>2){
						lastname = username[length - 1];
						firstname = username[1];
						middlename = "";
						for(var i=2; i<length - 1; i++){
							middlename += username[i].charAt(0);
						}
						loginname = firstname+middlename+lastname;
						
					}else{
						loginname=username[1];
					}
					
					var name_shortcut = loginname;
					db.getQuery("SELECT COUNT(employee_id) as count FROM `user` WHERE `name_shortcut` = ",loginname, function(newerr, value) {			
						
							if(newerr){
								console.log(newerr);
								return;
							}else{
								
								if(employee_id == ""){
									
									if(value[0].count>0){
										var namecount = value[0].count + 1;
										loginname = loginname+namecount;
									}
									var photo = row.Display+".jpg";
								
									var inserteddata ={};
									inserteddata.name 			= row.name|| "";
									inserteddata.email 			= loginname|| "";
									inserteddata.cms_password 	= pwd;
									//inserteddata.last_update = last_update;						
									inserteddata.biz_sector =	row.biz_sector || "";
									inserteddata.company	=	row.company || "";
									inserteddata.department	=	row.department || "";
									inserteddata.rank 		=	row.rank_old || "";
									inserteddata.rank_new 		=	row.rank_new || "";
									inserteddata.role_old 		=	row.role_old || "";
									inserteddata.role_new 		=	row.role_new || "";
									inserteddata.gender 	= 	row.gender || "";
									inserteddata.site_location		= row.site_location || "";
									inserteddata.date_of_employment	=  (row.date_of_employment != ""  && row.date_of_employment != 'null' ?userdateFormat(row.date_of_employment):null);
									inserteddata.type_of_contract	= row.type_of_contract || "";
									inserteddata.date_of_birth		= (row.date_of_birth != "" && row.date_of_birth != 'null'?userdateFormat(row.date_of_birth):null);
									inserteddata.nationality		= row.nationality || "";
									inserteddata.direct_report_to	= row.direct_report_to || "";
									inserteddata.contact_number		= row.contact_number || "";
									inserteddata.employee_id		= row.Display || "";
									inserteddata.photo		=  photo|| "";
									inserteddata.e_id		= row.employee_id || "";
									inserteddata.e_code		= row.employee_code || "";
									inserteddata.probation_permanent= row.probation_permanent || "";			
									inserteddata.name_shortcut = name_shortcut || "";			
									inserteddata.corporate_sim_card = row.corporate_sim_card || "";			
									
									db.insert("user", inserteddata, function(err, id) {							
										//console.log('insert this user >> ' + id);
										if(err)return;
										fs.createReadStream('public/assets/upload/users/defaultprofile.jpg').pipe(fs.createWriteStream('public/assets/upload/users/'+id+'.jpg'));	
										callback();
									});
								}else{
									// if(value[0].count>1){
										// var namecount = value[0].count + 1;
										// loginname = loginname+namecount;
									// }
									var inserteddata1 ={};
									//inserteddata1.name 			= row.name|| "";
									inserteddata1.email 			= row.login_name|| "";
									//inserteddata.cms_password 	= pwd;
									//inserteddata.last_update = last_update;						
									inserteddata1.biz_sector =	row.biz_sector || "";
									inserteddata1.company	=	row.company || "";
									inserteddata1.department	=	row.department || "";
									inserteddata1.rank 		=	row.rank_old || "";
									inserteddata1.rank_new 		=	row.rank_new || "";
									inserteddata1.role_old 		=	row.role_old || "";
									inserteddata1.role_new 		=	row.role_new || "";
									inserteddata1.gender 	= 	row.gender || "";
									inserteddata1.site_location		= row.site_location || "";
									inserteddata1.date_of_employment	=  (row.date_of_employment != "" && row.date_of_employment != 'null'?userdateFormat(row.date_of_employment):null);
									inserteddata1.type_of_contract	= row.type_of_contract || "";
									inserteddata1.date_of_birth		= (row.date_of_birth  != "" && row.date_of_birth != 'null'?userdateFormat(row.date_of_birth):null);
									inserteddata1.nationality		= row.nationality || "";
									inserteddata1.direct_report_to	= row.direct_report_to || "";
									inserteddata1.contact_number		= row.contact_number || "";
									//inserteddata.employee_id		= employee || "";
									inserteddata1.probation_permanent= row.probation_permanent || "";	
									inserteddata1.corporate_sim_card= row.corporate_sim_card || "";	
									//inserteddata1.name_shortcut = name_shortcut || "";	
									
									db.update("user", [inserteddata1,{employee_id:row.Display}], function(err, id) {
										
										//console.log('update this user >> ' + id);
										if(err)return;
										callback();
									});
								}
							}						
						});
				}
				count++;
			});
		}, function (err) {
			if(err){
				cb(null,err);
				return;			
			}else{
			
				console.log("Import Done");	
				cb(err,{message:"success",user:count});
			}
			
		});
}


exports.check_employeeid = function(user,cb) {
	db.getConnection(function(err, connection){	
		var str_query = "";		
		str_query = "SELECT * FROM `user` WHERE `employee_id`='"+user.control_value+"'";
		if(typeof user.uid != "undefined")
		{
			str_query +=" AND employee_id!='"+user.uid+"' ";
		}
		
        connection.query(str_query , function(err, result) {
			connection.release();
        	var data = [];
			if (err) {
				cb(err, {});
				return;
		  	}
			
			if(result.length>0)
			{
			cb(null, "exist");
			}
			else
			{cb(null, "not_exist");}
		  	
		});
	});
}