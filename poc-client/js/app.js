/* App Module */

var adresseTestApp = angular.module("adresseTestApp", ["adresseServiceModule",
    "franceConnectModule",
    "appNavigationModule",
    "ngRoute",
    "ngStorage",
    "adresseTestModule",
    "leaflet-directive",
    'ngMaterial',
    'autocomplete'
])
    .config(['$routeProvider', '$mdThemingProvider', '$mdIconProvider',

        function ($routeProvider, $mdThemingProvider, $mdIconProvider) {

            $routeProvider.
                when("/addressValidator", {
                    templateUrl: 'partials/address-validator.html',
                    controller: 'adresseController'
                })
                .when('/addressAutocomplete', {
                    templateUrl: 'partials/address-autocomplete.html',
                    controller: 'addressAutocompleteController'
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
        }
    ]);
