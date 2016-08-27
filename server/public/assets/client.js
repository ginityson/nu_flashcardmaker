var myApp = angular.module("myApp", ["ngRoute", "angular-carousel", 'ui.bootstrap']);

myApp.config(["$routeProvider", function($routeProvider){
    $routeProvider.
          when("/home", {
              templateUrl: "/views/routes/home.html",
              controller: "HomeController"
          }).
          when("/make", {
              templateUrl: "/views/routes/maker.html",
              controller: "MakeController"
          }).
          when("/edit", {
              templateUrl: "/views/routes/edit.html",
              controller: "EditController"
          }).
          when("/practice", {
              templateUrl: "/views/routes/practice.html",
              controller: "PracticeController"
          }).
          otherwise({
            redirectTo: "/home"
          });
}]);//end $routeProvider

myApp.controller("HomeController", ["$scope", "CounterService", function($scope, CounterService){

    $scope.iterate = function(){
        CounterService.iterate();
        console.log("HERE: " , CounterService.counter.count);
    };
}]);//end HomeController

myApp.controller("MakeController", ["$scope", "CounterService","$http", function($scope, CounterService, $http){
    console.log("Loaded Make");

    $scope.theDeckArray = [];//define the array theDeckArray
    $scope.theCardArray = [];

    $scope.getDeck = function(){
      $http({
        method: "GET",
        url: '/getDeck'
      }).then( function( response ){
        // $scope.getCards();
        $scope.theDeckArray = response.data;
        console.log('getDeck() ' + $scope.theDeckArray);
      });//end .then
    };//end getDeck()
      $scope.getDeck();//calling getDeck() function

      $scope.getCards = function(){
        $http({
          method: "GET",
          url: '/getCards'
        }).then( function( response ){
          $scope.theCardArray=[];//empties the array so it does  not exponentionaly double
          for( i=0; i<response.data.length; i++ ){
            if( response.data[i].deck_name == $scope.selectDeck.name ){
              $scope.theCardArray.push( response.data[i] );
            }//end for
          }//end if
        });//end .then
      };//end getDeck()

    $scope.createDeck = function(){
          var deckObjectToSend = {//define object deckObjectToSend from new_deck input expression
            deck: $scope.new_deckIn//match ng-model="new_deckIn"
          };//end object deckObjectToSend
          $http({//POST deckObjectToSend via url route of /deckPost
            method: "POST",
            url: '/deckPost',
            data: deckObjectToSend
          }).then( function () {
            // $scope.getDeck();
            // event.preventDefault();
          });//end $http call
              $scope.new_deckIn='';//clears input
      };//end createDeck function go serverside

      $scope.createCard = function(){
             var cardObjectToSend = {//define object cardObjectToSend from card_front_in input expression
               card_front: $scope.card_front_in,
               card_back: $scope.card_back_in,//match ng-model="card_back_in"
               deck_name: $scope.selectDeck.name
             };//end object cardObjectToSend
             $http({//POST cardObjectToSend via url route of /cardPost
               method: "POST",
               url: '/cardPost',
               data: cardObjectToSend
             }).then( function () {
               $scope.getDeck();
             });//end $http call
                 $scope.card_front_in='';//clears input
                 $scope.card_back_in='';//clears input
        };//end createCard function go serverside

}]);//end MakeController

myApp.controller("EditController", ["$scope", "$http",function($scope, $http){
    console.log("Loaded Edit");

    $scope.custom = true;//for togle

    $scope.theDeckArray = [];//define the array theDeckArray
    $scope.theCardArray = [];//define the array theDeckArray

    $scope.myCard = $scope.theCardArray[0];//just trying to drill down to one card at a time

    $scope.getDeck = function(){
      console.log('in Edit getDeck()');
      $http({
        method: "GET",
        url: '/getDeck'
      }).then( function( response ){
        $scope.theDeckArray = response.data;
        console.log('getDeckOfCards() in EditController' + $scope.theDeckArray);
      });//end .then
    };//end getDeck()
    $scope.getDeck();

    $scope.getCards = function(){
      $http({
        method: "GET",
        url: '/getCards'
      }).then( function( response ){
        $scope.theCardArray=[];//empties the array so it does  not exponentionaly double
        for( i=0; i<response.data.length; i++ ){
          if( response.data[i].deck_name == $scope.selectDeck.name ){
            $scope.theCardArray.push( response.data[i] );
          }//end for
        }//end if
      });//end .then
    };//end getDeck()

    $scope.deleteCard = function(recordID) {
      console.log('in deleteCard, recordID: ', recordID);
      var sendID={id: recordID};
      $http({
        method: "DELETE",
        url: '/deleteCard/' + recordID,
        headers: {'Content-Type': 'application/json;charset=utf-8'}
      }).then( function( ){
        $scope.getCards();//refresh page so that deleted card is visually gone
        // $scope.theCardArray.splice( sendID, 0);
      });//end .then
    };//end deleteCard

    $scope.deleteDeck = function(recordID) {
      console.log('in deleteDeck, recordID: ', recordID);
      var sendID={id: recordID};
      $http({
        method: "DELETE",
        url: '/deleteDeck/' + recordID,
        headers: {'Content-Type': 'application/json;charset=utf-8'}
      }).then( function( ){
        $scope.getDeck();//will in theory refresh page to
        // $scope.theDeckArray.splice( sendID, 0);
          console.log( 'after delete deck http call ');
      });//end .then
    };//end deleteCard

}]);//end EditController

myApp.controller("PracticeController", ["$scope", "$http",function($scope, $http){
    console.log(" 1 Loaded Practice");

    $scope.index = 0;

    $scope.custom = true;//for togle

    $scope.theDeckArray = [];//define the array theDeckArray
    $scope.theCardArray = [];//define the array theDeckArray

    $scope.myCard = $scope.theCardArray[$scope.index];

    $scope.getDeck = function(){
      $http({
        method: "GET",
        url: '/getDeck'
      }).then( function( response ){
        $scope.theDeckArray = response.data;//pulls data from app.js and sets to ...?
        console.log(' 5 getDeckOfCards() in PracticeController' + $scope.theDeckArray);
      }, function myError( response ){
        console.log( response.statusText );
      });//end .then
    };//end getDeck()
    $scope.getDeck();
    event.preventDefault();

    $scope.getCards = function(){
    console.log(' 6 in Practice getCards()');
      $http({
        method: "GET",
        url: '/getCards'
      }).then( function( response ){
        $scope.theCardArray = [];
        for( i=0; i<response.data.length; i++ )
          if( response.data[i].deck_name == $scope.selectDeck.name )
            $scope.theCardArray.push( response.data[i] );

        $scope.myCard=$scope.theCardArray[$scope.index];
        event.preventDefault();
        console.log(" 7 this is the response data: ", response.data[$scope.index].front_text);
      });//end .then
    };//end getDeck()

    $scope.shuffleDeck = function(){
    console.log( 'in shuffleDeck' );
    $scope.myCardShuffled = shuffle( $scope.myCard );
    console.log("$scope.myCardShuffled", $scope.myCardShuffled);
  };//end fun shuffleDeck

  function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

    $scope.nextCard = function(){
          console.log(" 10 next clicked");
          $scope.index++;
          if( $scope.index == $scope.theCardArray.length ){
            $scope.index = 0;
          }
          console.log( '11', $scope.index  );
          $scope.getCards();//refresh page on the next 'click'
          event.preventDefault();

        };
        $scope.prevCard = function(){
        console.log("12 prev clicked");
          $scope.index--;
          if( $scope.index === -1 ){
            $scope.index = $scope.theCardArray.length - 1;
          }
          $scope.getCards();//refresh page on the previous 'click'
          event.preventDefault();
        };

}]);//end PracticeController

myApp.factory("CounterService", [function(){


    var card = {
      count : 1
    };//end card

    var cardIterate = function(){
      card.count++;
      console.log(card.count);
    };//end cardIterate

    //public
    return {
      counter : card,
      iterate : cardIterate
    };//end return
}]);//end factory
