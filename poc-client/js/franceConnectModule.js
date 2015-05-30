/**
 * @name myApp.franceConnectScope
 * @extends myApp.scope
 * @property {string} clientId
 * @property {string} uriCallback
 */

angular.module("franceConnectModule", []).run(function ($rootScope) {
    $rootScope.userInfo = [];

    $rootScope.$on("$locationChangeStart", function (event, next, current) {
        var searchCode = current.match(/.*code=(.*)&.*/);
        if (searchCode && searchCode.length > 1) {
            var code = searchCode[1];
            console.log("find code authorization from FC " + code);
            $rootScope.userInfo["name"] = code;

        }

        //prevent location change.
        event.preventDefault();

    });

}).directive('franceConnectInfo', function () {

    return {
        template: "<span>Connecté en tant que {{userInfo['name']}}</span>"
    }

}).directive('franceConnectLink',function () {
    var controller = ['$rootScope', '$scope', function ($rootScope, $scope) {

            /** myApp.franceConnectScope */
            $scope.franceConnect = {
                clientId: '773501223f8673e7e499c73a9bf8ea1455b8d82ee5c00f0459f44bb92a0df6c6',
                uriCallback: 'http://localhost/'
            };
            $scope.loginUrl = "https://fcp.integ01.dev-franceconnect.fr/api/v1/authorize" +
                    "?response_type=code&client_id=" + $scope.franceConnect.clientId + "&redirect_uri=" +
                    $scope.franceConnect.uriCallback + "&scope=openid&state=fakeState&nonce=fakeNonce";
            $rootScope.userInfo = [];


        }];

    return {
        restrict: 'EA', //Default in 1.3+
        scope: {
            datasource: '=',
            add: '&',
        },
        controller: controller,
        template: "<md-button data-ng-href='{{loginUrl}}'>Sign in</md-button>"
    };

});
