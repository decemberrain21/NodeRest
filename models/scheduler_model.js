var db = require('../helpers/database');
var async = require("async");

var formatDate = function(date) {
	var d = new Date(date),
		month = '' + (d.getMonth() + 1),
		day  = '' + d.getDate(),
		year = d.getFullYear();	
		
	if (month.length < 2) month = "0" + month;
	if (day.length < 2) day = "0" + day;	
	
	return [year, month, day].join('-');
				
}
var sd = new Date();
var ed = new Date();
var start = sd.setDate(sd.getDate() - 7);//last monday
var start_dt =  formatDate(start);
//var start_dt =  "2017-01-09";
var end = ed.setDate(ed.getDate() - 1);//last sunday
var end_dt =  formatDate(end);
//var end_dt =  "2017-01-15";
exports.set_weekly_log = function(cb) {
	db.getConnection(function(err, connection){	
	var mystr = "INSERT INTO hr_activity_log SELECT (SELECT '"+start_dt+"') AS from_date,(SELECT '"+end_dt+"') AS to_date,";
		mystr +="(SELECT COUNT(id) FROM message WHERE DATE(`date`) >= '"+start_dt+"' AND DATE(`date`) <= '"+end_dt+"' ) AS hr_msg_sent , (SELECT COUNT(id)  FROM message WHERE DATE(`date`) >= '"+start_dt+"' AND DATE(`date`) <= '"+end_dt+"' AND `data` LIKE '%\"qa\":\"%') AS hr_survey_sent,";
		mystr +="(SELECT COUNT(msg_id) FROM inbox WHERE DATE(`date`) >= '"+start_dt+"' AND DATE(`date`) <= '"+end_dt+"')AS  hr_uinvolved;";
		mystr +="INSERT INTO user_activity_log SELECT ( SELECT '"+start_dt+"') AS from_date,(SELECT '"+end_dt+"') AS to_date,";
		mystr +="(SELECT COUNT(id)  FROM message WHERE DATE(`date`) >= '"+start_dt+"' AND DATE(`date`) <= '"+end_dt+"' AND `data` LIKE '%\"qa\":\"%') AS hr_survey_sent,";
		mystr +="(SELECT COUNT(user_id) FROM inbox WHERE is_question=1 AND is_answered = 1 AND DATE(`date`) >= '"+start_dt+"' AND DATE(`date`) <= '"+end_dt+"') AS survey_answered ,";
		mystr +="(SELECT ROUND((100*(ans_user/total_user)),1) AS a_percent FROM (SELECT ( SELECT COUNT(user_id) FROM inbox WHERE is_question=1 AND DATE(`date`) >= '"+start_dt+"' AND DATE(`date`) <= '"+end_dt+"' ) AS total_user, ( SELECT COUNT(user_id) FROM inbox WHERE is_question=1 AND is_answered = 1 AND DATE(`date`) >= '"+start_dt+"' AND DATE(`date`) <= '"+end_dt+"') AS ans_user)tbl) AS answered_percentage ,";
		mystr +="(SELECT COUNT(c_id) AS r_sent FROM conversation WHERE DATE(`created_date`) >= '"+start_dt+"' AND DATE(`created_date`) <= '"+end_dt+"') AS report_sent;";
		mystr +="INSERT INTO app_penetration_log SELECT ( SELECT '"+start_dt+"') AS from_date,(SELECT '"+end_dt+"') AS to_date,";
		mystr +="(SELECT COUNT(employee_id) FROM `user` WHERE login_token IS NOT NULL AND login_token !='' AND DATE(`first_login_date`) >= '"+start_dt+"' AND DATE(`first_login_date`) <= '"+end_dt+"') AS installed_count,";
		
		mystr +="(SELECT COUNT(employee_id) FROM `user` WHERE  DATE(last_update) >= '"+start_dt+"' AND DATE(last_update) <= '"+end_dt+"') AS active_count;";
        connection.query(mystr, function(err, result) {
			//console.log(mystr);
			if (err) {
				connection.release();
				cb(err, {},null);
				return;
			}else{
			
			}
		});
	});

};

exports.set_weekly_point = function(cb) {
	
	
	var test = 0;
	db.getConnection(function(err, connection){	
        connection.query("SELECT * FROM `user` WHERE active='1' AND is_deleted = 0 " , function(err, result) {
			if (err) {
				connection.release();
				cb(err, {},null);
				return;
			}else{
				if(result.length>0)
				{
					async.each(result, function(i_data, fcallback) {
						async.waterfall([
							async.apply(myFirstFunction, i_data.employee_id),
								mySecondFunction,
								myThirdFunction,
							], function (err, result) {
								//console.log('waterfall done');
								fcallback();
								// result now equals 'done'
						});
						function myFirstFunction(arg1,callback) {
							var myq = "SELECT (SELECT COUNT(msg_id) FROM inbox WHERE user_id = '"+arg1+"' AND DATE(`date`) >= '"+start_dt+"' AND DATE(`date`) <= '"+end_dt+"') AS 'N_point',(SELECT COUNT(msg_id)  FROM inbox WHERE  user_id = '"+arg1+"' AND is_notified='1' AND DATE(`date`) >= '"+start_dt+"' AND DATE(`date`) <= '"+end_dt+"' ) AS 'M_point',(SELECT COUNT(msg_id)  FROM inbox WHERE  user_id = '"+arg1+"' AND is_read='1' AND DATE(`date`) >= '"+start_dt+"' AND DATE(`date`) <= '"+end_dt+"' ) AS 'O_point',(SELECT COUNT(msg_id)  FROM inbox WHERE  user_id = '"+arg1+"' AND is_question='1' AND DATE(`date`) >= '"+start_dt+"' AND DATE(`date`) <= '"+end_dt+"' ) AS 'Q_point',(SELECT COUNT(msg_id)  FROM inbox WHERE  user_id = '"+arg1+"' AND (is_answered='1' OR is_answered='3') AND DATE(`date`) >= '"+start_dt+"' AND DATE(`date`) <= '"+end_dt+"' ) AS 'S_point',(SELECT 500*COUNT(id) FROM `point` WHERE score > 275 AND from_date >=(SELECT DATE(NOW())  - INTERVAL 4 WEEK) AND user_id = '"+arg1+"') AS 'bonus',(SELECT score FROM `point` WHERE from_date >=(SELECT DATE(NOW())  - INTERVAL 2 WEEK) AND user_id = '"+arg1+"') AS 'prev_score'";
							
							 connection.query(myq, function(ferr, fresult) {
								if (!ferr) {
									
									if(fresult.length>0)
									{	
										callback(null,fresult[0],arg1);
									}
									else
									{
										callback(null,null,arg1);
									}
								}
								else
								{
									callback(null,null,arg1);
								}
							 });
							
						}
						function mySecondFunction(arg1,arg2,callback) {
							var score = 0;
							if(arg1)
							{
							//prev_score
							
								if(arg1.N_point == "0")
								{
									score = arg1.prev_score?arg1.prev_score:0;
								}else
								{
									if(arg1.Q_point == "0")
									{
										 
										score = ((arg1.M_point/arg1.N_point) + (arg1.O_point/arg1.N_point))*100;

									}
									else
									{
										
										
										score = ((arg1.M_point/arg1.N_point) + (arg1.O_point/arg1.N_point) + (arg1.S_point/arg1.Q_point))*100 ;//[min=0, max=300]
									}
								}
								
								if(score < 0 || isNaN(score))
								{
									score = 0;
								}
								else if(score>300)
								{
									score = 300;
								}
								
								if(arg1.bonus<0)
								{
									arg1.bonus = 0;
								}
								else if(arg1.bonus>2000)
								{
									arg1.bonus = 2000;
								}
								var ins_q = "INSERT INTO `point`(user_id,from_date,to_date,N_point,M_point,O_point,Q_point,S_point,score,bonus) VALUES ('"+arg2+"','"+start_dt+"','"+end_dt+"','"+arg1.N_point+"','"+arg1.M_point+"','"+arg1.O_point+"','"+arg1.Q_point+"','"+arg1.S_point+"','"+score+"','"+arg1.bonus+"')";
								
								connection.query(ins_q , function(err2, result2) {  
									//cb(err2, result2,msg_id);
									callback(null,arg2,result2.insertId);
								});
							}
							else
							{
								callback(null,arg2);
							}
							
						}
						function myThirdFunction(arg1,arg2,callback) {
							var myq = "SELECT * FROM `point` WHERE user_id = '"+arg1+"' ORDER BY from_date DESC LIMIT 4";
							 connection.query(myq, function(terr, tresult) {
								if (!terr) {
									if(tresult.length>0)
									{	
										var k = 0;
										var week_score = 0;
										var week1_score = 0;
										var week2_score = 0;
										var week3_score = 0;
										var bonus = 0;
										var display_score = 0;
										for(var mycnt in tresult)
										{
											//console.log(mycnt);
											//console.log(tresult[mycnt].from_date);
											if(k == 0)
											{
												week_score = tresult[mycnt].score;
												bonus = tresult[mycnt].bonus;
											}
											else if(k == 1)
											{
												week1_score = tresult[mycnt].score;
											}
											else if(k == 2)
											{
												week2_score = tresult[mycnt].score;
											}
											else if(k == 3)
											{
												week3_score = tresult[mycnt].score;
											}
											if(k == tresult.length-1)
											{
												// calculate display score and update to point
												display_score = week_score + (week1_score*0.75)+(week2_score*0.5)+(week3_score*0.25)+bonus;
												//console.log('display>'+display_score);
												var upd_q = "UPDATE `point` SET display_score ='"+display_score+"' WHERE id="+arg2+";UPDATE `user` SET `point`= '"+display_score+"' WHERE employee_id = '"+arg1+"'";
												
												connection.query(upd_q , function(err3, result3) {  
													//cb(err2, result2,msg_id);
													callback(null,"success");
												});
											}
											k++;
										}
										//callback(null,"success");
									}
									else
									{
										callback(null,"success");
									}
								}
								else
								{
									callback(null,"success");
								}
							 });
							
						}
					}, function(err) {
							connection.release();	
							cb(null,"success");							
							
					});
				}
			}
		  	
		});
	});
}


//Displeyed score will be = Score (week) + Score (week-1)*.75 + Score (week-2)*.5 + Score (week-3)*.25 + BONUS
//SELECT from_date,score,bonus FROM `point` WHERE user_id = (SELECT user_id FROM `user` WHERE login_token='v4a2ceg66r20160912d4hemggc51att9123704') ORDER BY from_date DESC LIMIT 4
//result[0].score -> week
//result[1].score * (.75) -> (week-1)
//result[2].score * (.5) -> (week-2)
//result[3].score * (.25) - (week-3)
// add result[0].bonus

exports.displayed_score = function(token,cb) {
	var str_query = "SELECT from_date,score,bonus FROM `point` WHERE user_id = (SELECT employee_id FROM `user` WHERE login_token='"+token+"') ORDER BY from_date DESC LIMIT 4";
	db.getConnection(function(err, connection){	
		
        connection.query(str_query , function(err, result) {
			connection.release();
        	var data = [];
			if (err) {
				cb(err, {});
				return;
		  	}else{
				var firstWeekScore = result[0].score; // week
				var secondWeekScore = result[1].score * (.75) || 0; // (week-1)
				var thirdWeekScore = result[2].score * (.5) || 0; // (week-2)
				var fourthWeekSocre = result[3].score * (.25) || 0; // (week-3)
				var bonus =  result[0].bonus;
				var result = firstWeekScore + secondWeekScore + thirdWeekScore + fourthWeekSocre + bonus;
				cb(null,result);
			}
			
		  	
		});
	});

}
exports.clearolddata = function(cb) {
	var str_query = "DELETE FROM answer WHERE DATE(`date`) < DATE_SUB(DATE(NOW()),INTERVAL 180 DAY);";
	str_query += "DELETE FROM conversation WHERE DATE(`created_date`) < DATE_SUB(DATE(NOW()),INTERVAL 180 DAY);";
	str_query += "DELETE FROM conversation_message WHERE DATE(`date`) < DATE_SUB(DATE(NOW()),INTERVAL 180 DAY);";
	str_query += "DELETE FROM inbox WHERE DATE(`date`) < DATE_SUB(DATE(NOW()),INTERVAL 180 DAY);";
	str_query += "DELETE FROM message WHERE DATE(`date`) < DATE_SUB(DATE(NOW()),INTERVAL 180 DAY);";
	str_query += "DELETE FROM schedule_message WHERE DATE(`schedule_date`) < DATE_SUB(DATE(NOW()),INTERVAL 180 DAY);";
	db.getConnection(function(err, connection){	
		
        connection.query(str_query , function(err, result) {
			connection.release();
			cb(null,result);
		});
	});

}
exports.send_scheduledmessage = function(cb) {
	var str_query  = "SELECT id FROM schedule_message WHERE message_send = 0 AND schedule_date <= NOW()";	
	db.getConnection(function(err, connection){
		connection.query(str_query , function(err, result) {   
		//connection.release();			
			if (err) {
				connection.release();
				cb(err,null);
				return;
			}else{
				if(result.length>0)
				{	
					var msg_ids = "";
					async.eachSeries(result, function iteratee(item, callback) {					
						if(msg_ids == "")
						{
							msg_ids = item.id;
						}
						else
						{
							msg_ids += ","+ item.id;
						}
						callback();
						
					}, function done() {
						//console.log(msg_ids);
						var test = connection.query("UPDATE message SET is_schedule = 0 , `date` =NOW() WHERE id IN ("+msg_ids+");UPDATE schedule_message SET message_send = 1 WHERE  id IN ("+msg_ids+")" , function(err2, result2) {
							connection.release();
							cb(err2,result2);
						});
						//console.log(test.sql);
						
					});
				}
				else
				{
					connection.release();
					cb(null,null);
				}
			}
		});
	});
	

}