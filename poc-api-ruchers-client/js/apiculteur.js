/*global angular*/
(function () {
    'use strict';
    angular.module('apiculteurModule', ['ngRoute'])
            .controller('apiculteurController', ['$scope', '$http', '$log', '$rootScope',
                        function ($scope, $http, $log, $rootScope) {
                            
                            //Gestion de la carte des ruchers
                    var local_icons = {
                        default_icon: {},
                        bee_icon: {
                            iconUrl: 'assets/svg/bee.svg',
                            //shadowUrl: 'examples/img/leaf-shadow.png',
                            iconSize: [38, 38], // size of the icon
                            shadowSize: [50, 50], // size of the shadow
//                            iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
//                            shadowAnchor: [4, 62], // the same for the shadow
//                            popupAnchor: [0, 0] // point from which the popup should open relative to the iconAnchor
                        },
                        yellow_icon: {
                            color: 'yellow',
                            fillColor: '#f03',
                            fillOpacity: 0.5   
                        }
                    };
                
                if(!$rootScope.apiculteurs){
                    //Récupération des infos des apiculteurs
                    $http.get('data/apiculteurs.json')
                            .success(function (data, status, headers, config) {
                                $rootScope.apiculteurs = data.apiculteurs;

                                loadMarkers();
                            })
                            .error(function (data, status, headers, config) {
                                $log.error("Erreur HTTP " + status + ".");
                            });
                }else{
                    loadMarkers();
                }
                
                function loadMarkers(){
                    $scope.nbMarkers=0;
                    $scope.markers = {};
                                for (var i = 0, len = $rootScope.apiculteurs[0].ruchers.length; i < len; i++) {
                                    $scope.markers[i] = {
                                        lat: $rootScope.apiculteurs[0].ruchers[i].lat,
                                        lng: $rootScope.apiculteurs[0].ruchers[i].lng,
                                        message: $rootScope.apiculteurs[0].ruchers[i].nom,
                                        icon: local_icons.yellow_icon
                                    };
                                    $scope.nbMarkers=$scope.nbMarkers+1;
                                }
                }

                    angular.extend($scope, {
                        defaults: {
                            tileLayer: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                            maxZoom: 20
                            },
                        events: {
                            map: {
                                enable: ['click', 'drag', 'blur', 'touchstart'],
                                logic: 'emit'
                            },
                        controls: {
                            draw: {}
                            }
                        }
                    });
                        
                    $scope.center = {
                            lat: 43.56,
                            lng: 1.47,
                            zoom: 11
                        };
                    
                    $scope.addRucher = function () {
                        
                        if (navigator.geolocation) {
                            navigator.geolocation.getCurrentPosition(newRucher, showError, {
                                                enableHighAccuracy: true,timeout : 50000
                                            });
                        } else {
                            console.log("Geolocation is not supported by this browser.");
                        }
                        
                    };
                    
                    function newRucher(position) {
                        console.log( "Latitude: " + position.coords.latitude + 
                        "<br>Longitude: " + position.coords.longitude); 
                        var rucher = {
                                        lat: position.coords.latitude,
                                        lng: position.coords.longitude,
                                        message: 'Nouveau Rucher'
                                    };
                        $scope.nbMarkers=$scope.nbMarkers+1;
                        $scope.markers['marker'+$scope.nbMarkers]= rucher;
                        $rootScope.apiculteurs[0].ruchers.push({"annee": "2015",
                                                            "nom": "Nouveau Rucher",
                                                            "lat": position.coords.latitude,
                                                            "lng": position.coords.longitude
                                                            });
                        
                        $scope.center = {
                                lat: position.coords.latitude,
                                lng: position.coords.longitude
                            };
                        
                        }
                        
                    $scope.$on("leafletDirectiveMap.click", function(event, args){
                        var leafEvent = args.leafletEvent;
                        var position = {
                            coords:{
                                "latitude":leafEvent.latlng.lat,
                                "longitude":leafEvent.latlng.lng
                            }
                        }
                        newRucher(position);
                    });
                    
                    function showError(error) {
                        switch(error.code) {
                            case error.PERMISSION_DENIED:
                                console.log("User denied the request for Geolocation.");
                                break;
                            case error.POSITION_UNAVAILABLE:
                                console.log("Location information is unavailable.");
                                break;
                            case error.TIMEOUT:
                                console.log("The request to get user location timed out.");
                                break;
                            case error.UNKNOWN_ERROR:
                                console.log("An unknown error occurred.");
                                break;
                        }
                    }
                    
                }]);
}());
