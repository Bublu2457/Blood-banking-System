const express= require('express');
const app=express();
const path= require('path');
const hostname='127.0.0.1';
const port=8000;
const users=require('./datas.json');
const bodyParser = require("body-parser")
const mongoose= require("mongoose");
const { type } = require('os');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
mongoose.connect('').then(()=>{
  console.log('mongodb connected')
}).catch((err)=>{console.log('connection error:',err)});
const userSchema=new mongoose.Schema({
    firstname:{
      type: String,
      required: true
    },
    password:{
      type: String,
      required: true
    },
});
const User=mongoose.model('user',userSchema);

// New app using express module
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);
app.get("/",(req,res)=>{
    return res.render('page');
})
app.post("/",async function(req, res) {
	    const user= await User.findOne({ firstname: req.body.firstname,
        password: req.body.password
      });
      	if (user) {
      		//after process
          res.send("you are a valid customer");
      	} else {
      		 const result = await User.create({
            firstname: req.body.firstname,
            password: req.body.password
          })
          console.log(result);
         res.send("not valid user");
		}
})	
app.get("/app",async (req,res)=>{
     res.render('page');
})

app.listen(8000,()=>{
  console.log(`server running at http://${hostname}:${port}/`);
})





/*const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello, World!\n');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
  console.log('hello');
});*/
