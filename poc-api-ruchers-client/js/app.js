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
                        .when('/ruchers', {
                            templateUrl: 'partials/ruchers.html',
                            controller: 'apiculteurController'
                            
                        }).when('/start', {
                             templateUrl: 'partials/start.html'
                             
                        })
                        .otherwise({
                            redirectTo: '/start'
                        });

                $mdIconProvider
                        .defaultIconSet("./assets/svg/avatars.svg", 128)
                        .icon("menu", "./assets/svg/menu.svg", 24)
                        .icon("share", "./assets/svg/share.svg", 24)
                        .icon("google_plus", "./assets/svg/google_plus.svg", 512)
                        .icon("hangouts", "./assets/svg/hangouts.svg", 512)
                        .icon("twitter", "./assets/svg/twitter.svg", 512)
                        .icon("phone", "./assets/svg/phone.svg", 512)
                        .icon("mail", "./assets/svg/mail.svg", 1024)
                        .icon("ble", "./assets/svg/noun-ble.svg", 512)
                        .icon("aide", "./assets/svg/noun-aide.svg", 512)
                        .icon("bio", "./assets/svg/noun-bio.svg", 512)
                        .icon("bee", "./assets/svg/noun-bee.svg", 100);

                $mdThemingProvider.theme('default')
                        .primaryPalette('yellow')
                        .accentPalette('orange');

                $locationProvider.html5Mode(false);
            }
        ]);
