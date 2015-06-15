angular.module("appNavigationModule", [])
    .controller('appNavigationController', ['$rootScope', '$scope', '$mdSidenav', '$mdBottomSheet', '$q', '$location',
        function ($rootScope, $scope, $mdSidenav, $mdBottomSheet, $q, $location) {

            $scope.toggleList = function () {
                var pending = $mdBottomSheet.hide() || $q.when(true);

                pending.then(function () {
                    $mdSidenav('left').toggle();
                });
            };
            
            $scope.gotoStart = function(){
              $location.path('/start');
            };
            
            $scope.gotoApiculteurInfos = function(){
              $location.path('/apiculteurInfos');
            };
            
            $scope.gotoDashboard = function(){
              $location.path('/dashboard');
            };
            
            $scope.gotoTest1 = function(){
              $location.path('/addressValidator');
            };
            
            $scope.gotoTest2 = function(){
              $location.path('/addressAutocomplete');
            };

            $scope.goBack = function(){
                $location.path('/start');
            }
        }])
    .directive('goBackDirective', function(){
        return {
        restrict: 'EA',
            transclude: true,
            scope: {
                title: '@'
            },
            controller: 'appNavigationController',
            template : '<h2><md-button data-ng-click="goBack()"><img src="assets/svg/back28.svg"/></md-button>{{ title }}</h2>',
            
            };
        
    });
