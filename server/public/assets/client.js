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

    $scope.getDeck = function(){
      $http({
        method: "GET",
        url: '/getDeck'
      }).then( function( response ){
        $scope.theDeckArray = response.data;
        console.log('getDeck() ' + $scope.theDeckArray);
      });//end .then
    };//end getDeck()
      $scope.getDeck();//calling getDeck() function

    $scope.createDeck = function(){
      console.log('createDeck clicked');
        event.preventDefault();
          //define object deckObjectToSend from new_deck input expression
          var deckObjectToSend = {
            deck: $scope.new_deckIn//match ng-model="new_deckIn"
          };//end object deckObjectToSend

          console.log('deckObjectToSend' + deckObjectToSend.deck);
          //POST deckObjectToSend via url route of /deckPost
          $http({
            method: "POST",
            url: '/deckPost',
            data: deckObjectToSend
          }).then( function () {
            $scope.getDeck();
          });//end $http call
              $scope.new_deckIn='';//clears input
      };//end createDeck function go serverside

      $scope.createCard = function(){
        console.log('createCard clicked');
          event.preventDefault();
              console.log($scope.card_front_in);
              console.log($scope.card_back_in);
              console.log($scope.selectDeck.name);

              //define object cardObjectToSend from card_front_in input expression
             var cardObjectToSend = {
               card_front: $scope.card_front_in,
               card_back: $scope.card_back_in,//match ng-model="card_back_in"
               deck_name: $scope.selectDeck.name
             };//end object cardObjectToSend

              console.log('cardObjectToSend' + cardObjectToSend.card_front);
             //POST cardObjectToSend via url route of /cardPost
             $http({
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
    console.log('in Edit getCards()');
      $http({
        method: "GET",
        url: '/getCards'
      }).then( function( response ){
        $scope.theCardArray=[];
        for( i=0; i<response.data.length; i++ ){
          if( response.data[i].deck_name == $scope.selectDeck.name ){
            $scope.theCardArray.push( response.data[i] );
          }
        }
        console.log('getCards() in $scope.theCardArray: ', $scope.theCardArray[1]);
      });//end .then
    };//end getDeck()

}]);//end EditController

myApp.controller("PracticeController", ["$scope", "$http",function($scope, $http){
    console.log("Loaded Practice");

    $scope.custom = true;//for togle

    $scope.theDeckArray = [];//define the array theDeckArray
    $scope.theCardArray = [];//define the array theDeckArray

    $scope.myCard = $scope.theCardArray[0];//just trying to drill down to one card at a time

    $scope.getDeck = function(){
      console.log('in Practice getDeck()');
      $http({
        method: "GET",
        url: '/getDeck'
      }).then( function( response ){
        $scope.theDeckArray = response.data;
        console.log('getDeckOfCards() in PracticeController' + $scope.theDeckArray);
      });//end .then
    };//end getDeck()
    $scope.getDeck();

    $scope.getCards = function(){
    console.log('in Practice getCards()');
      $http({
        method: "GET",
        url: '/getCards'
      }).then( function( response ){
        $scope.theCardArray=[];
        console.log("this is the response data: ", response.data);
        for( i=0; i<response.data.length; i++ ){
          if( response.data[i].deck_name == $scope.selectDeck.name ){
            $scope.theCardArray.push( response.data[i] );

          }
        }
        console.log('getCards() in $scope.theCardArray: ', $scope.theCardArray);
      });//end .then
    };//end getDeck()
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
