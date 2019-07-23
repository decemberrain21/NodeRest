var db = require('../helpers/database');

exports.check = function(obj,cb){
	var async = require("async");
	var check_ids = obj.ids.split("\n");
	var findinarr = function(arrhaystack,needle)
	{
		return (arrhaystack.indexOf(needle) > -1);
	};
	var unmatched_results = [];	
	db.getConnection(function(err, connection){	
		async.each(check_ids, function(mydata, mycallback) {
			//console.log(mydata);
			async.waterfall([
				async.apply(myFirstFunction, mydata),
					mySecondFunction,
					
				], function (err, result) {
					//console.log('waterfall done');
					mycallback();
					// result now equals 'done'
				});
				function myFirstFunction(arg1,callback) {
					//console.log('first');
					connection.query("SELECT employee_id FROM `user` WHERE employee_id = "+connection.escape(arg1) , function(err2, result) {   
						//connection.release();			
						if (err2) {
							
							cb(err2, {},null);
							return;
						}else{
							if(result.length>0)
							{	
								callback(null,"");
							}
							else
							{
								//uid not exist 
								callback(null,arg1);
							}
						}
					});
					
				}
				function mySecondFunction(arg1,callback) {
					//console.log('second')
					if(arg1 !="")
					{
						if(!findinarr(unmatched_results,arg1))
						{
							unmatched_results.push(arg1);
							callback(null,unmatched_results);
						}
					}
					else
					{
						callback(null,unmatched_results);
					}
						
				}
			
			}, function(err3) {
				
				if( err3 ) {
				  // One of the iterations produced an error.
				  // All processing will now stop.
				  connection.release();	
				  cb(err3, unmatched_results);
				} else {
					
					connection.release();
					cb(null, unmatched_results);
					
					
				}
		});
		
	});
	
}
exports.createNewGroup = function(obj,cb){
	var result = [];
	if(obj.byuid == "1")
	{
		db.getConnection(function(err, connection){
			if(obj.hidval != "")
			{				
				connection.query("UPDATE `user_groups` SET user_id="+connection.escape(obj.user_id)+" WHERE group_id="+obj.hidval, function(err, result2) {
					if (err) {
						connection.release();
						cb(err, null);
						return;
					}else {		
						cb(err, obj.hidval);
					}
				});
				
			}
			else
			{
				connection.query("INSERT INTO `stc_group`(title) VALUES ("+connection.escape(obj.title)+")", obj, function(err, result) {
					if (err) {
						connection.release();
						cb(err, null);
						return;
					}else {		
						var group_id = result.insertId;
						connection.query("INSERT INTO `user_groups`(group_id,user_id) VALUES ("+group_id+",'"+obj.user_id+"')", obj, function(err, result2) {
							if (err) {
								connection.release();
								cb(err, null);
								return;
							}else {
								connection.release();
								cb(err, group_id);
							}
						});
					}
				});
				
			}
		});
	}
	else
	{
		if(obj.filtered_by == "")
		{
			obj.filtered_by ="allusers";
		}
		if(obj.hidval != "")
		{
			
			db.getConnection(function(err, connection){
				var nextstr = "UPDATE `stc_group` SET title="+connection.escape(obj.title)+",filtered_by="+connection.escape(obj.filtered_by) +" WHERE id="+obj.hidval;
				var w = connection.query(nextstr, obj, function(err, result) {
					connection.release();
					if (err) {
						cb(err, null);
					}else {		
						cb(err, result);
					}
				});//console.log(w.sql);
			});
		}
		else
		{
			delete obj['hidval'];
			delete obj['byuid'];
			var nextstr = "INSERT INTO `stc_group` SET ?"
			db.getConnection(function(err, connection){
				var w = connection.query(nextstr, obj, function(err, result) {
					connection.release();
					if (err) {
						cb(err, null);
					}else {		
						cb(err, result);
					}
				});//console.log(w.sql);
			});
		}
	}
	
	
}

exports.grouplist = function(user,cb) {
	 var querystring = user.query_str;	 
	//start
	 var aColumns = ["id","title","filtered_by"];
	 
	 /* Indexed column (used for fast and accurate table cardinality)*/
	 var sIndexColumn = "id";
  
	/* DB table to use */
	var sTable = "stc_group";
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
	/* " WHERE player_key is not null   "; */
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
								 output['aaData'][count] =[rResult[k].id,rResult[k].title,rResult[k].filtered_by];
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

exports.groupbyId = function(id,cb){
	var result = [];
	var str = "select * from stc_group where id = "+ id +"; ";
	
	db.getConnection(function(err, connection){
		var i = connection.query(str, function(err, results) {
			
			if (err) {
				connection.release();
				cb(err, null);
				
		  	}else {		
				if(results.length >0)
				{
					var extract_result = {};
					extract_result['title'] = results[0].title;
					if(results[0].filtered_by)
					{
						connection.release();
						var res_arr = results[0].filtered_by.split('|');
						for(var r=0;r<res_arr.length;r++)
						{
							var sub_val = res_arr[r].split(';');
							//console.log(sub_val);
							
							extract_result[sub_val[0]] = {};
							extract_result[sub_val[0]]["operator"]=sub_val[1];
							extract_result[sub_val[0]]["value"]=sub_val[2];
							if(r == res_arr.length-1)
							{
								cb(null, extract_result);
							}
						}
					}else
					{
						extract_result["is_userid"] = "1";
						
						connection.query("SELECT * FROM user_groups WHERE group_id = "+id , function(err3, result3) {
						
							connection.release();
							if (err3) {
								cb(err3, null);
							}else {		
								extract_result["user_id"] = result3[0].user_id;
								cb(null, extract_result);
							}
							
						});
						
					}
				}
				else
				{
					cb(null, null);
				}
				
		  	}
		});//console.log(i.sql);
    });

}

exports.deleteGroup = function(id, cb)
{
	db.getConnection(function(err, connection){
		connection.query('DELETE FROM stc_group WHERE id = ? ', id, function(err, result){
			if(!err){
				cb(null, {message : "success"});
			}else{
				cb(err, null);
			}
		});
		connection.release();
	});
}

exports.saveUpdate = function(obj,cb){
	var data = {
		title:	obj.title,
		filtered_by:	obj.filtered_by 					
	}
	var result = [];
	var nextstr = "UPDATE  `stc_group` SET ? where id = "+obj.id; 	 
	db.getConnection(function(err, connection){
		var w = connection.query(nextstr, obj, function(err, result) {
			connection.release();
			if (err) {
				cb(err, null);
			}else {		
				cb(err, result);
			}
		});//console.log(w.sql);
    });
}


exports.getuserbygroup = function(id,cb){
	var async = require("async");
	var msg_id;	
	var findinarr = function(arrhaystack,needle)
	{
		return (arrhaystack.indexOf(needle) > -1);
	};
	var str_query  = "SELECT filtered_by,id FROM stc_group WHERE id="+ id+";";	
					//console.log(str_query);
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
					var where_condition = "";
					var arg1 = result[0].filtered_by;
					var arg2 = result[0].id;
					if(arg1)
					{
						if(arg1 == "allusers")
						{
							q_str = "SELECT name,employee_id FROM `user` WHERE is_deleted = 0 ";
						}
						else
						{
							var split_str = arg1.split('|');
						where_condition = " WHERE is_deleted = 0   ";

						if(split_str.length > 0){
							where_condition +=" AND ";
						}
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
							//callback(null,where_condition,arg2);
							q_str = "SELECT name,employee_id FROM `user` "+where_condition ;
							//console.log("mytestlog");
							//console.log(q_str);
						});
						}
						
					}else{
						q_str = "SELECT * FROM user_groups WHERE group_id = "+arg2;
					}
					//console.log(q_str);
					connection.query(q_str , function(err3, result3) {
						if(result3.length == 0)
						{
							cb(null,null);
						}
						else
						{
							var new_query="";
							if(!arg1)
							{
								var res_arr = result3[0].user_id.split('\n');
								new_query = "SELECT name,employee_id FROM `user` WHERE is_deleted = 0  AND FIND_IN_SET (employee_id,'"+res_arr.join() +"')";
							
							connection.query(new_query , function(err4, result4) {
								if(result4.length == 0)
								{
									//console.log("heyyy");
									cb(null,null);
								}
								else
								{
									//console.log(result4);
									cb(null,result4);
								}
								
								});
							}else{
								//console.log(result3);
								cb(null,result3);
							}
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
		
		});
				

}


