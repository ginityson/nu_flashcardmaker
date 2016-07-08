var express = require( 'express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');//have to have this

//var app = express();
//var path = require("path");
//var bodyParser = require('body-parser');
var pg = require('pg');

var urlencodedParser = bodyParser.urlencoded( {extended: false});

//postgres must be running and you must have this db name correct
var connectionString = 'postgres://localhost:5432/flashcard';

app.use(bodyParser.json());

app.set('port', (process.env.PORT || 3000));

//static folder
app.use(express.static('public'));

app.get('/getDeck', function( req, res){//send back all decks that conform to query
    console.log('in getDeck');
    var results = [];//holds our results
        pg.connect(connectionString, function(err, client, done){
          var query = client.query( 'SELECT * FROM decks;' );
          console.log('query: ' + query);
          var rows = 0;
              query.on( 'row', function ( row ) {
                results.push( row );
                  done();
              });//end queriy push
              query.on ( 'end', function() {
                console.log(results);
                return res.json( results );
              });//end on end
                if( err ) {
                  console.log(err);
                }//end err
        });//end connect
});//end /getDeck

 app.get('/getCards', function( req, res ){//send back all cards that conform to query
     console.log('in /getCards...' );
     var results = [];//holds our results
         pg.connect(connectionString, function(err, client, done){
           if( err ) {
             console.log(err);
           }//end err
           else{
             var query = client.query( 'SELECT * FROM cards' ); // WHERE deck_name=' + req.body.deck_name );
    
             var rows = 0;
             query.on( 'row', function ( row ) {
               results.push( row );
                 done();
             });//end query push
             query.on ( 'end', function() {
              //  console.log(results);
               return res.json( results );
             });//end on end
           }
         });//end connect
 });//end /getDeckOfCards'


//POST for function createDeck
app.post( '/deckPost', function( req, res ){
      //console.log(" 1st in /deckPost, and we have received: " + req.body.deck);
      pg.connect(connectionString, function(err, client, done){
            console.log(req.body.deck);
            client.query("INSERT INTO decks ( name ) VALUES ( $1 )", [ req.body.deck ],
          function(err, result) {
              done();
              if(err){
                console.log(err);
                res.sendStatus(500);
              } else {
                //console.log('after else in post');
              }
          });//end err handling
          res.send();
          done();
      });//end pg connect
}); // end /deckPost

//POST for function createCard
 app.post( '/cardPost', function( req, res ){
       console.log(" 1st in /cardPost, and we have received: " + req.body.deck_name);
       pg.connect(connectionString, function(err, client, done){
             console.log(req.body.card_front);
             console.log(req.body.card_back);
             console.log(req.body.deck_name);
             client.query("INSERT INTO cards ( front_text, back_text, deck_name ) VALUES ( $1, $2, $3 )", [ req.body.card_front, req.body.card_back, req.body.deck_name ],
           function(err, result) {
               done();
               if(err){
                 console.log(err);
                 res.sendStatus(500);
               } else {
                 console.log('after else in post');
               }//end else
           });//end err handling
           res.send();
           done();
       });//end pg connect
}); // end /deckPost

//spin up server
app.listen(3000, 'localhost', function(req, res){
  console.log('listen 3000');
});//end of server

//base url
app.get("/*", function(req,res){
    console.log(req.params[0]);
    var file = req.params[0] || "/views/index.html";
    res.sendFile(path.join(__dirname, "/public/", file));
});//end base url


module.exports = app;
