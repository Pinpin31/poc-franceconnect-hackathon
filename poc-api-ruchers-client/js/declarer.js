angular.module("declarerModule", [])
    .controller("declarerController", ["$scope", "$rootScope",
        function($scope, $rootScope) {

            $scope.nbRucher = $rootScope.apiculteurs[0].ruchers.lentgh;
        }
    ]);
