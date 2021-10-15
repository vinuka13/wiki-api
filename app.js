const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect('mongodb://localhost:27017/wikiDB', {useNewUrlParser: true, useUnifiedTopology: true})

const wikiSchema = new mongoose.Schema({
  title: String,
  content: String
})

const Article = mongoose.model("Article", wikiSchema);



//doing the RESTful https requests for all the articles

app.route("/article")
    .get(function(req, res){
      Article.find({}, function(err, docs){
        if(!err){
          res.send(docs)
        } else {
          res.send(err)
        }
      })
    })
   .post(function(req, res){
     const newArticle = new Article({
       title: req.body.title,
       content: req.body.content
     });

      newArticle.save(function(err){
        if(err){
          res.send(err)
        } else{
          res.send("Successfully added the article")
        }
      });

   })
   .delete(function(req, res){

     Article.deleteMany({}, function(err){
       if(err){
         res.send(err)
       } else{
         res.send("Successfully deleted the articles")
       }
     })
   })


//doing the RESTful https requests for a one article

  app.route("/article/:paramtitle")
     .get(function(req, res){
       Article.findOne({title:req.params.paramtitle}, function(err, docs){
         if(docs){
           res.send(docs)
         } else {
           res.send("Article not found")
         }
       })
     })
    .put(function(req, res){
      Article.update(
        {title:req.params.paramtitle},
        {title:req.body.title,  content:req.body.content},
        {overwrite: true},
        function(err){
          if(!err){
            res.send('Article updated')
          }
        })
    })
    .patch(function(req, res){
      Article.update(
        {title: req.params.paramtitle},
        {$set : req.body},
        function(err){
          if(err){
            res.send(err)
          } else {
            res.send("Successfully updated")
          }
        })
    })
    .delete(function(req, res){
      Article.deleteOne(
        {title: req.params.paramtitle},
        function(err){
          if(err){
            res.send(err)
          } else {
            res.send("Successfully deleted the article")
          }
        })
    })




app.listen(3000, function(){
  console.log("server is running")
})
