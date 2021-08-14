let http = require('http');
const fs = require('fs');
let url=require('url');
const {google} = require('googleapis');
const mongo=require('mongodb');
const ObjectId=mongo.ObjectID;
var uri;
var client;
const MongoClient = mongo.MongoClient;
fs.readFile('../mnguri.txt','utf-8',(errr,content)=>{
		if (errr) throw errr;
		uri=content;
  		client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  		client.connect().then(()=>{
	const collection = client.db("stdnReport").collection("users");
	//return collection.deleteMany({});
	//return collection.updateOne({_id:ObjectId("60c704189646d922980b6923")},{$set:{ids:[]}});
	return collection.findOne(//important to use Promise format(then, catch)
			{user_name:"apichaiclinic.surgery@gmail.com",password:"neversaydie11"}
		);
}).then((rec)=>{
	console.log(rec.ids);
	client.close();
}).catch(err=>{console.log("something went wrong :"+err)});
});
//console.log(uri);
//const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });






