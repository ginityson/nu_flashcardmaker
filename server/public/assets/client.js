var myApp = angular.module("myApp", ["ngRoute"]);

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


}]);//end MakeController

myApp.controller("PracticeController", ["$scope", function($scope){
    console.log("Loaded Practice");
    $scope.decks = ["Emil", "Tobias", "Linus"];//temp array for dropdown
    console.log('$scope.decks ' + $scope.decks);
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
