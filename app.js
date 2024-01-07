require("dotenv").config()
const express = require("express");
const fetch = require("node-fetch");
const mailchimp = require("@mailchimp/mailchimp_marketing");

const app = express();

app.set("view engine", "ejs")
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded());


mailchimp.setConfig({
  apiKey: process.env.API_KEY,
  server: "us14"
});


app.get("/", (req, res)=>{
  res.redirect("/home");
})

app.get("/templates", (req, res)=>{
  res.render("Templates")
})

app.get("/home", (req, res)=>{
  let passedVariable = req.query.valid
  if (passedVariable){
    res.render("Home", {display: "error-message", error: "There was an error submitting you to our newsletter! Please try again later..."})
  }else{
    res.render("Home", {display: "hidden", error: "There was an error submitting you to our newsletter! Please try again later..."});
  }
})

app.post("/new-email-subscriber", (req, res)=>{

  async function run(){
    try{
      const response = await mailchimp.lists.addListMember("b50aaf919e", {
        email_address: req.body.email,
        status: "subscribed",
        merge_fields: {
          FNAME: req.body.first_name,
          LNAME: req.body.last_name
        }
      })

      res.redirect("/home");
    }catch{
        res.redirect("/home?valid=False")
    }
  }

  run()



})

app.listen(process.env.PORT, ()=>{
  console.log("Listening on port 3000");
})
