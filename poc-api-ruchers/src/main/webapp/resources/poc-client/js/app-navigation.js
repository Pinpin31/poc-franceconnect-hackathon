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

        }]);
