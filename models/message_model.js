var db = require('../helpers/database');
var request = require('request');
//var mysql_1 = global.mysql;

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
	return [year, month, day].join('-')+" "+[hour, min, sec].join(':');
					
}

exports.group_list = function(cb) {
	db.getConnection(function(err, connection){	
		
		str_query = "SELECT id, title FROM `stc_group`;";
		str_query += "SELECT employee_id, email FROM user ;";		
		
        connection.query(str_query , function(err, result) {
			connection.release();
        	var data = [];
			if (err) {
				cb(err, {});
				return;
		  	}
			
			if(result.length>0)
			{
			cb(null, result);
			}
			else
			{cb(null, {});}
		  	
		});
	});
}
// exports.schedule_message = function(params,cb){
// 	cb();
// }
exports.compose_save = function(params, cb) {
	var async = require("async");
	var msg_id;	
	var is_drafts = params.is_drafts;
	var is_schedule = params.is_schedule;
	//console.log(params);
	var findinarr = function(arrhaystack,needle)
	{
		return (arrhaystack.indexOf(needle) > -1);
	};
	db.getConnection(function(err, connection){		
		if( params.g_i == "1"){
			params.group_id = "";
		}
		
		params.postdata = connection.escape(params.postdata);
		var noti_title = params.title;
		params.title = connection.escape(params.title);

		var d = "";
		if(params.state == "drafts" && params.draft_id!="")
		{
			var w = connection.query("DELETE FROM inbox WHERE msg_id="+connection.escape(params.draft_id), function(err, result) {
				
			});
			d = "UPDATE message SET `type`='"+params.type+"',`group_id`='"+(params.group_id?params.group_id.join():"NULL")+"',`data`="+params.postdata+",title="+params.title+",is_drafts="+params.is_drafts;
			if(params.is_drafts == "0")
			{
				d += ",`date`= NOW()";
			}
			d += " WHERE id="+connection.escape(params.draft_id);
			//console.log(w.sql);
		}else{
		// ################################################
		if(params.state == "schedule" && params.draft_id!="")
		{
			
			var w = connection.query("DELETE FROM inbox WHERE msg_id="+connection.escape(params.draft_id), function(err, result) {
				
			});
			d = "UPDATE message SET `type`='"+params.type+"',`group_id`='"+(params.group_id?params.group_id.join():"NULL")+"',`data`="+params.postdata+",title="+params.title+",is_schedule="+params.is_schedule;
			if(params.is_schedule == "0")
			{
				d += ",`date`= NOW()";
			}
			
			d += " WHERE id="+connection.escape(params.draft_id);
			//console.log(w.sql);
		}else{
			d ="INSERT INTO message(`type`,`group_id`,`data`,title,is_drafts,is_schedule) VALUES ('"+params.type+"','"+(params.group_id?params.group_id.join():"NULL")+"',"+params.postdata+","+params.title+","+params.is_drafts+","+params.is_schedule+")";
		}
		//console.log(d);
		}
		// if(params.is_schedule == 1){
		// 	var sch = ""
		// }
		// ################################################
		
		var myquery = connection.query(d, function(err, result) {
			
			
		if (err) {
				//console.log("here error");
				connection.release();
				cb(err,null);
				return;
		  	}
			else
			{
				
				if((params.state == "drafts" || params.state == "schedule" ) && params.draft_id!=""){
				msg_id = params.draft_id;
				}else {
					msg_id = result.insertId;
				}
				
				
				if(params.is_schedule==1 ){
					if(params.state == "schedule" && params.draft_id!=""){
						
					var ins = "UPDATE schedule_message SET `schedule_date`='"+params.schedule_date+"',`input_date`=NOW() WHERE `id`="+connection.escape(params.draft_id);
				 	msg_id = params.draft_id;
					}else{
						
						ins = "INSERT INTO schedule_message(`id`,`schedule_date`,`input_date`) VALUES ('"+result.insertId+"','"+params.schedule_date+"',NOW())";
						msg_id = result.insertId;
					}
					//console.log(ins);
					connection.query(ins, function(err, result) {
					
					if (err) {	
					connection.release();					
							cb(err);
							return;
						}
					});
				}
				if(params.state == "schedule" && params.is_schedule==0 && params.is_drafts==0){
					var del_schedule = "DELETE FROM schedule_message WHERE id ="+connection.escape(params.draft_id);
						connection.query(del_schedule, function(err, result) {
							if (err) {	
							connection.release();					
									cb(err);
									return;
								}
						});
				}
					
			
				
			
		
				//console.log(msg_id);
				/*
				params.group_id.join()
				*/
				
				var matched_results=[];	
				var string = "";	
				var is_answered ="";
				var is_question = 1;
				if(!params.is_answered){
					is_answered = "-1";
					is_question = "0"; // QUESTION IS NULL, is_question = 0;
				}else if(params.n_a == 1){
					is_answered = "2";
				}else{
					is_answered ="0";
				}
					
				if( params.g_i == "0"){
					var str_query  = "SELECT filtered_by,id FROM stc_group WHERE id IN ("+ params.group_id.join()+");";	
					//console.log(str_query);
					connection.query(str_query , function(err, result) {   
					//connection.release();			
					if (err) {
						connection.release();
						cb(err,null);
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
									//console.log(result3);
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
												//console.log(result3);
												if(!findinarr(matched_results,mydata.employee_id))
												{
													// do insert
													//string += (string == "")? "" : ",";
													
													string = '("'+msg_id+'","'+ mydata.employee_id +'",'+ params.title+','+is_answered+','+is_question+')';
													connection.query("INSERT INTO inbox(`msg_id`,`user_id`,`title`,is_answered,is_question) VALUES "+string , function(err2, result2) {   
														//console.log("INSERT INTO inbox(`msg_id`,`user_id`,`title`,is_answered,is_question) VALUES "+string);
														matched_results.push(mydata.employee_id);
														if(is_drafts == "0")
														{
															if(mydata.noti_token)
															{
																	request({
																	url: 'http://127.0.0.1:4000/fcm/SendPushNotiMessage', //URL to hit
																	//qs: {from: 'blog example', time: +new Date()}, //Query string data
																	method: 'POST',
																	//Lets post the following key/values as form
																	json: {
																		title: noti_title,
																		msg: params.message,
																		noti_token:mydata.noti_token,
																		fortype:"inbox",
																		noti_id:msg_id
																	}
																}, function(error, response, body){
																	if(error) {
																		console.log(error);
																		
																	}/* else {
																		//console.log(body.status);
																		if(body.status == "success")
																		{
																			//change is_notified to 1
																			 connection.query("UPDATE inbox SET is_notified=1 WHERE `msg_id`= ? AND `user_id` = ?",[msg_id ,mydata.user_id] , function(uerr, ures) {  
																				mycallback();
																			});
																			//console.log(test.sql);
																		}
																		else
																		{
																			mycallback();
																		}
																}*/
																
																});
																
															}
														}
														
														mycallback();
														
														
													});
													
												}
												
												
												}, function(err) {
												callback(null,matched_results);
											});
										}
										else
										{
											var res_arr = result3[0].user_id.split('\n');
											q_str = "SELECT * FROM `user` WHERE FIND_IN_SET (employee_id,'"+res_arr.join() +"')";
											
											//console.log(q_str);
											//console.log("SELECT * FROM `user` "+arg1 );
											connection.query(q_str , function(err3, result3) {
												if(result3.length == 0)
												{
													//console.log("heyyy");
													callback(null,matched_results);
												}
												else
												{
													async.each(result3, function(mydata, mycallback) {
													
														if(!findinarr(matched_results,mydata.employee_id))
														{
															// do insert
															//string += (string == "")? "" : ",";
															//string += "('"+msg_id+"','"+ mydata.user_id +"',"+ connection.escape(params.title) +")";
															string = '("'+msg_id+'","'+ mydata.employee_id +'",'+ params.title+','+is_answered+','+is_question+')';
															connection.query("INSERT INTO inbox(`msg_id`,`user_id`,`title`,is_answered,is_question) VALUES "+string , function(err2, result2) {   
																if(is_drafts == "0")
																{
																	if(mydata.noti_token)
																	{
																		request({
																			url: 'http://127.0.0.1:4000/fcm/SendPushNotiMessage', //URL to hit
																			//qs: {from: 'blog example', time: +new Date()}, //Query string data
																			method: 'POST',
																			//Lets post the following key/values as form
																			json: {
																				title: noti_title,
																				msg: params.message,
																				noti_token:mydata.noti_token,
																				fortype:"inbox",
																				noti_id:msg_id
																			}
																		}, function(error, response, body){
																			if(error) {
																				console.log(error);
																				
																			}
																			
																			/*else {
																				//console.log(body.status);
																				if(body.status == "success")
																				{
																					//change is_notified to 1
																					connection.query("UPDATE inbox SET is_notified=1 WHERE `msg_id`= ? AND `user_id` = ?",[msg_id ,mydata] , function(uerr, ures) {  
																						mycallback();
																					});
																				}
																				else
																				{
																					mycallback();
																				}
																		}*/
																		
																		});
																	}
																}
																
																mycallback();
																matched_results.push(mydata.employee_id);
																	
																
															});
															
														}
													
											}, function(err) {
												callback(null,matched_results);
											});	
												}
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
								  //console.log('A file failed to process');
								} else {
									//console.log(string);
									/*connection.release();
									cb(null, "ok",msg_id);*/
									connection.release();	
									cb(null, msg_id);
									
								}
							});
						}
						else
						{
							
							connection.release();
							cb(null,null);
							return;
						}
					}
							  	
				});
				}else if(params.g_i == "1"){
					
					var q_str = "SELECT * FROM `user` WHERE FIND_IN_SET (employee_id,'"+params.to.join() +"')";
					connection.query(q_str , function(err3, result3) {
						if(result3.length == 0)
						{
							
							connection.release();		
							cb(err3,msg_id);
							return;
							//callback(null,matched_results);
						}
						else
						{
							async.each(result3, function(i_data, callback) {
							
							//string += (string == "")? "" : ",";			
							//console.log((params.title));
							string = '("'+msg_id+'","'+ i_data.employee_id +'",'+ params.title+','+is_answered+','+is_question+')';
							//console.log("INSERT INTO inbox(`msg_id`,`user_id`,`title`,is_answered,is_question) VALUES "+string);
							connection.query("INSERT INTO inbox(`msg_id`,`user_id`,`title`,is_answered,is_question) VALUES "+string , function(err2, result2) {   
							if(is_drafts == "0")
							{
								if(i_data.noti_token)
								{
									request({
										url: 'http://127.0.0.1:4000/fcm/SendPushNotiMessage', //URL to hit
										//qs: {from: 'blog example', time: +new Date()}, //Query string data
										method: 'POST',
										//Lets post the following key/values as form
										json: {
											title: noti_title,
											msg: params.message,
											noti_token:i_data.noti_token,
											fortype:"inbox",
											noti_id:msg_id
										}
									}, function(error, response, body){
										if(error) {
											console.log(error);
											
										} 
										
										/*else {
											//console.log(body.status);
											if(body.status == "success")
											{
												//change is_notified to 1
												connection.query("UPDATE inbox SET is_notified=1 WHERE `msg_id`= ? AND `user_id` = ?",[msg_id ,i_data] , function(uerr, ures) {  
													callback();
												});
											}
											else
											{
												callback();
											}
									}*/
									
									});
								}
							}
							
							
							callback();
								
							});
							
							
						}, function(err) {
							// if any of the file processing produced an error, err would equal that error
							if( err ) {
							  // One of the iterations produced an error.
							  // All processing will now stop.
							  //console.log("here in err");
							  connection.release();	
							  //console.log('A file failed to process');
							} else {
								//console.log("INSERT INTO inbox(`msg_id`,`user_id`,`title`,is_answered,is_question) VALUES "+string);
								/*if(string !="")
								{
									connection.query("INSERT INTO inbox(`msg_id`,`user_id`,`title`,is_answered,is_question) VALUES "+string , function(err2, result2) {   
										connection.release();		
										cb(err2,msg_id);
									});
								}else{
									cb(err2,msg_id);
								}*/
								
								connection.release();		
								cb(err,msg_id);
							}
					});
						}
					});
					
				}
			}
		});
		//console.log(myquery.sql);
		
	});
}
exports.set_files = function(params, cb) {
	
	db.getConnection(function(err, connection){		
		
		var myquery = connection.query("SELECT `data` FROM message WHERE id = '"+ params.id+"'", function(err, result) {
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
				//console.log(rep_str);
				//rep_str = eval("'"+rep_str+"'");
			
				//var json_data =JSON.parse(rep_str);
				//json_data = JSON.parse(result[0].data);*/
				
				rep_str = rep_str.substr(0,rep_str.length-1);
				rep_str += ',"files":"'+params.names.join()+'"}';
				//json_data['files'] = params.names.join();
				//console.log(rep_str);
				//var data_str = '{"message":"'+esc_chars($('#msg').val().trim())+'"';
				
				//data_str = JSON.stringify(json_data);
				//data_str = esc_chars(data_str);
				//console.log(data_str);
				str_query  = "UPDATE message SET `data` ='"+rep_str+"' WHERE id = '"+ params.id+"';";	
				//console.log(str_query);
				connection.query(str_query , function(err, result) {   
					connection.release();			
					if (err) {
						cb(err, {});
						return;
					}else{
						cb(err, result);
					}
				});
			}
		});
		//console.log("string >>> "+string);
		
	});
}
exports.get_sentemail = function(user,cb) {
	 var querystring = user.query_str;	 
	//start
	 var aColumns = ["id","type","title","date"];
	 
	 /* Indexed column (used for fast and accurate table cardinality)*/
	 var sIndexColumn = "id";
  
	/* DB table to use */
	var sTable = "message";
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
	var sWhere = " WHERE is_drafts = 0 AND is_schedule=0 ";
	/* " WHERE player_key is not null   "; 
	 */
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
								 output['aaData'][count] =[rResult[k].id,rResult[k].type,rResult[k].title,rResult[k].date];
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

exports.msg_detail = function(id,cb){
	var result = [];
	var str = "select * from message where id = "+ id +";";
	str += " SELECT (SELECT COUNT(user_id) FROM inbox WHERE msg_id = "+id+" ) AS sent_count,(SELECT COUNT(user_id) FROM inbox WHERE msg_id = "+id+" AND is_read=1 ) AS read_count,(SELECT COUNT(user_id) FROM inbox WHERE msg_id = "+id+" AND is_notified=1 ) AS received_count,(SELECT COUNT(user_id) FROM inbox WHERE msg_id = "+id+" AND is_answered = 1) AS answer_count,(SELECT COUNT(user_id) FROM inbox WHERE msg_id = "+id+" AND is_answered = -1) AS no_q;";
	str +=" SELECT  user.`name`,user.department,user.biz_sector FROM inbox JOIN `user` ON inbox.user_id = user.employee_id WHERE inbox.msg_id = "+id+" ;"
	str +="SELECT user.name,user.biz_sector,user.department FROM answer JOIN `user` ON answer.user_id = user.employee_id WHERE answer.msg_id ="+id+" AND answer.answer = 'na'";
	//console.log(str);
	db.getConnection(function(err, connection){
		 connection.query(str, function(err, results) {
			//console.log(results[0]);
			//var test =JSON.stringify(results[0].data);
			
			if (err) {
				connection.release();
				cb(err, null);
		  	}else {	
			//console.log(results);
				if(results[0].length == 0){
					connection.release();
					cb(err, results[0]);
				}else{
					
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
						//var test = '{"message":"Hello all,\\nI\'m so glad to seeing you.\\nthat is \\"Happy\\",\\nWell.\\nGood Luck","links":"Click to see what\'s up with google|http:\\\/\\\/google.com","qa":"What\'s your opinion","ans_type":"radio","options":"that\'s great;;that\'s nothing special"}';
						var mydata =JSON.parse(rep_str);
						//console.log("My Testing");
						//console.log(mydata);
						mydata["group_id"] = results[0][0].group_id;
						mydata["type"] = results[0][0].type;
						mydata["title"] = results[0][0].title;
						//console.log(mydata);
						//console.log(results[0]);
						//console.log(results[1][0]);
						mydata["sent_count"] = results[1][0].sent_count;
						mydata["received_count"] = results[1][0].received_count;						
						mydata["read_count"] = results[1][0].read_count;
						mydata["answer_count"] = results[1][0].answer_count;
						mydata["no_q"] = results[1][0].no_q;
						mydata["sent_user"] = results[2];
						
						if(typeof mydata.n_a != "undefined" )
						{
							if(mydata.n_a != "0")
							{
								mydata["is_na"] = "1";
							}
							else
							{
								mydata["is_na"] = "0";
							}
							
						}
						else
						{
							mydata["is_na"] = "0";
						}
						mydata["na_users"] = results[3];
						mydata["na_cnt"] = results[3].length;
						
						
							
							var str2 = "";
							var opt_count = "";
							str2 = "SELECT 1=1;";
							/*if(results[0][0].group_id !="" && results[0][0].group_id !="NULL")
							{
								str2 = "SELECT GROUP_CONCAT(title) as sent_to FROM stc_group WHERE id IN ("+results[0][0].group_id+");";
								
							}
							else
							{
								str2 = "SELECT GROUP_CONCAT(email) as sent_to FROM `user` WHERE user_id IN ( SELECT user_id FROM inbox WHERE msg_id ='"+id+"');";
							}*/
							if(mydata.ans_type == "rating")
							{
								str2 += "SELECT COUNT(user_id)AS total,(SELECT COUNT(user_id) FROM answer WHERE answer='1' AND msg_id ="+id+") AS onestar,";
								str2 += "(SELECT COUNT(user_id) FROM answer WHERE answer='2' AND msg_id ="+id+") AS twostar,(SELECT COUNT(user_id) FROM answer WHERE answer='3' AND msg_id ="+id+") AS threestar,";
								str2 += "(SELECT COUNT(user_id) FROM answer WHERE answer='4' AND msg_id ="+id+") AS fourstar,(SELECT COUNT(user_id) FROM answer WHERE answer='5' AND msg_id ="+id+") AS fivestar";
								str2 += " FROM answer WHERE answer != 'na' AND msg_id ="+id;
							}
							else if(mydata.ans_type == "radio")
							{
								opt_count = mydata.options.split(';;');
								str2 +="SELECT COUNT(user_id) AS total ";
								for(var i =0;i<opt_count.length;i++)
								{
									str2 +=",(SELECT COUNT(user_id) FROM answer WHERE msg_id="+id+" AND answer="+connection.escape(opt_count[i])+") AS 'option_"+i+"'";
								}
								
								str2 +=" FROM answer WHERE answer != 'na' AND msg_id ="+id;
							}
							else if(mydata.ans_type == "checkbox")
							{
								opt_count = mydata.options.split(';;');
								str2 +=" SELECT ROUND (( LENGTH((SELECT GROUP_CONCAT(answer SEPARATOR  '|') FROM answer WHERE msg_id ="+id+")) - LENGTH( REPLACE ( (SELECT GROUP_CONCAT(answer SEPARATOR  '|') FROM answer WHERE msg_id ="+id+"), '|', '') ) ) / LENGTH('|')+1 ) AS total";
								for(var i =0;i<opt_count.length;i++)
								{
									str2 +=",(SELECT COUNT(user_id) FROM answer WHERE msg_id="+id+" AND answer LIKE '%"+opt_count[i]+"%') AS 'option_"+i+"'";
								}
								
								str2 +=" FROM answer WHERE answer != 'na' AND msg_id ="+id;
							}
							//console.log("Hellotest");
							//console.log(str2);
							connection.query(str2, function(err2, results2) {
								
								connection.release();
								if (err2) {
									cb(err2, null);
								}else {				
									//mydata["sent_to"] = (results2.length > 1?results2[0][0].sent_to:results2[0].sent_to);
									//mydata["sent_to"] = results2[0].sent_to;
									//console.log(results2.length > 1);
									if(mydata.ans_type == "rating")
									{
										if(results2[1].length>0)
										{
											mydata["totalstar"] = results2[1][0].total;
											mydata["onestar"] = results2[1][0].onestar;
											mydata["twostar"] = results2[1][0].twostar;
											mydata["threestar"] = results2[1][0].threestar;
											mydata["fourstar"] = results2[1][0].fourstar;
											mydata["fivestar"] = results2[1][0].fivestar;
										}
									}
									else if(mydata.ans_type == "radio")
									{
										if(results2[1].length>0)
										{
											mydata["total"] = results2[1][0].total;
											
											mydata['rdo_options'] = {};
											for(var i =0;i<opt_count.length;i++)
											{
												//opt_count[i]
												//console.log('>>>'+JSON.stringify(results2[1][0]["option_1"]));
												 mydata['rdo_options']["option_"+i] =results2[1][0]["option_"+i];
											}
										}
									}
									else if(mydata.ans_type == "checkbox")
									{
										if(results2[1].length>0)
										{
											mydata["total"] = results2[1][0].total;
										
											mydata['chk_options'] = {};
											for(var i =0;i<opt_count.length;i++)
											{
												//opt_count[i]
												//console.log('>>>'+opt_count[i]);
												//console.log(results2[1][0]);
												 mydata['chk_options'][opt_count[i]] =results2[1][0]["option_"+i];
											}
										}
										
									}
									//console.log(mydata);
									//mydata["test"]="hellooooooo";
									cb(null, mydata);
								}
							});
							//cb(null, results);
				
				}

		  	}
		});
    });

}

exports.select_user = function(cb){
	var result = [];
	var str = "select * from user; ";
	
	db.getConnection(function(err, connection){
		connection.query(str, function(err, results) {
			connection.release();
			if (err) {
				cb(err, null);
		  	}else {				
		  		cb(null, results);
		  	}
		});
    });

}

exports.conversationbyuserid = function(user,cb) {
	 var querystring = user.query_str;	 
	//start  
	 var aColumns = ["`c_id`","employee_id","email","`name`","user_id","`subject`","conversation.`last_update`" ,"is_anonymous"];
	
	 /* Indexed column (used for fast and accurate table cardinality)*/
	 var sIndexColumn = "c_id";
  
	/* DB table to use */
	var sTable = "`conversation`";

	//Paging
	var sLimit = "";
	var alternate_query = "0";
	if (querystring.iDisplayStart != 'null' && querystring.iDisplayLength != '-1' )
	{
		sLimit = " LIMIT "+querystring.iDisplayStart  +", "+
		querystring.iDisplayLength ;
	}
	var sQuery = "";
	//Ordering  

	if (querystring.iSortCol_0 != 'null' )
		{

			var sOrder = "ORDER BY ";
			if(parseInt(querystring.iSortCol_0) == 1 || parseInt(querystring.iSortCol_0) == 2 || parseInt(querystring.iSortCol_0) == 3)
			{
				alternate_query = "1";
			}
			for ( var i=0 ; i< parseInt(querystring.iSortingCols) ; i++ )
			{	
				if(i>0){
					sOrder += " ," ;
				}
				if ( querystring["bSortable_"+parseInt(querystring["iSortCol_"+i])] == "true" )
				{
					
				
					sOrder += aColumns[ parseInt(querystring["iSortCol_" +i])]+" "+querystring["sSortDir_"+i] ;
					
				}
			}
		//console.log(sOrder);
			
			
		}
	
	// search		
	var sWhere = " WHERE 1=1   ";
	/*if(querystring.id != "" && querystring.id != "null")
	{
		 sWhere += " AND user_id = '"+ querystring.id +"' " ;
	} 
	if(querystring.date_from != "" && querystring.date_from != "null" && querystring.date_to != "" && querystring.date_to != "null")
	{
		sWhere += "  AND date BETWEEN '"+querystring.date_from+"' AND '"+querystring.date_to+"' ";
	}*/
	
	// if ( querystring["sSearch"] != "" )
	// {
	// 	sWhere += " AND (";
	// 	for ( var k=0 ; k<aColumns.length ; k++ )
	// 	{
	// 		sWhere += aColumns[k]+" LIKE '%"+ querystring['sSearch'] +"%' OR ";
	// 	}
	// 	sWhere = sWhere.substring(0 , sWhere.length-3 );
	// 	sWhere += ')';
	// }
	
	//group
	// var sGroup =" ,DAY(ps.updated_at) ";
	/*if(querystring.date != "" && querystring.date != "null" && querystring.date == "1")
		{ 
			 sGroup = " ,WEEK(ps.updated_at)  ";
		}
	if(querystring.date != "" && querystring.date != "null" && querystring.date == "2")
		{	
			 sGroup = " ,MONTH(ps.updated_at)  ";
		}	 
	 */
	// ####################### SEARCH ############################
	var unr = querystring.opt_type;
	if (querystring.opt_type != "" && querystring.opt_type != "null")
	{
		 unr = querystring.opt_type;
	}
	if (querystring.sdate != "" && querystring.sdate != "null")
	{
		sWhere +=" AND DATE(conversation.`last_update`)>= DATE('"+querystring.sdate+"')";
	}
	if (querystring.edate != "" && querystring.edate != "null")
	{
		sWhere +=" AND DATE(conversation.`last_update`)<= DATE('"+querystring.edate+"')";
	}
	/*if (querystring.keyword != "" && querystring.keyword != "null" )
	{
		//sWhere += " AND (conversation.`c_id` LIKE '%"+querystring.keyword+"%' OR conversation.`user_id` LIKE '%"+querystring.keyword+"%' OR conversation.subject LIKE '%"+querystring.keyword+"%' OR conversation.`last_update` LIKE '%"+querystring.keyword+"%' )";
		sWhere += " AND (";
		for ( var k=0 ; k<aColumns.length ; k++ )
		{
			if(aColumns[k] !="employee_id" && aColumns[k] !="email" && aColumns[k] !="name")
			{
				sWhere += aColumns[k]+" LIKE '%"+ querystring.keyword +"%' OR ";
			}
			
		}
		sWhere = sWhere.substring(0 , sWhere.length-3 );
		sWhere += ')';
	}*/
		var having_statement = "";
		if(unr || querystring.keyword)
		{
			having_statement = " HAVING ";
			if(unr)
			{
				having_statement +="unread ="+unr;
			}
			if(querystring.keyword)
			{
				if(having_statement != " HAVING ")
				{
					having_statement +=" AND ";
				}
				having_statement +="(`c_id` LIKE '%"+ querystring.keyword +"%' OR `subject` LIKE '%"+ querystring.keyword +"%' OR employee_id LIKE '%"+ querystring.keyword +"%' OR email LIKE '%"+ querystring.keyword +"%' OR `name` LIKE '%"+ querystring.keyword +"%')";
			}
			
		}
		
		
	// ####################### SEARCH ############################
		sQuery = "SELECT SQL_CALC_FOUND_ROWS `c_id`, IF(is_anonymous = 1, 'Anonymous', u.employee_id) AS employee_id,IF(is_anonymous = 1, 'Anonymous', u.email) AS email,IF(is_anonymous = 1, 'Anonymous',u.name) AS `name`,`subject`,conversation.`last_update`,is_anonymous ,@s:=@s+1 serial_number,(SELECT conversation_message.type FROM conversation_message WHERE conversation_message.c_id=conversation.c_id AND sender='user'  ORDER BY conversation_message.id DESC LIMIT 1)as type,(SELECT COUNT(id) FROM conversation_message WHERE conversation_message.c_id=conversation.c_id AND sender='user' AND is_read = 0) AS `unread` FROM "+sTable+" LEFT JOIN `user` u ON u.employee_id = conversation.user_id   ,(SELECT @s:= "+(querystring.iDisplayStart)+") AS s "+ sWhere + " GROUP BY conversation.`c_id`,`user_id` "+having_statement+" "+ sOrder + sLimit ;
	
	//console.log("mytesting");
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
									output['aaData'][count] =[rResult[k].c_id,rResult[k].employee_id,rResult[k].email,rResult[k].name,rResult[k].unread, rResult[k].subject,formatDate(rResult[k].last_update),rResult[k].type,rResult[k].is_anonymous];
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

exports.messagedetailforconversation = function(id,cb){
	var result = [];
	var str ="SELECT c_id, (SELECT u.name FROM `user` u WHERE u.employee_id = conversation.user_id LIMIT 1) AS user_email, (SELECT u.photo FROM `user` u WHERE u.employee_id = conversation.user_id LIMIT 1) AS photo,(SELECT u.rank FROM `user` u WHERE u.employee_id = conversation.user_id LIMIT 1) AS rank,(SELECT u.department FROM `user` u WHERE u.employee_id = conversation.user_id LIMIT 1) AS department, is_anonymous, `subject` FROM conversation WHERE c_id = "+id;
	str += ";select SQL_CALC_FOUND_ROWS * from conversation_message cm WHERE cm.c_id ="+id + " ORDER BY DATE DESC LIMIT 0,10;";
	str += "SELECT MAX(id) as max_id FROM conversation_message WHERE c_id = "+id+";UPDATE conversation_message SET is_read =1 WHERE c_id ='"+id+"' AND sender = 'user';";
	//console.log("mytestlog");
	//console.log(str);
	db.getConnection(function(err, connection){
		var i = connection.query(str, function(err, results) {
			connection.release();
			if (err) {
				cb(err, null);
		  	}else {		
			
				if(results[1].length == 0){
					cb(null, results[1]);
				}else{
					connection.query("SELECT FOUND_ROWS() as num_row" , function(err, myres) {
						
						results[0][0]["total"] = myres[0].num_row;
						//console.log(results);
						cb(null, results);
					});
					
				}
			}
		});//console.log(i.sql);
    });

}
exports.getnewmsg = function(cid,id,cb){
	var result = [];
	
	var str ="SELECT * from conversation_message cm WHERE cm.c_id ="+cid + " AND id > "+id+" ORDER BY id";
	str += ";SELECT MAX(id) as max_id FROM conversation_message WHERE c_id = "+cid+" AND id > "+id+";UPDATE conversation_message SET is_read =1 WHERE c_id ='"+id+"' AND sender = 'user';";
	//console.log("mytestlog");
	//console.log(str);
	db.getConnection(function(err, connection){
		var i = connection.query(str, function(err, results) {
			connection.release();
			if (err) {
				cb(err, null);
		  	}else {		
			
				if(results[1].length == 0){
					cb(null, results);
				}else{					
					cb(null, results);				
					
				}
			}
		});//console.log(i.sql);
    });

}
exports.searchCMForseemore = function(obj,cb){
	var result = [];
	var id = obj.c_id;
	var offset = obj.offset;
	var str = "select * from  conversation_message cm WHERE cm.c_id ="+id + " LIMIT 1 OFFSET "+ offset +" ;";
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
exports.newreport = function(cb){
	
	var str = "SELECT SUM(unread) as cnt FROM (SELECT (SELECT IF(COUNT(id)>0,1,0)  FROM conversation_message WHERE conversation_message.c_id=conversation.c_id AND sender='user' AND is_read = 0) AS `unread` FROM `conversation` GROUP BY conversation.`c_id`,`user_id` )tbl";
	db.getConnection(function(err, connection){
		var i = connection.query(str, function(err, results) {
			connection.release();
			if (err) {
				cb(err, null);
		  	}else {				
				
		  		cb(null, results[0].cnt);
		  	}
		});//console.log(i.sql);
    });

}

exports.conversationDetailFiles = function(params, cb) {
	
	db.getConnection(function(err, connection){		
		
		var myquery = connection.query("SELECT `data` FROM conversation_message WHERE id = '"+ params.id+"'", function(err, result) {
		  if (err) {
				connection.release();
				cb(err, null);
				return;
		  	}
			else
			{
				//var res_data= result[0].data;
				var res_data= result[0].data;
				var rep_str = res_data.replace(/[\\]/g, '\\\\')
				.replace(/[']/g, "\\'")
				.replace(/[\/]/g, '\\/')
				.replace(/[\b]/g, '\\b')
				.replace(/[\f]/g, '\\f')
				.replace(/[\n]/g, '\\n')
				.replace(/[\r]/g, '\\r')
				.replace(/[\t]/g, '\\t');
				//console.log(rep_str);
				
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

exports.saveHrReplyMessage = function(obj,cb){
	var result = [];
	var newdate = formatDate(new Date());
	var conversation_message = {
					type 	: obj.type,
					data 	: obj.postdata,
					sender	: "hr",
					c_id	: obj.c_id,
					date : newdate
				}
				var nextstr = "INSERT INTO `conversation_message` SET ?;UPDATE `conversation` SET `last_update` = '"+ newdate+"' WHERE c_id = '"+ obj.c_id+"';";
				db.getConnection(function(err, connection){
					var i=connection.query(nextstr, conversation_message, function(err2, result2) {
						
						connection.release();
						if (err2) {
							cb(err2, result2);
						}else {				
							var cm_id =   result2.insertId;
							q_str = "SELECT `conversation`.user_id,`conversation`.subject,user.noti_token FROM `conversation` JOIN `user` ON conversation.user_id=`user`.employee_id  WHERE `conversation`.c_id ="+connection.escape(obj.c_id);
							connection.query(q_str , function(err3, result3) {
								request({
								url: 'http://127.0.0.1:4000/fcm/SendPushNotiMessage', //URL to hit
								//qs: {from: 'blog example', time: +new Date()}, //Query string data
								method: 'POST',
								//Lets post the following key/values as form
								json: {
									title: "You have a new conversation!",
									msg: result3[0].subject,
									noti_token:result3[0].noti_token,
									fortype:"report",
									noti_id:obj.c_id
								}
							}, function(error, response, body){
								if(error) {
									console.log(error);
									
								}/* else {
									//console.log(body.status);
									if(body.status == "success")
									{
										//change is_notified to 1
										 connection.query("UPDATE inbox SET is_notified=1 WHERE `msg_id`= ? AND `user_id` = ?",[msg_id ,mydata.user_id] , function(uerr, ures) {  
											mycallback();
										});
										//console.log(test.sql);
									}
									else
									{
										mycallback();
									}
							}*/
							
							});
								
							});
							
				cb(err2, result2,cm_id);
			}
		});//console.log(i.sql);
    });
}

//answer

exports.answerlist = function(user,cb) {
	 var querystring = user.query_str;	 
	//start
	 var aColumns = ["msg_id","u.employee_id","u.email","u.name","u.biz_sector","subject","question","answer","ans_type","date"];
	 
	 /* Indexed column (used for fast and accurate table cardinality)*/
	 var sIndexColumn = "msg_id";
  
	/* DB table to use */
	var sTable = "answer";
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
	var sWhere = " WHERE 1=1 ";
	/* " WHERE player_key is not null   ";  */
	/*
	
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
	*/
	if (querystring.ans_type != "" && querystring.ans_type != "null")
	{
		sWhere +=" AND ans_type = '"+querystring.ans_type+"' ";
	}
	if (querystring.from != "" && querystring.from != "null")
	{
		sWhere +=" AND DATE(`date`) >= DATE('"+querystring.from+"')";
	}
	if (querystring.to != "" && querystring.to != "null")
	{
		sWhere +=" AND DATE(`date`) <= DATE('"+querystring.to+"')";
	}
	if (querystring.keyword != "" && querystring.keyword != "null" )
	{
		sWhere += " AND (user_id LIKE '%"+querystring.keyword+"%' OR `subject` LIKE '%"+querystring.keyword+"%' OR question LIKE '%"+querystring.keyword+"%' OR `answer` LIKE '%"+querystring.keyword+"%' )";
	}
	sQuery = "SELECT SQL_CALC_FOUND_ROWS "+aColumns.join()+" ,@s:=@s+1 serial_number FROM "+sTable+"   LEFT JOIN `user` u ON u.employee_id = answer.user_id  ,(SELECT @s:= "+(querystring.iDisplayStart)+") AS s "+sWhere+ sOrder+ sLimit;
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
								 output['aaData'][count] =[rResult[k].msg_id,rResult[k].employee_id,rResult[k].email,rResult[k].name,rResult[k].biz_sector,rResult[k].subject,rResult[k].question,rResult[k].answer,rResult[k].ans_type,rResult[k].date];
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
exports.answer_data = function(qdata,cb) {
	var aColumns = ["msg_id","user_id","subject","question","answer","date"];
	var querystring = qdata.query_str;
	var sWhere = " WHERE 1=1 ";
	if (querystring.ans_type != "" && querystring.ans_type != "null")
	{
		sWhere +=" AND ans_type = '"+querystring.ans_type+"' ";
	}
	if (querystring.from != "" && querystring.from != "null")
	{
		sWhere +=" AND DATE(`date`) >= DATE('"+querystring.from+"')";
	}
	if (querystring.to != "" && querystring.to != "null")
	{
		sWhere +=" AND DATE(`date`) <= DATE('"+querystring.to+"')";
	}
	if (querystring.keyword != "" && querystring.keyword != "null" )
	{
		sWhere += " AND (user_id LIKE '%"+querystring.keyword+"%' OR `subject` LIKE '%"+querystring.keyword+"%' OR question LIKE '%"+querystring.keyword+"%' OR `answer` LIKE '%"+querystring.keyword+"%' )";
	}
	var sOrder = "ORDER BY  ";
	if (querystring.sortedCol)
	{
		sOrder += aColumns[querystring.sortedCol]+" "+querystring.sortedDir;
	}
	sQuery = "SELECT * FROM `answer` "+ sWhere+ sOrder;
	db.getConnection(function(err, connection){
		
        connection.query(sQuery , function(err, results) {
			//console.log(results);
			connection.release();
			if (err) {
				console.log(err);
				cb(err, null);
				return;
		  	}
			else
			cb(null, results);	
		});
	});
};
exports.answerbyid = function(id,cb){
	var result = [];
	var str = "SELECT b.msg_id,(SELECT a.email FROM `user` a WHERE a.employee_id=b.user_id) AS user_id,b.subject,b.question,b.answer,b.ans_type,b.date FROM answer b WHERE b.msg_id= "+ id +"; ";
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

exports.tousers = function(user,cb) {
	var user = user.user;
	//songtitle = user.q;
	//user = extractMainChar(user);
	//console.log(user);
	db.getConnection(function(err, connection){	

		str_query = "SELECT SQL_CALC_FOUND_ROWS employee_id,name,biz_sector,department FROM `user` WHERE is_deleted = 0 AND `name` LIKE '%"+user.term+"%'";

		//console.log(str_query);
        connection.query(str_query , function(err, result) {
			connection.query("SELECT FOUND_ROWS() as num_row" , function(err, myres) {
			
				if (err) {
					
					cb(err, null);
					return;
				}
				var output = {};
				output["total_count"] = myres[0].num_row;
				output["result"] = result;
			  	connection.release();
			  					
				cb(null, output);	
				
			});
		
		  	
		});
	});
}


exports.draftslist = function(user,cb) {
	 var querystring = user.query_str;	 
	//start
	 var aColumns = ["id","type","title","date"];
	 
	 /* Indexed column (used for fast and accurate table cardinality)*/
	 var sIndexColumn = "id";
  
	/* DB table to use */
	var sTable = "message";
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
	var sWhere = " WHERE is_drafts=1 ";
	/* " WHERE player_key is not null   "; 
	 */
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
								 output['aaData'][count] =[rResult[k].id,rResult[k].type,rResult[k].title,rResult[k].date];
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
// ######################################################################
exports.schedulelist = function(user,cb) {
	 var querystring = user.query_str;	 
	//start
	 var aColumns = ["id","type","title","date"];
	 
	 /* Indexed column (used for fast and accurate table cardinality)*/
	 var sIndexColumn = "id";
  
	/* DB table to use */
	var sTable = "message";
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
	var sWhere = " WHERE is_schedule=1 ";
	/* " WHERE player_key is not null   "; 
	 */
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
								 output['aaData'][count] =[rResult[k].id,rResult[k].type,rResult[k].title,rResult[k].date];
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
// ######################################################################

exports.deleteDraft = function(id, cb)
{
	db.getConnection(function(err, connection){
		connection.query('DELETE FROM message WHERE id = ?;DELETE FROM inbox WHERE msg_id = ? ', [id,id], function(err, result){
			if(!err){
				cb(null, {message : "success"});
			}else{
				cb(err, null);
			}
		});
		connection.release();
	});
}

exports.draftsbyID = function(id,cb){
	var result = [];
	var str = "select * from message where id = "+ id +";";
		str +='SELECT user_id AS id,(SELECT CONCAT(`name`," , ",biz_sector," , ",department) FROM `user` WHERE employee_id=user_id) AS `text` FROM inbox WHERE inbox.msg_id = '+id;	//console.log(str);
	db.getConnection(function(err, connection){
		 connection.query(str, function(err, results) {
			//console.log(results[0]);
			//var test =JSON.stringify(results[0].data);
			
			if (err) {
				connection.release();
				cb(err, null);
		  	}else {	
			//console.log(results);
				if(results[0].length == 0){
					connection.release();
					cb(err, results[0]);
				}else{
					
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
						//var test = '{"message":"Hello all,\\nI\'m so glad to seeing you.\\nthat is \\"Happy\\",\\nWell.\\nGood Luck","links":"Click to see what\'s up with google|http:\\\/\\\/google.com","qa":"What\'s your opinion","ans_type":"radio","options":"that\'s great;;that\'s nothing special"}';
						var mydata =JSON.parse(rep_str);
						mydata["group_id"] = results[0][0].group_id;
						mydata["type"] = results[0][0].type;
						mydata["title"] = results[0][0].title;
						mydata["sent_user"] = results[1];
						//console.log(mydata["sent_user"]);
						cb(null, mydata);
				}

		  	}
		});
    });

}
// #####################################################
exports.schedulebyID = function(id,cb){
	var result = [];
	var str = "select * from message where id = "+ id +";";
		str +='SELECT user_id AS id,(SELECT CONCAT(`name`," , ",biz_sector," , ",department) FROM `user` WHERE employee_id=user_id) AS `text` FROM inbox WHERE inbox.msg_id = '+id+";";	//console.log(str);
		str +='select schedule_date from schedule_message where id = '+ id;	//console.log(str);
	db.getConnection(function(err, connection){
		 connection.query(str, function(err, results) {
			//console.log(results[0]);
			//var test =JSON.stringify(results[0].data);
			
			if (err) {
				connection.release();
				cb(err, null);
		  	}else {	
			//console.log(results);
				if(results[0].length == 0){
					connection.release();
					cb(err, results[0]);
				}else{
					
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
						//var test = '{"message":"Hello all,\\nI\'m so glad to seeing you.\\nthat is \\"Happy\\",\\nWell.\\nGood Luck","links":"Click to see what\'s up with google|http:\\\/\\\/google.com","qa":"What\'s your opinion","ans_type":"radio","options":"that\'s great;;that\'s nothing special"}';
						var mydata =JSON.parse(rep_str);
						mydata["group_id"] = results[0][0].group_id;
						mydata["type"] = results[0][0].type;
						mydata["title"] = results[0][0].title;
						mydata["schedule_date"] = results[2][0].schedule_date;
						mydata["sent_user"] = results[1];
						//console.log("sent_user");
						//console.log(mydata["sent_user"]);
						cb(null, mydata);
				}

		  	}
		});
    });
    

}
exports.deleteSchedule = function(id, cb){
	db.getConnection(function(err, connection){
		connection.query('DELETE FROM message WHERE id = ?;DELETE FROM schedule_message WHERE id = ?;DELETE FROM inbox WHERE msg_id = ? ', [id,id,id], function(err, result){
			if(!err){
				cb(null, {message : "success"});
			}else{
				cb(err, null);
			}
		});
		connection.release();
	});
}
// #####################################################
