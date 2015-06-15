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
                
                 var timeStamp = new Date().getTime();
                 var serviceUrl = $location.absUrl();
                 if(serviceUrl.indexOf('?')>0) {
                      serviceUrl = serviceUrl.replace(serviceUrl.substring(serviceUrl.indexOf('?')), '');
                 }
                 if(serviceUrl.indexOf('#')>0) {
                     serviceUrl = serviceUrl.replace(serviceUrl.substring(serviceUrl.indexOf('#')), '');
                 }
                 var urlCredential = "http://localhost:8080/spring_openid_check?code=" + code;
                   var deferred = $q.defer();
                 $http.get(urlCredential).
                     success(function (data) {
                         logger.debug('Success to get Credential with ticket ' + serviceTicket + ': ' + JSON.stringify(data));
                         deferred.resolve(data);
                     }).
                     error(function () {
                         logger.error('Error to get Credential  with ticket ' + serviceTicket);
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
                    $rootScope.login = cookieText.login;
                    if (angular.isDefined(cookieText.name)) {
                        $rootScope.login = cookieText.name;
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
                return (angular.isDefined(credential.secret)
                    && angular.isDefined(credential.login)
                    && angular.isDefined(credential.application)
                    );
            },

            /**
             * Un utilisateur est-il authentifié ?
             * @returns {boolean|*}
             */
            isAuthenticated: function () {
                return angular.isDefined($rootScope.login);
            },

            /**
             * Permet de récupérer le paramètre contenant la valeur du code renvoyé par FC
             * @returns {*}
             */
            getParamCodeFromUrl: function () {
                // si le path est vide, c'est que l'on revient de FC
                if ($location.path() === "") {
                    // on récupère le ticket dans l'url
                    var absUrl = $location.absUrl();
                    var re = new RegExp(".*[?&]code=([^&]+)(&|$)");
                    var searchCode = absUrl.match(re);
                    var code = (searchCode ? searchCode[1] : "");
                    console.log("find code authorization from FC " + code);
                    return code;
                }
                return "";
            },

            /**
             * Permet de supprimer le paramètre contenant le ticket car il est placé avant le path Angular
             * et cela pose problème si on le garde dans l'url. Angular ne le voit pas et ne veut pas le
             * supprimer !
             * Alors on réalise une redirection de sauvage en javascript !
             */
            cleanUrlFromCode: function () {
                var absUrl = $location.absUrl();
                var newUrl = absUrl.replace(absUrl.substring(absUrl.indexOf('?')), '');
                //window.history.pushState('page2', 'Title', newUrl); // non fonctionnel :(
                document.location.href = newUrl;
            },

            /**
             * Lance l'authentification
             * Méthode à appeler dans la méthode run du ficier app.js
             */
            authenticate: function(){
                var code = this.getParamCodeFromUrl();
                if (code != "" && !this.isAuthenticated()) {
                    self=this;
                    this.getCredential(code).then(function (result) {
                        if (self.isValidCredential(result)) {
                            self.storeCredentialInLocalStore(result);
                            $rootScope.$emit('fc.authentication.success');
                        } else {
                            $rootScope.$emit('fc.authentication.error');
                        }
                        self.cleanUrlFromCode();
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
        template: "<span data-ng-if='isLogged()'>Connecté en tant que {{login}}</span>"+
                    "<span data-ng-if='!isLogged()'>Non Connecté</span>"
    }

})
.controller('franceConnectController', ['$rootScope', '$scope', '$window', 'FCauthenticationService', function ($rootScope, $scope, $window, FCauthenticationService) {

            /** myApp.franceConnectScope */
            $scope.franceConnect = {
                clientId: '773501223f8673e7e499c73a9bf8ea1455b8d82ee5c00f0459f44bb92a0df6c6',
                uriCallback: 'http://localhost:8080/spring_openid_check'
            };
            $scope.loginUrl = "https://fcp.integ01.dev-franceconnect.fr/api/v1/authorize" +
                    "?response_type=code&client_id=" + $scope.franceConnect.clientId + "&redirect_uri=" +
                    $scope.franceConnect.uriCallback + "&scope=openid&state=fakeState&nonce=fakeNonce";
	    $scope.logoutUrl = "https://fcp.integ01.dev-franceconnect.fr/api/v1/logout";

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
                return angular.isDefined(credential.login);
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
