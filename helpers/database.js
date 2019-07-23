 
var mysql = require('mysql');
var pool  = mysql.createPool({
	connectionLimit : 10,
    host: '127.0.0.1',//192.168.100.100 //127.0.0.1
	user: 'root',
	password : '',
	//port : 3306,
	database:'stc_db',
	dateStrings: 'date',
	multipleStatements:true,
	charset : 'utf8mb4'
});

var getConnection = function(callback) {
    pool.getConnection(function(err, connection) {
		
        callback(err, connection);
    });
};

exports.getConnection = getConnection;


exports.select_one = function(table, data, callback) {
    pool.getConnection(function (err, connection) {
        if(!err) {
            var query = connection.query("SELECT ?? FROM ?? WHERE ? ", [data[0], table, data[1]], function(err, result) {
                connection.release();
				// var id="";
				// //console.log(result);
				// if(result != ""){
					// id = result[0].user_id;
				// }
                callback(err,  result);
            });    
			//console.log(query.sql);
        }else {
            connection.release();
            callback(err, null);
        }
    });
};


exports.insert = function(table, data, callback) {
	
    pool.getConnection(function (err, connection) {
        if(!err) {
			var e_id  =data.employee_id;
            var sql = connection.query("INSERT INTO "+ table +" SET ? ", data, function(err, result) {
                connection.release();
				if(err){
					console.log(err);
					callback(err,null);
				}else	
					callback(err, e_id);
            });
			//console.log(sql.sql);
        }else {
            connection.release();
            callback(err, null);
        }
    });
};

exports.update = function(table, data, callback) {
	//var string = "update  "+ table +" SET "+data[0]+ "where " + data[1] ;
	//var query = "update" + table +" set ??  where user_id = " + data[1].user_id;
	//console.log(query);
    pool.getConnection(function (err, connection) {
        if(!err) {
            var sql = connection.query("update  "+ table +" SET ? where ?" , [data[0], data[1]], function(err, result) {
                connection.release();
				if(err){
					console.log(err);
					callback(err,null);
				}else	
					callback(err, result.insertId);
            });
			//console.log(sql.sql);
        }else {
            connection.release();
            callback(err, null);
        }
    });
};

exports.getQuery = function(string, data,callback) {
    pool.getConnection(function (err, connection) {
	var mystring = string + connection.escape(data);
        if(!err) {
            var query = connection.query(mystring, function(err, result) {
                connection.release();
				// var id="";
				// //console.log(result);
				// if(result != ""){
					// id = result[0].user_id;
				// }
                callback(err,  result);
            });    
			//console.log(query.sql);
        }else {
            connection.release();
            callback(err, null);
        }
    });
};


//exports.pool = pool;