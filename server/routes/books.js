var express = require('express');
var router = express.Router();
var pg = require("pg");
var connectionString = 'postgres://localhost:5432/omicron';
router.post("/", function(req, res){
  var book = req.body;
  pg.connect(connectionString, function(err, client, done){
    if(err){
      res.sendStatus(500);
    }
    client.query("INSERT INTO books (author, title, published, edition, publisher)" //DB Fields
                  + "VALUES ($1, $2, $3, $4, $5)", //$1 associated with that position in the array that follows
                  [book.author, book.title, book.published, book.edition, book.publisher], //object
                  function(err,result){
                    done();
                    if(err){
                      res.sendStatus(500);
                    }
                    res.sendStatus(201);
                  });
  });
});

router.get("/", function(req, res) {
    //Retrieve Books from DB
    pg.connect(connectionString, function(err, client, done) { //(Where am I going, What do i do there)
        if (err) {
            res.sendStatus(500);
        }
        client.query("SELECT * FROM books", function(err, result) { //Second parameter contains results, can be called anything
            done();//closes connection. I only have 10!
            if(err){
                res.sendStatus(500);
            }
            res.send(result.rows); //We want to rows because the results will have extra object...stuff
        });
    });
});
module.exports = router;
