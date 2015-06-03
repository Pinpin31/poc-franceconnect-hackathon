/*global angular*/
(function () {
    'use strict';
    angular.module('apiculteurModule', ['ngRoute'])
            .controller('apiculteurController', ['$scope', '$http', '$log', function ($scope, $http, $log) {

                    //Récupération des infos des apiculteurs
                    $http.get('data/apiculteurs.json')
                            .success(function (data, status, headers, config) {
                                $scope.apiculteurs = data.apiculteurs;

                                $scope.markers = {};
                                for (var i = 0, len = data.apiculteurs[0].ruchers.length; i < len; i++) {
                                    $scope.markers[i] = {
                                        lat: data.apiculteurs[0].ruchers[i].lat,
                                        lng: data.apiculteurs[0].ruchers[i].lng,
                                        message: data.apiculteurs[0].ruchers[i].nom,
                                        icon: local_icons.bee_icon
                                    };
                                }
                            })
                            .error(function (data, status, headers, config) {
                                $log.error("Erreur HTTP " + status + ".");
                            });

                    //Gestion de la carte des ruchers
                    var local_icons = {
                        default_icon: {},
                        bee_icon: {
                            iconUrl: 'favicon.ico',
                            //shadowUrl: 'examples/img/leaf-shadow.png',
                            iconSize: [38, 38], // size of the icon
                            shadowSize: [50, 50], // size of the shadow
//                            iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
//                            shadowAnchor: [4, 62], // the same for the shadow
//                            popupAnchor: [0, 0] // point from which the popup should open relative to the iconAnchor
                        }
                    };

                    angular.extend($scope, {
                        defaults: {
                            tileLayer: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                            maxZoom: 20
                        },
                        center: {
                            lat: 43.56,
                            lng: 1.47,
                            zoom: 11
                        }
                    });
                }]);
}());