var express = require('express');
var router = express.Router();
var group_model = require('../../models/group_model');
var user_model = require('../../models/user_model');

router.get('/creatingGroup*', function(req, res) {
	req.originalUrl = req.originalUrl.split("?").shift();
	var params = req.originalUrl.split('/');
	var group_id = params[4];	
	var group_val = {};
	var page ={};
	var count = 3;
	var Group_user ={};
	var output = function() {
		//console.log(group_val);
		if(!req.xhr)
		{
			res.render('admin/index.ejs', {
				session:req.session,
				bodypage 	: 'creatingGroup.ejs',	
				group_attr : group_val,
				hidval :group_id,
				page : page,
				Group_user : Group_user
			});	
		}else{
			res.render('admin/creatingGroup',{
				session:req.session,
				group_attr : group_val,
				hidval :group_id,
				page : page,
				Group_user : Group_user
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
				
				
				count -= 1;
				if(count == 0 ){
						output();
					}
				}
	});
	
		if(group_id != undefined)
		{
			group_model.groupbyId(group_id ,function(err, data) {
				
				if(err)
				{
					res.redirect('/admin/group/groupdata');
					return;
					//showerror(err);
				}else{
					if(data == null || !data){				
						res.redirect('/admin/group/groupdata');
						return;
					}else{
						count -= 1;
						group_val = data;
						//console.log(group_val);
						if(count == 0 ){
							output();
						}
					}
				}
				
			});
			
			group_model.getuserbygroup(group_id ,function(err, data) {
				
				if(err)
				{
					res.redirect('/admin/group/groupdata');
					return;
					//showerror(err);
				}else{
					/*if(data == null || !data){				
						res.redirect('/admin/group/groupdata');
						return;
					}else{*/
						count -= 1;
						Group_user = data;
						//console.log(group_val);
						if(count == 0 ){
							output();
						}
					//}
				}
				
			});
		}
		else
		{	count -= 2;
			if(count == 0 ){
					output();
				}
		}
	
	
			
});

router.post('/createNewGroup', function(req, res) {
	var params = req.body;
	group_model.createNewGroup(params, function(err, data) {
		if(err)
		{
			res.send({status:"0", description:err});
		}
		else{
			res.send({status:"1", description:"success",inserted:data});
		}
	});
});
router.post('/check', function(req, res) {
	var params = req.body;
	group_model.check(params, function(err, data) {
		if(err)
		{
			res.send({status:"0", description:err});
		}
		else{
			res.send({status:"1", results:data});
		}
	});
	
});

router.get('/groupdata', function(req, res) {
	var sort_col = (typeof req.query.sortedCol == "undefined" ) ? "0":req.query.sortedCol;
	var sort_dir = (typeof req.query.sortedDir == "undefined" ) ? "desc":req.query.sortedDir;
	var pl = (typeof req.query.display == "undefined" ) ? "10":req.query.display;
	var pstart = (typeof req.query.start == "undefined" ) ? "0":req.query.start;
	var psearch = (typeof req.query.search == "undefined" ) ? "":req.query.search;
	if(!req.xhr)
	{
		res.render('admin/index.ejs', {
			session:req.session,
			bodypage 	: 'group.ejs',	
			sortedCol :sort_col,
			sortedDir :sort_dir,
			display:pl,
			start:pstart,
			search:psearch
		});	
	}else{
		res.render('admin/group',{
			session:req.session,
			sortedCol :sort_col,
			sortedDir :sort_dir,
			display:pl,
			start:pstart,
			search:psearch
		});
	}
			
});

router.get('/grouplist', function(req, res) {
	var params ={query_str:req.query};
	group_model.grouplist(params, function(err, data) { 	
		if(err)
		{
			res.send(err);return;
		}
		else{
			res.send(data);
		}
		
	});
});


router.post('/deleteGroup', function(req, res) {	
		var params = req.body.id;
		group_model.deleteGroup(params, function(err, data) { 		
		if(err)
		{
			res.send(err);return;
		}
		else{
			res.send(JSON.stringify(data));
		}			
	});	
});

router.get('/groupbyId/:id', function(req, res) {
	//console.log("");
	var lock = 1;
	var settings = {};
	var page = [];
	var output = function() {
		
		if(!req.xhr)
		{
			res.render('admin/index.ejs', {
				session:req.session,
				bodypage 	: 'groupbyid.ejs',
				page			: page
			});	
		}else{
			res.render('admin/groupbyid',{
				session:req.session,
				page	: page
			});
		}
	}
	var showerror = function(err) {
		res.send("Error " + err.message);return;
	}
	
	group_model.groupbyId(req.params.id ,function(err, data) {
			if(err)
			{
				showerror(err);
			}
			page['group'] = data;
	
			lock -= 1;
		
			if(lock === 0 )
			{
				output();
			}
			
		});
});

router.post('/saveUpdate', function(req, res) {	
		var params = req.body;
	group_model.saveUpdate(params, function(err, data) { 		
		if(err)
		{
			res.send({status:"0", description:err});
		}
		else{
			res.send({status:"1", description:"success"});
		}	
	});	
});



module.exports = router;