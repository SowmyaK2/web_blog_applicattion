import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import Data from "./views/models/data.model.js";

const app = express();
const port = 3000;
app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));



app.get("/", (req, res) => { res.render("signin.ejs" )});
app.get("/login", (req, res) => {res.render("login.ejs");});
app.get("/register", (req, res) => {res.render("register.ejs");});

let data = [];

app.get("/home", (req, res) => { res.render("index.ejs",{data} )});

app.get("/post", (req,res)=>{res.render("post.ejs");});

app.post("/post", (req, res) => { 
    const {title,content}  =req.body;
    const newPost = {title,content};
    data.push(newPost);
    
    res.redirect("/home");
  });
  app.get("/edit/:id",(req,res)=>{
    const id = req.params.id;
    const post = data[id];
    res.render('edit',{id,post});
  });
  app.post("/edit/:id",(req,res)=>{
    const id = req.params.id;
    const {title,content} = req.body;
    data[id] = {title,content};
    res.redirect("/");
  });
  app.get("/delete/:id",(req,res)=>{
    const id = req.params.id;
    if(id >= 0 && id < data.length){
    data.splice(id,1);
    }
    res.redirect("/");
  });

  app.post("/register", async (req, res) => {
      const user = await Data.create({
        username: req.body.username,
        password: req.body.password
      });
     
      return res.status(200).json(user);
    }); 

    app.post("/login", async function(req, res){
      try {
          // check if the user exists
          const user = await Data.findOne({ email: req.body.username });
          if (user) {
            //check if password matches
            const result = req.body.password === user.password;
            if (result) {
              res.render("index.ejs",{data});
            } else {
              res.status(400).json({ error: "password doesn't match" });
            }
          } else {
            res.status(400).json({ error: "User doesn't exist" });
          }
        } catch (error) {
          res.status(400).json({ error });
        }
  });
  
mongoose.connect("mongodb://127.0.0.1:27017/")
.then(() => {
    console.log("Connected to MongoDB");
})
.catch((error) => {
    console.error("Error connecting to MongoDB:", error);
}); 

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});