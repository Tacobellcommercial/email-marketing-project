
const express = require("express");
const fetch = require("node-fetch");
const mailchimp = require("@mailchimp/mailchimp_marketing");

const app = express();

app.set("view engine", "ejs")
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded());


mailchimp.setConfig({
  apiKey: "ca59ed06d89201691bf065b242d4f575-us14",
  server: "us14"
});


app.get("/", (req, res)=>{
  res.redirect("/home");
})

app.get("/home", (req, res)=>{
  res.render("Home");
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
        res.redirect("/home")
    }
  }

  run()



})

app.listen(process.env.PORT, ()=>{
  console.log("Listening on port 3000");
})
