angular.module("declarerModule", [])
    .controller("declarerController", ["$scope", "$rootScope", "$mdDialog", 
        function($scope, $rootScope, $mdDialog) {
            $scope.alert = '';

            $scope.nbRucher = $rootScope.apiculteurs[0].ruchers.length;
            
            $scope.validerDeclaration = function(ev) {
                    console.log("Validation de la déclaration");
                    
                    $mdDialog.show(
                    $mdDialog.alert()
                        .title('Déclaration validée')
                        .content('Merci pour votre déclaration !')
                        .ariaLabel('Alert Dialog Demo')
                        .ok('Fermer')
                        .targetEvent(ev)
                    );
                        

                }   
            
            
            
            
        }
    ]);
    
    function DialogController($scope, $mdDialog) {
        $scope.hide = function() {
            $mdDialog.hide();
        };
        $scope.cancel = function() {
            $mdDialog.cancel();
        };
        $scope.answer = function(answer) {
            $mdDialog.hide(answer);
        };
        }
