angular.module("appNavigationModule", [])
    .controller('appNavigationController', ['$rootScope', '$scope', '$mdSidenav', '$mdBottomSheet', '$q',
        function ($rootScope, $scope, $mdSidenav, $mdBottomSheet, $q) {

            $scope.toggleList = function () {
                var pending = $mdBottomSheet.hide() || $q.when(true);

                pending.then(function () {
                    $mdSidenav('left').toggle();
                });
            };

        }]);
