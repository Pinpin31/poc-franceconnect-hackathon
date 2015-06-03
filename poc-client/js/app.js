/* App Module */

var adresseTestApp = angular.module("adresseTestApp", ["adresseServiceModule",
    "appNavigationModule",
    "ngRoute",
    "ngStorage",
    "adresseTestModule",
    "leaflet-directive",
    'ngMaterial',
    'ipCookie',
    "franceConnectModule",
    'autocomplete',
    'apiculteurModule'
])
        .config(['$routeProvider', '$mdThemingProvider', '$mdIconProvider', '$locationProvider',
            function ($routeProvider, $mdThemingProvider, $mdIconProvider, $locationProvider) {

                $routeProvider.
                        when("/addressValidator", {
                            templateUrl: 'partials/address-validator.html',
                            controller: 'adresseController'
                        })
                        .when('/addressAutocomplete', {
                            templateUrl: 'partials/address-autocomplete.html',
                            controller: 'addressAutocompleteController'
                        })
                        .when('/apiculteurInfos', {
                            templateUrl: 'partials/apiculteur.html',
                            controller: 'apiculteurController'
                        })
                        .otherwise({
                            redirectTo: '/'
                        });

                $mdIconProvider
                        .defaultIconSet("./assets/svg/avatars.svg", 128)
                        .icon("menu", "./assets/svg/menu.svg", 24)
                        .icon("share", "./assets/svg/share.svg", 24)
                        .icon("google_plus", "./assets/svg/google_plus.svg", 512)
                        .icon("hangouts", "./assets/svg/hangouts.svg", 512)
                        .icon("twitter", "./assets/svg/twitter.svg", 512)
                        .icon("phone", "./assets/svg/phone.svg", 512);

                $mdThemingProvider.theme('default')
                        .primaryPalette('brown')
                        .accentPalette('red');

                $locationProvider.html5Mode(false);
            }
        ]);
