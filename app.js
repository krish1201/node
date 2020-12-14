var express = require('express');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended:false});
var MongoClient = require('mongodb').MongoClient;
var expressValidator = require('express-validator');
var app = express();
var ejs = require('ejs')
app.use(expressValidator())
//const uri = "mongodb+srv://admin:<password>@cluster0.ueejt.mongodb.net/employee?retryWrites=true&w=majority";
var uri = "mongodb://admin:<password>@cluster0-shard-00-00.ueejt.mongodb.net:27017,cluster0-shard-00-01.ueejt.mongodb.net:27017,cluster0-shard-00-02.ueejt.mongodb.net:27017/employee?ssl=true&replicaSet=atlas-p1n8k4-shard-0&authSource=admin&retryWrites=true&w=majority";
MongoClient.connect(uri,function(err,db){
	if(err) 
		console.log(err);
	app.get('/',function(req,res){
		res.send("<h1>HELLO we are updated</h1>");
	})

	var collection = db.collection('employee');
	console.log("We are Connected");

	app.get("/index.html",function(req,res){
		res.sendFile(__dirname+"/"+"index.html")
	})
	app.post('/process',urlencodedParser,function(req,res){
		req.checkBody('name','name cannot be empty or it cannot contain Integer').notEmpty();
		req.checkBody('dept','Department cannot be empty or it cannot contain Integer').notEmpty();
		req.checkBody('empid','EmployeeID cannot be empty').notEmpty();

		var error = req.validationErrors();
		if(error)
		{
			res.send(error)
			return;
		}
		else
		{
			var Empid = req.body.empid
			var Name = req.body.name
			var Dept = req.body.dept
			var Desi = req.body.desi
			var Mob = req.body.mob
			var Email = req.body.email

			db.collection('employee').insert({'empid':Empid,"name":Name,"dept":Dept,"desi":Desi,"mob":Mob,"email":Email},function(err,doc){
				if(err)
					return console.log(err)
				else
					res.status(201).json(doc.ops[1])
				})
			res.send('<p>Name:'+req.body.name+'</p><p>EmpID:'+req.body.empid+'</p><p>Department:'+req.body.dept+'</p><p>Designation:'+req.body.desi+'</p>');
		}
	})
	//display
	app.get('/display',function(req,res){
		db.collection('employee').find().toArray(function(err,i){
			if(err)
				return console.log(err)
			res.render('4s.ejs',{Employee : i})
		});
	})


	app.get('/update.html',function(req,res){
		res.sendFile(__dirname+'/update.html')
	})
	app.get('/update',function(req,res){
		var Name = req.query.name;
		var Designation = req.query.desi;

		db.collection('employee').update({'name':Name},{$set:{'desi':Designation}},function(err,i){
		if(err)
			console.log(err)
		else
			res.send('Updated')
		})

	})
	
});

const port = process.env.port || 3000
app.listen(port);
