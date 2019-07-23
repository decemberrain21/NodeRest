var express = require('express');
var router = express.Router();
var scheduler_model = require('../models/scheduler_model');
var fs 		= require('fs');
var walk    = require('walk');
var async    = require('async');


//weekly schedule (every monday)
router.get('/set_weekly_point', function(req, res) {
	scheduler_model.set_weekly_point(function(err, data) { 
		
	});
	scheduler_model.set_weekly_log(function(err2, data2) { 		
			console.log("complete!");
	});
	return res.send("success");
});

//monthly schedule to clear old data
router.get('/clear_data',function(req, res){
	/**/
	var formatDate = function(date) {
		var d = new Date(date),
			month = '' + (d.getMonth() + 1),
			day  = '' + d.getDate(),
			year = d.getFullYear();	
			
		if (month.length < 2) month = "0" + month;
		if (day.length < 2) day = "0" + day;	
		
		return [year, month, day].join('');
	}
	var root_folder = [];
	 root_folder[0] = 'D:\\projects\\shwetaung\\public\\assets\\upload\\image';
	 root_folder[1] = 'D:\\projects\\shwetaung\\public\\assets\\upload\\file';
	 root_folder[2] = 'D:\\projects\\shwetaung\\public\\assets\\upload\\audio';
	 root_folder[3] = 'D:\\projects\\shwetaung\\public\\assets\\upload\\video';
	async.eachSeries(root_folder, function iteratee(item, callback) {					
		var fileHandler = function(root, fileStat, next) {
		//console.log(root);
		var fullName = fileStat.name;
		//console.log(fullName);
		var img_name_arr = fullName.split("_");		
		if(!isNaN(img_name_arr[0]))
		{
			var img_dir = root+"\\"+fullName;
			var sd = new Date();			
			sd.setDate(sd.getDate() - 180);
			sd = formatDate(sd);
			if(parseInt(img_name_arr[0]) < parseInt(sd))
			{
				//delete file
				fs.unlink(img_dir, (err) => {
				  if (err) throw err;
				  console.log('successfully deleted');
				});
				
			}
		}
		next();	
		
	}

	var errorsHandler = function (root, nodeStatsArray, next) {
		// this will be called when there is an error 
		nodeStatsArray.forEach(function (n) {
			console.error("[ERROR] " + n.name)
			console.error(n.error.message || (n.error.code + ": " + n.error.path));
		});
		next();
	}

	var endHandler = function () {
		// this will be called when scannig done. 			
		callback();		
	}
	var walker  = walk.walk(item, { followLinks: true });
	walker.on("file", fileHandler);
	walker.on("errors", errorsHandler); // plural
	walker.on("end", endHandler);
		
		
	}, function done() {
		scheduler_model.clearolddata(function(err, data) { 		
			console.log("data clear success!");
		});
		return res.send("success");
		//console.log(test.sql);
		
	});
	
	
	
});

//every 15 min
router.get('/send_scheduledmessage',function(req, res){
	scheduler_model.send_scheduledmessage(function(err, data) { 		
			return res.send("success");
	});
});

module.exports = router;