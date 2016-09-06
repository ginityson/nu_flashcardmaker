var express = require( 'express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');//have to have this

var pg = require('pg');

var urlencodedParser = bodyParser.urlencoded( {extended: false});

//postgres must be running and you must have this db name correct
var connectionString = '';

if(process.env.DATABASE_URL !== undefined) {
     console.log('env connection string');
     connectionString = process.env.DATABASE_URL;
     pg.defaults.ssl = true;
 } else {
     connectionString = 'postgres://localhost:5432/flashcard';
}

console.log("connectionString set to: ", connectionString);

app.use(bodyParser.json());

//static folder
app.use(express.static('public'));

app.get('/getDeck', function( req, res){//send back all decks that conform to query
    console.log('in getDeck');
    var results = [];//holds our results
        pg.connect(connectionString, function(err, client, done){

          if( err ) {
            console.log(err);
          }//end err
          else{
            var query = client.query( 'SELECT * FROM decks;' );
            // console.log('query: ', query);
            query.on( 'row', function ( row ) {
              results.push( row );
            });//end query push
            query.on ( 'end', function() {
              done();
              console.log('results', results);
              return res.json( results );
            });//end on end
          }
        });//end connect
});//end /getDeck

 app.get('/getCards', function( req, res ){//send back all cards that conform to query
     console.log('in /getCards...' );
     var results = [];//holds our results
         pg.connect(connectionString, function(err, client, done){
           if( err ) {
             console.log('what', err);
           }//end err
           else{
             var query = client.query( 'SELECT * FROM cards' ); // WHERE deck_name=' + req.body.deck_name );

             var rows = 0;
             query.on( 'row', function ( row ) {
               results.push( row );
                 done();
             });//end query push
             query.on ( 'end', function() {
              // console.log(results);
              console.log('end of /getCards');
               return res.json( results );

             });//end on end
           }
         });//end connect
 });//end /getDeckOfCards'


//POST for function createDeck
app.post( '/deckPost', function( req, res ){
      pg.connect(connectionString, function(err, client, done){
            console.log('req.body.deck', req.body.deck);
            client.query("INSERT INTO decks ( name ) VALUES ( $1 )RETURNING id", [ req.body.deck ],
          function(err, result) {
            console.log( 'result : ', result );
          req.body.id = result.rows[0].id;
            console.log('req.body.id ',req.body.id);
            res.sendStatus( req.body.id);
              done();
              if(err){
                console.log(err);
                res.sendStatus(500);
              } else {
              }
          });//end err handling
          done();
      });//end pg connect
}); // end /deckPost

//POST for function createCard
 app.post( '/cardPost', function( req, res ){
       console.log(" 1st in /cardPost, and we have received: " + req.body.deck_name);
       pg.connect(connectionString, function(err, client, done){
             console.log('am I here?', req.body.card_front);
             console.log('am I here?', req.body.card_back);
             console.log('am I here?', req.body.image);
             console.log('am I here?', req.body.deck_name);
             client.query("INSERT INTO cards ( front_text, back_text, deck_name, image ) VALUES ( $1, $2, $3, $4 )RETURNING id", [ req.body.card_front, req.body.card_back, req.body.deck_name, req.body.image ],
           function(err, result) {
               if(err){
                 console.log(err);
                 res.sendStatus(500);
               } else {
                  done();
                  res.sendStatus(200);
                  console.log('after else in post');
               }//end else
           });//end err handling
       });//end pg connect
}); // end /deckPost

//DELETE for function deleteDeck
app.delete('/deleteDeck/:id', function( req, res ){
   console.log( 'reached app.delete Deck' );
     pg.connect(connectionString, function(err, client, done){
       console.log( '1 err: ', err );
        client.query("DELETE FROM decks WHERE id =" + req.params.id, function(err ){
          console.log( 'req.params.id ', req.params.id );
        if(err){
          console.log( '2 err: ', err );
          res.sendStatus(500);
        } else {
          res.sendStatus(200);
        }
        done();
      });//end query
    });//end connect
});//end deleteDeck

//DELETE for function deleteCard
app.delete('/deleteCard/:id', function( req, res ){
   console.log( 'reached app.delete Card' );
     pg.connect(connectionString, function(err, client, done){
       console.log( 'err: ', err );
        client.query("DELETE FROM cards WHERE id =" + req.params.id, function(err ){
          console.log( 'req.params.id ', req.params.id );
        if(err){
          console.log( 'err: ', err );
          res.sendStatus(500);
        } else {
          res.sendStatus(200);
        }
        done();
      });//end query
    });//end connect
});//end deleteCard

//spin up server
app.listen(process.env.PORT || 3000, function(req, res){
  console.log('listen 3000');
});//end of server

//base url
app.get("/*", function(req,res){
    var file = req.params[0] || ( "/views/index.html");
    res.sendFile(path.join(__dirname, "/public/", file));
});//end base url
