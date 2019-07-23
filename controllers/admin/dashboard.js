var express = require('express');
var router = express.Router();
var dashboard_model = require('../../models/dashboard_model');

router.get('/', function(req, res) {
	var lock = 7;
	var dashboard_data = {};
	var output = function(){
		//console.log(dashboard_data);
		if(!req.xhr)
		{
			res.render('admin/index.ejs', {
				session:req.session,
				bodypage 	: 'home.ejs',	
				dashboard :dashboard_data
			});	
		}else{
			res.render('admin/home',{
				session:req.session,
				dashboard :dashboard_data
			});
		}
	};
	dashboard_model.app_penetration(function(err, data) {
		if(err)
		{
			console.log(err);
			return;
		}else{
			//console.log("app_penetration");
			//console.log(data[0]);
			dashboard_data['appresult'] = data[0];				
			dashboard_data['active'] = data[1];				
			lock -= 1;
			if(lock === 0 )
			{
				output();
			}
			
		}
		
	});
	// ####################################################
	dashboard_model.hr_chart(function(err, data) {
		if(err)
		{
			console.log(err);
			return;
		}else{
			// console.log("hr_chartcontrol");
			 //console.log(data[0]);
			dashboard_data['hr_chart'] = data;				
			lock -= 1;
			if(lock === 0 )
			{
				output();
			}
			
		}
		
	});
	// ####################################################
	// ####################################################
	dashboard_model.survery_qa(function(err, data) {
		if(err)
		{
			console.log(err);
			return;
		}else{
			// console.log("hr_chartcontrol");
			 //console.log(data[0]);
			dashboard_data['hr_qa'] = data;				
			lock -= 1;
			if(lock === 0 )
			{
				output();
			}
			
		}
		
	});
	// ####################################################
	// ####################################################
	dashboard_model.user_acitvitygraph(function(err, data) {
		if(err)
		{
			console.log(err);
			return;
		}else{
			// console.log("hr_chartcontrol");
			 //console.log(data[0]);
			dashboard_data['us_ac'] = data;				
			lock -= 1;
			if(lock === 0 )
			{
				output();
			}
			
		}
		
	});
	// ####################################################
	dashboard_model.hr_activity(function(err, data) {
		if(err)
		{
			console.log(err);
			return;
		}else{
			//console.log(data[0][0].msg_sent);
			dashboard_data['hr_msg_sent'] = data[0][0].msg_sent;				
			dashboard_data['hr_q_sent'] = data[1][0].q_sent;				
			dashboard_data['hr_u_involved'] = data[2][0].u_involved;			
			lock -= 1;
			if(lock === 0 )
			{
				output();
			}
			
		}
		
	});
	dashboard_model.user_activity(function(err, data) {
		if(err)
		{
			console.log(err);
			return;
		}else{
			//console.log(data[0][0].msg_sent);
			dashboard_data['q_answered'] = data[0][0].q_answered;				
			dashboard_data['a_percent'] = data[1][0].a_percent;				
			dashboard_data['r_sent'] = data[2][0].r_sent;			
			lock -= 1;
			if(lock === 0 )
			{
				output();
			}
			
		}
		
	});
	dashboard_model.engagement_score(function(err, data) {
		if(err)
		{
			console.log(err);
			return;
		}else{
			//console.log("engagement_score");
			//console.log(data);
			dashboard_data['top10'] = data[0];				
			dashboard_data['top3'] = data[1];				
			dashboard_data['biz_sector'] = data[2];				
			lock -= 1;
			if(lock === 0 )
			{
				output();
			}
			
		}
		
	});
			
});
router.get('/app_penetration', function(req, res) {
	dashboard_model.app_penetration(function(err, data) {
		if(err)
		{
			console.log(err);
			return;
		}else{
			res.json({result:data});
		}
	});	
});
router.post('/gettop3', function(req, res) {
	dashboard_model.gettop3(req.body.biz_sector,function(err, data) {
		if(err)
		{
			console.log(err);
			return;
		}else{
			res.json({result:data});
		}
	});	
});
module.exports = router;