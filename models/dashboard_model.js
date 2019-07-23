var db = require('../helpers/database');
//app penetration
/*
SELECT * FROM app_penetration_log WHERE from_date >= (SELECT DATE_ADD((SELECT DATE(NOW()) - INTERVAL 16 WEEK), INTERVAL - WEEKDAY(CURDATE()) DAY))
*/
//active log
/*
SELECT * FROM active_log WHERE from_date >= (SELECT DATE_ADD((SELECT DATE(NOW()) - INTERVAL 16 WEEK), INTERVAL - WEEKDAY(CURDATE()) DAY))
*/
//hr_activity
/*
SELECT * FROM hr_activity_log WHERE from_date >= (SELECT DATE_ADD((SELECT DATE(NOW()) - INTERVAL 16 WEEK), INTERVAL - WEEKDAY(CURDATE()) DAY))
*/
//user_activity
/*
SELECT * FROM user_activity_log WHERE from_date >= (SELECT DATE_ADD((SELECT DATE(NOW()) - INTERVAL 16 WEEK), INTERVAL - WEEKDAY(CURDATE()) DAY))
*/
exports.app_penetration = function(cb){

	//var str = "SELECT SUM(installed_cnt) AS ins_cnt,SUM(active_cnt) AS act_cnt,fd FROM (SELECT COUNT(employee_id) AS installed_cnt,'0' AS active_cnt,DATE(first_login_date) AS fd FROM `user` WHERE login_token IS NOT NULL AND login_token !='' AND DATE(DATE_SUB(NOW(),INTERVAL 7 DAY)) <= DATE(first_login_date) GROUP BY fd  UNION ALL  SELECT '0' AS installed_cnt,COUNT(employee_id) AS active_cnt,DATE(last_update) AS fd FROM `user` WHERE DATE(DATE_SUB(NOW(),INTERVAL 7 DAY)) <= DATE(last_update) GROUP BY fd) X GROUP BY fd;";
	var str = "SELECT CONCAT(YEAR(app_penetration_log.from_date),'-w',WEEKOFYEAR(app_penetration_log.from_date))  AS show_date ,app_penetration_log.* FROM app_penetration_log WHERE from_date >= (SELECT DATE_ADD((SELECT DATE(NOW()) - INTERVAL 16 WEEK), INTERVAL - WEEKDAY(CURDATE()) DAY));";
	str +="SELECT COUNT(employee_id) as active_count FROM `user` WHERE DATE(DATE_SUB(NOW(),INTERVAL 7 DAY)) <=DATE(last_update)";
	db.getConnection(function(err, connection){
	//conversation['subject'] = connection.escape(conversation['subject']);
		var w = connection.query(str, function(err, result) {
			connection.release();
			//console.log("app_penetration");
			//console.log(result);
			if (err) {
				cb(err, null);
			}else {		
				
				var data =   result;
				cb(err, data);
			}
		});//console.log(w.sql);
    });
	
}

exports.hr_chart = function(cb){

	//var str = "SELECT SUM(installed_cnt) AS ins_cnt,SUM(active_cnt) AS act_cnt,fd FROM (SELECT COUNT(employee_id) AS installed_cnt,'0' AS active_cnt,DATE(first_login_date) AS fd FROM `user` WHERE login_token IS NOT NULL AND login_token !='' AND DATE(DATE_SUB(NOW(),INTERVAL 7 DAY)) <= DATE(first_login_date) GROUP BY fd  UNION ALL  SELECT '0' AS installed_cnt,COUNT(employee_id) AS active_cnt,DATE(last_update) AS fd FROM `user` WHERE DATE(DATE_SUB(NOW(),INTERVAL 7 DAY)) <= DATE(last_update) GROUP BY fd) X GROUP BY fd;";
	var str = "SELECT CONCAT(YEAR(hr_activity_log.from_date),'-w',WEEKOFYEAR(hr_activity_log.from_date))  AS show_date ,hr_activity_log.* FROM hr_activity_log WHERE from_date >= (SELECT DATE_ADD((SELECT DATE(NOW()) - INTERVAL 16 WEEK), INTERVAL - WEEKDAY(CURDATE()) DAY));";
	db.getConnection(function(err, connection){
	//conversation['subject'] = connection.escape(conversation['subject']);
		var w = connection.query(str, function(err, result) {
			connection.release();
			// console.log("hr_chart");
			// console.log(result);
			if (err) {
				cb(err, null);
			}else {		
				
				var data =   result;
				cb(err, data);
			}
		});//console.log(w.sql);
    });
	
}

exports.survery_qa = function(cb){

	//var str = "SELECT SUM(installed_cnt) AS ins_cnt,SUM(active_cnt) AS act_cnt,fd FROM (SELECT COUNT(employee_id) AS installed_cnt,'0' AS active_cnt,DATE(first_login_date) AS fd FROM `user` WHERE login_token IS NOT NULL AND login_token !='' AND DATE(DATE_SUB(NOW(),INTERVAL 7 DAY)) <= DATE(first_login_date) GROUP BY fd  UNION ALL  SELECT '0' AS installed_cnt,COUNT(employee_id) AS active_cnt,DATE(last_update) AS fd FROM `user` WHERE DATE(DATE_SUB(NOW(),INTERVAL 7 DAY)) <= DATE(last_update) GROUP BY fd) X GROUP BY fd;";
	var str = "SELECT CONCAT(YEAR(user_activity_log.from_date),'-w',WEEKOFYEAR(user_activity_log.from_date)) AS  show_date , user_activity_log.* FROM user_activity_log WHERE from_date >= (SELECT DATE_ADD((SELECT DATE(NOW()) - INTERVAL 16 WEEK), INTERVAL - WEEKDAY(CURDATE()) DAY));";
	db.getConnection(function(err, connection){
	//conversation['subject'] = connection.escape(conversation['subject']);
		var w = connection.query(str, function(err, result) {
			connection.release();
			if (err) {
				cb(err, null);
			}else {		
				
				var data =   result;
				cb(err, data);
			}
		});//console.log(w.sql);
    });
	
}

exports.user_acitvitygraph = function(cb){

	//var str = "SELECT SUM(installed_cnt) AS ins_cnt,SUM(active_cnt) AS act_cnt,fd FROM (SELECT COUNT(employee_id) AS installed_cnt,'0' AS active_cnt,DATE(first_login_date) AS fd FROM `user` WHERE login_token IS NOT NULL AND login_token !='' AND DATE(DATE_SUB(NOW(),INTERVAL 7 DAY)) <= DATE(first_login_date) GROUP BY fd  UNION ALL  SELECT '0' AS installed_cnt,COUNT(employee_id) AS active_cnt,DATE(last_update) AS fd FROM `user` WHERE DATE(DATE_SUB(NOW(),INTERVAL 7 DAY)) <= DATE(last_update) GROUP BY fd) X GROUP BY fd;";
	var str = "SELECT CONCAT(YEAR(user_activity_log.from_date),'-w',WEEKOFYEAR(user_activity_log.from_date)) AS show_date , user_activity_log.* FROM user_activity_log WHERE from_date >= (SELECT DATE_ADD((SELECT DATE(NOW()) - INTERVAL 16 WEEK), INTERVAL - WEEKDAY(CURDATE()) DAY));";
	db.getConnection(function(err, connection){
	//conversation['subject'] = connection.escape(conversation['subject']);
		var w = connection.query(str, function(err, result) {
			connection.release();
			if (err) {
				cb(err, null);
			}else {		
				
				var data =   result;
				cb(err, data);
			}
		});//console.log(w.sql);
    });
	
}

exports.hr_activity = function(cb){

	var str = "SELECT  COUNT(id) as msg_sent FROM message WHERE DATE(`date`) >= DATE(DATE_SUB(NOW(),INTERVAL 7 DAY));";
	str += "SELECT COUNT(id) as q_sent FROM message WHERE DATE(`date`) >= DATE(DATE_SUB(NOW(),INTERVAL 7 DAY)) AND `data` LIKE '%\"qa\":\"%' ;";
	str += "SELECT SUM(totalcnt) as u_involved FROM (SELECT COUNT(msg_id) AS totalcnt FROM inbox WHERE DATE(`date`) >= DATE(DATE_SUB(NOW(),INTERVAL 7 DAY)) GROUP BY msg_id)tbl ";
	db.getConnection(function(err, connection){
	//conversation['subject'] = connection.escape(conversation['subject']);
		connection.query(str, function(err, result) {
			connection.release();
			//console.log(result);
			if (err) {
				cb(err, null);
			}else {		
				
				var data =   result;
				cb(err, data);
			}
		});
    });
	
}
exports.user_activity = function(cb){

	var str = "SELECT COUNT(user_id) as q_answered FROM inbox WHERE is_answered = 1  AND DATE(`date`) >= DATE(DATE_SUB(NOW(),INTERVAL 7 DAY));";
	str += "SELECT ROUND((100*(ans_user/total_user)),1) AS a_percent FROM (SELECT ( SELECT COUNT(user_id) FROM inbox WHERE is_question=1 AND DATE(`date`) >= DATE(DATE_SUB(NOW(),INTERVAL 7 DAY))  ) AS total_user, ( SELECT COUNT(user_id) FROM inbox WHERE is_question=1 AND is_answered = 1 AND DATE(`date`) >= DATE(DATE_SUB(NOW(),INTERVAL 7 DAY))) AS ans_user)tbl;";
	str += "SELECT COUNT(c_id) as r_sent FROM conversation WHERE DATE(`created_date`) >= DATE(DATE_SUB(NOW(),INTERVAL 7 DAY))";
	db.getConnection(function(err, connection){
	//conversation['subject'] = connection.escape(conversation['subject']);
		 connection.query(str, function(err, result) {
			connection.release();
			//console.log(result);
			if (err) {
				cb(err, null);
			}else {		
				
				var data =   result;
				cb(err, data);
			}
		});
    });
	
}

exports.engagement_score = function(cb){

	var str = "SELECT `name`,biz_sector,department,`point` FROM `user` WHERE `point` > 0 ORDER BY `point` DESC LIMIT 10;";
	str += " SELECT `name`,biz_sector,department,`point` FROM `user` WHERE `point` > 0 AND biz_sector='Corporate Offices' ORDER BY `point` DESC LIMIT 3;"
	str += "SELECT DISTINCT biz_sector as name FROM `user` ORDER BY biz_sector;"
	db.getConnection(function(err, connection){
	//conversation['subject'] = connection.escape(conversation['subject']);
		var w = connection.query(str, function(err, result) {
			connection.release();
			//console.log(result);
			if (err) {
				cb(err, null);
			}else {		
				
				var data =   result;
				cb(err, data);
			}
		});//console.log(w.sql);
    });
	
}
exports.gettop3 = function(biz,cb){
	db.getConnection(function(err, connection){
	//conversation['subject'] = connection.escape(conversation['subject']);
		var w = connection.query("SELECT `name`,biz_sector,department,`point` FROM `user` WHERE `point` > 0 AND biz_sector="+connection.escape(biz)+" ORDER BY `point` DESC LIMIT 3;", function(err, result) {
			connection.release();
			//console.log(result);
			if (err) {
				cb(err, null);
			}else {		
				
				var data =   result;
				cb(err, data);
			}
		});//console.log(w.sql);
    });
	
}
