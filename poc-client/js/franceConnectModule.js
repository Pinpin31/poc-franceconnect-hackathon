/**
 * @name myApp.franceConnectScope
 * @extends myApp.scope
 * @property {string} clientId
 * @property {string} uriCallback
 */

angular.module("franceConnectModule", [])
 .run(function ($rootScope) {
     $rootScope.userInfo = [];
 
     $rootScope.$on("$locationChangeStart", function (event, next, current) {
         var searchCode = current.match(/.*code=(.*)&.*/);
         if (searchCode && searchCode.length > 1) {
             var code = searchCode[1];
             console.log("find code authorization from FC " + code);
             $rootScope.userInfo["name"] = code;
 
         }
 
     });
 
 })
.directive('franceConnectInfo', function () {

    return {
        template: "<span data-ng-if='userInfo.length>0'>Connecté en tant que {{userInfo['name']}}</span>"+
                    "<span data-ng-if='!userInfo.length'>Non Connecté</span>"
    }

}).directive('franceConnectLink',function () {
    var controller = ['$rootScope', '$scope', '$window', function ($rootScope, $scope, $window) {

            /** myApp.franceConnectScope */
            $scope.franceConnect = {
                clientId: '773501223f8673e7e499c73a9bf8ea1455b8d82ee5c00f0459f44bb92a0df6c6',
                uriCallback: 'http://localhost/'
            };
            $scope.loginUrl = "https://fcp.integ01.dev-franceconnect.fr/api/v1/authorize" +
                    "?response_type=code&client_id=" + $scope.franceConnect.clientId + "&redirect_uri=" +
                    $scope.franceConnect.uriCallback + "&scope=openid&state=fakeState&nonce=fakeNonce";
	    $scope.logoutUrl = "https://fcp.integ01.dev-franceconnect.fr/api/v1/logout";

            $scope.signOut = function(){
                $rootScope.userInfo = [];
                $window.location.href = $scope.logoutUrl;
            }
            $scope.userInfo = $rootScope.userInfo;
 
        }];

    return {
        restrict: 'EA',
        scope: {
            datasource: '=',
            add: '&',
        },
        controller: controller,
        template: "{{userInfo}}<md-button data-ng-if='!userInfo.length' data-ng-href='{{loginUrl}}'>Sign in</md-button>"+
"<md-button data-ng-if='userInfo.length' data-ng-click='signOut()'>Sign out</md-button>"
    };

});
