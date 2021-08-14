let http = require('http');
const fs = require('fs');
const mkpdf=require('./mdstdn.js');
let url=require('url');
const {google} = require('googleapis');
const nodemailer = require('nodemailer');
const mongo=require('mongodb');
const ObjectId=mongo.ObjectID;
const MongoClient = mongo.MongoClient;
var uri;
let SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
let credentials;
fs.readFile('../credentials.json',(errr,content)=>{
		credentials=JSON.parse(content);
		
});
fs.readFile('../mnguri.txt','utf8',(err,content)=>{
	uri=content;
});

function regis(res,usrnm,psw){
	let oAuth2Client = new google.auth.OAuth2(
			credentials.web.client_id, credentials.web.client_secret, credentials.web.redirect_uris[0]
		);
	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
	client.connect().then(()=>{
		const collection = client.db("stdnReport").collection("users");
		return collection.findOne(//important to use Promise format(then, catch)
			{"user_name":usrnm}//,"password":psw}
		)
	}).then(doc=>{
		oAuth2Client.setCredentials(doc.token);
		const gmail = google.gmail({version: 'v1',auth:oAuth2Client});
		return gmail.users.getProfile({userId: 'me'});
	}).then(prfl=>{
		console.log(prfl.data.emailAddress);
		client.close();
	}).catch(err=>{
		const collection = client.db("stdnReport").collection("users");
		collection.insertOne(
			{"user_name":usrnm,"password":psw,"token":" "}
		).then(()=>{
			client.close();
		}).catch(err=>{console.log("isertion problem :"+err)});
		
		const authUrl = oAuth2Client.generateAuthUrl({
			access_type: 'offline',
			scope: SCOPES,
		});
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.write(authUrl);
		console.log("url writen");
		res.end();
	});
}

function logn(res,usr,passwrd){
	let msg="both username and password are ok";
	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
	client.connect().then(()=>{
		const collection = client.db("stdnReport").collection("users");
		return collection.findOne(//important to use Promise format(then, catch)
			{"user_name":usr,"password":passwrd}
		)
	}).then(collec=>{
		if(collec==null)msg="either gmail address or password was wrong";
		else msg=JSON.stringify(collec.ids);
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.write(msg);
		res.end();
		client.close();
	}).catch(err=>{
		console.log(err);
	});
}

function qry(obj,res){
	let strls=JSON.stringify(obj).split(/,"usrmail":|,"idN":/);
	let idN=obj.idN; delete obj.idN;
	let usrmail=obj.usrmail; delete obj.usrmail;
	//now obj is object of data that need to be in database
	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
	client.connect().then(()=>{
		const collection = client.db("stdnReport").collection("reports");
		if (idN=="new" && obj.HN){
			collection.insertOne(obj)
			.then(result=>{
				let nwId=result.insertedId.toString();
				client.db("stdnReport").collection("users").updateOne({"user_name":usrmail},{$push:{ids:{id:nwId,HN:obj.HN}}}).then(()=>{
				client.close();
				res.writeHead(200, {'Content-Type': 'text/html'});
				res.write(nwId);
				res.end();
				});
				
			}).catch(err=>{console.log("insert problem :"+err)});
			
		}
		if (idN!="new") {//ObjectId arguement is strange that both douple quote have to be sliced off
			collection.updateOne({"_id":ObjectId(idN)},{$set:obj})
			.then(()=>{
				client.close();
				res.writeHead(200, {'Content-Type': 'text/html'});
				res.write(idN);
				res.end();
			}).catch(err=>{console.log("update problem :"+err)});
		}
	}).catch(err=>{console.log("insertion/update problem :"+err)});
}
function gettken(code,res){
	let oAuth2Client = new google.auth.OAuth2(
			credentials.web.client_id, credentials.web.client_secret, credentials.web.redirect_uris[0]
		);
	
	oAuth2Client.getToken(code).then(tkn=>{
		oAuth2Client.setCredentials(tkn.tokens);
		return [google.gmail({version: 'v1',auth:oAuth2Client}),tkn.tokens];
	}).then((gmail)=>{
		gmail[0].users.getProfile({userId: 'me',})
		.then(prfl=>{
			const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
			client.connect().then(()=>{
				const collection = client.db("stdnReport").collection("users");
				console.log(prfl.data.emailAddress);
				console.log(gmail[1]);
				collection.updateOne({"user_name":prfl.data.emailAddress},{$set:{"token":gmail[1]}}).then(()=>{
					client.close();
					res.writeHead(200, {'Content-Type': 'text/html'});
					res.write("your athentication was completed");
					res.end();
					console.log("res ended");
				}).catch(err=>{console.log("update error : "+err);});
			}).catch(err=>{console.log("writing error :"+err);});
	
	
		}).catch(err=>{console.log(err)});
	}).catch(err=>{console.log(err)});
	
		
	
}
function refil(response,id,dta){
	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
	client.connect().then(()=>{
		const collection = client.db("stdnReport").collection("reports");
		return collection.findOne({_id:ObjectId(id)})
	}).then((rec)=>{
		dstr="";
		if (rec && dta!=""){console.log(JSON.stringify(rec));
			dta=dta.split(",");
			dstr='{';
			for(let i=0;i<dta.length;i++){
				dstr=dstr+'"'+dta[i]+'":"'+rec[dta[i]]+'"';//it is not work with rec.dta[i]
				if (i==dta.length-1)dstr=dstr+"}";
				else dstr=dstr+",";
			}
		}
		else dstr="{}";
		response.writeHead(200, {'Content-Type': 'text/plain'});
		response.write(dstr);
		response.end();
		client.close();
	}).catch(err=>{console.log("read data from server error : "+err)});							
}
function output(id,email,res){
	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
	client.connect().then(()=>{
		const collection = client.db("stdnReport").collection("reports");
		return collection.findOne({_id:ObjectId(id)})
	}).then((rec)=>{
		//console.log(email);
		//console.log("JSON.stringify(rec)");
		let pdf= mkpdf.xprt(JSON.stringify(rec));
		let mail = nodemailer.createTransport({
		  service: 'gmail',
		  auth: {
			user: 'apichai.katiyanont@gmail.com',
			pass: 'apophiS21'
		  }
		});
		var mailOptions = {
		  from: 'apichai.katiyanont@gmail.com',
		  to: email,//'apichaiclinic.surgery@gmail.com',
		  subject: 'medical student report',
		  text: 'this is your medical report, print and hand it to the medical center',
		  attachments: [{ filename: 'attachment.pdf',
    content: pdf}]
		};
		 
		mail.sendMail(mailOptions, function(error, info){
		  if (error) {
			console.log(error);
		  } else {
			console.log('Email sent: ' + info.response);
		  }
		});
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.write('id.pdf');
		res.end();
		client.close();
		
	}).catch(err=>{console.log("read data from server error : "+err)});	
}

let handleRequest = (request, response) => {
	let usrmail="";
	let id="new";
	let rut='login.html';//set route to be login page initially
	let	q = url.parse(request.url, true).query;//make GET request a JSON object q
    let jobj={};
    let jdata='';
	request.on('data',(chunk)=>{
			jdata=jdata+chunk;		
	});
	request.on('end',()=>{
		jdata='{'+jdata+'}'
		jobj=JSON.parse(jdata.replace(/\n/g,"\\n").replace(/&/,"\&"));
		if(jobj.usrname){
				return regis(response,jobj.usrname,jobj.password);
		}
		if(jobj.usr){
			return logn(response,jobj.usr,jobj.passwrd);
		}
		if(jobj.code){
			return gettken(jobj.code,response);
		
		}
		if(jobj.idN){//for back up function from client side
			qry(jobj,response);
			return
		}
		if(jobj.next){
			rut=jobj.next;
			id=jobj.id;
			usrmail=jobj.usrmail;
			
		}
		if(jobj.refil)return refil(response,jobj.refil,jobj.dta);
		if(jobj.output)return output(jobj.output,jobj.usrmail,response);
		if(url.parse(request.url).pathname=="/"){
			fs.open('./'+rut, 'r',(error,fd)=>{
				if (error) {
					response.writeHead(404);
					response.write('Whoops! File not found!');
				} else {
					console.log("route is "+rut);
					fs.stat('./'+rut,(err,stat)=>{
						let data = Buffer.alloc(stat.size);
						fs.read(fd,data,0,stat.size,0,(err,byteread,dda)=>{
							if(err)console.log("can't read this file");//allow to be crashed

							else{
								response.writeHead(200, {'Content-Type': 'text/html'});
								response.write(data+'<input type="hidden" id="usrmail" value="'+usrmail+'"></input><script>refil("'+id+'")</script></body></html>');
								response.end();
								console.log("respond ended");
								fs.close(fd,er=>{
									if(er)console.log("file can't be closed");//allow to be crashed
									else {
										console.log("file closed");
										
									}
								});
							}
						});
					});	
				}
			});
		}
		if(url.parse(request.url).pathname=="/glob.js"){
			fs.readFile('./glob.js',(err,data)=>{
				if (err)console.log("javascript writing problem : "+err);
				response.writeHead(200, {'Content-Type': 'text/javascript'});
				response.write(data);
				response.end();
				
			});
		}
		if(url.parse(request.url).pathname=="/mdstdn.css"){
			fs.readFile('./mdstdn.css',(err,data)=>{
				if (err)console.log("css writing problem : "+err);
				response.writeHead(200, {'Content-Type': 'text/css'});
				response.write(data);
				response.end();
				
			});
		}
	});

    
};


http.createServer(handleRequest).listen(8000);
