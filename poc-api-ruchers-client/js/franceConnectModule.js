/**
 * @name myApp.franceConnectScope
 * @extends myApp.scope
 * @property {string} clientId
 * @property {string} uriCallback
 */

angular.module("franceConnectModule", [])
.factory('FCauthenticationService', function ($rootScope, $q, $http, ipCookie, $location) {
    
    var cookieName = "fc.authentication.cookie";

        return {
            /**
             * Récupère le credential depuis la ressource credential du serveur
             *
             * @param code
             * @returns {!goog.Promise.<TYPE>|Function|d.promise|promise|goog.promise|goog.Promise.Resolver_.promise|*}
             */
            getCredential: function (code) {
                
                 var urlCredential = "http://localhost:8080/openid/userinfo";
                   var deferred = $q.defer();
                 $http.get(urlCredential).
                     success(function (data) {
                         console.log('Success to get Credential with ticket : ' + JSON.stringify(data));
                         deferred.resolve(data);
                     }).
                     error(function () {
                         console.log('Error to get Credential');
                         deferred.resolve({});
                     });
                   //deferred.resolve({login: "test.test", name : "Test", secret: "secret", application: "poc-client"});
                   return deferred.promise;
            },

            /**
             * Enregistre les informations de credential dans un cookie
             * @param credential
             */
            storeCredentialInLocalStore: function (credential) {
                var expires = 30;
                ipCookie(cookieName, JSON.stringify(credential), {
                    expires: expires,
                    expirationUnit: 'minutes'
                });
                console.log('Success to create Credential in cookie.');
            },

            /**
             * Suppression des informations de credential dans le cookie
             */
            deleteCredentialInLocalStore: function () {
                ipCookie.remove(cookieName);
                console.log('Success to delete credential in cookie.');
            },

            /**
             * Récupère les informations de credential du cookie
             * @returns {*}
             */
            getCredentialInLocalStore: function () {
                var cookieText = ipCookie(cookieName);
                if (angular.isDefined(cookieText)) {
                    $rootScope.login = cookieText.family_name;
                    if (angular.isDefined(cookieText.given_name)) {
                        $rootScope.login = cookieText.given_name + ' ' + cookieText.family_name;
                    }
                    return cookieText;
                }
                return {};
            },

            /**
             * Vérifie que les informations de credential sont valides
             *
             * @param credential
             * @returns boolean
             */
            isValidCredential: function (credential) {
                if (credential === null || credential === undefined) {
                    return false;
                }
                return (angular.isDefined(credential.family_name)
                    && angular.isDefined(credential.given_name)
                    
                    );
            },

            /**
             * Un utilisateur est-il authentifié ?
             * @returns {boolean|*}
             */
            isAuthenticated: function () {
                var credential = this.getCredentialInLocalStore();
                return angular.isDefined(credential.family_name);
            },

            /**
             * Lance l'authentification
             * Méthode à appeler dans la méthode run du ficier app.js
             */
            authenticate: function(){
                if(!this.isAuthenticated()){
                    self=this;
                    this.getCredential().then(function (result) {
                        if (self.isValidCredential(result)) {
                            self.storeCredentialInLocalStore(result);
                            $rootScope.$emit('fc.authentication.success');
                        } else {
                            $rootScope.$emit('fc.authentication.error');
                        }
                    });
                }
            }

        };
    })
.run(['FCauthenticationService', function(FCauthenticationService){
        // au lancement du module, on vérifie si l'utilisateur possède un cookie
        FCauthenticationService.getCredentialInLocalStore();
        // on lance l'authentification s'il n'est pas authentifié
        if(!FCauthenticationService.isAuthenticated()) {
            FCauthenticationService.authenticate();
        }
    }])
.directive('franceConnectInfo', function () {

    return {
        controller: 'franceConnectController',
        template: "<span data-ng-if='isLogged()'>Identifié en tant que {{login}}</span>"+
                    "<span data-ng-if='!isLogged()'>Non identifié</span>"
    }

})
.controller('franceConnectController', ['$rootScope', '$scope', '$window', 'FCauthenticationService', function ($rootScope, $scope, $window, FCauthenticationService) {

            /** myApp.franceConnectScope */
            $scope.franceConnect = {
                clientId: '773501223f8673e7e499c73a9bf8ea1455b8d82ee5c00f0459f44bb92a0df6c6',
                uriCallback: 'http://localhost:8080/spring_openid_check'
            };
            $scope.loginUrl = "http://localhost:8080/spring_openid_check";
	    $scope.logoutUrl = "http://localhost:8080/logout";

            $scope.signOut = function(){
                FCauthenticationService.deleteCredentialInLocalStore();
                $window.location.href = $scope.logoutUrl;
            }
            $scope.signIn = function() {
                $window.location.href = $scope.loginUrl;   
            }
            /**
             * L'utilisateur est-il loggué/authentifié ?
             * @returns {boolean}
             */
            $scope.isLogged = function () {
                var credential = FCauthenticationService.getCredentialInLocalStore();
                return angular.isDefined(credential.family_name);
            };

 
        }])
    .directive('franceConnectLink',function () {

    return {
        restrict: 'EA',
        scope: {
            datasource: '=',
            add: '&',
        },
        controller: 'franceConnectController',
        template: "<md-button data-ng-if='!isLogged()' data-ng-click='signIn()'>Sign in</md-button>"+
"<md-button data-ng-if='isLogged()' data-ng-click='signOut()'>Sign out</md-button>"
    };

});
