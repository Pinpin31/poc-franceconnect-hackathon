/**
 * @name myApp.franceConnectScope
 * @extends myApp.scope
 * @property {string} clientId
 * @property {string} uriCallback
 */

angular.module("franceConnectModule", [])
    .controller('franceConnectService', ['$rootScope', '$scope',
        function ($rootScope, $scope) {

            /** myApp.franceConnectScope */
            $scope.franceConnect = {
                clientId: '773501223f8673e7e499c73a9bf8ea1455b8d82ee5c00f0459f44bb92a0df6c6',
                uriCallback: 'http://localhost/'
            };
            $scope.loginUrl = "https://fcp.integ01.dev-franceconnect.fr/api/v1/authorize" +
                "?response_type=code&client_id=" + $scope.franceConnect.clientId + "&redirect_uri=" +
                $scope.franceConnect.uriCallback + "&scope=openid&state=fakeState&nonce=fakeNonce";
            $rootScope.userInfo = [];

        }]).run(function ($rootScope) {
        $rootScope.userInfo = [];
        $rootScope.$on("$locationChangeStart", function (event, next, current) {
            var searchCode = current.match(/.*code=(.*)&.*/);
            if (searchCode && searchCode.length > 1) {
                var code = searchCode[1];
                console.log("find code authorization from FC " + code);
                $rootScope.userInfo["name"]= code;

            }

            //prevent location change.
            event.preventDefault();

        });
    }).directive('franceConnectInfo', function ($rootScope) {
        return {
            template: "<span>Connecté en tant que {{userInfo['name']}}</span>"
        }
    }).directive('franceConnectLink', function ($rootScope ) {
        return {
            template: "<span data-ng-href='{{loginUrl}}'>Sign in</span>"
        }
    });
