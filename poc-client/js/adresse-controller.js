angular.module("adresseTestModule", [])
    .controller('adresseController', ['$scope', 'adresseService',
        function($scope, adresseService) {
            $scope.adresseSearch = "3 impasse des mimosas, Limoux";
            $scope.addressesFind = {};
            $scope.selectedAddress = "";

            angular.extend($scope, {
                defaults: {
                    tileLayer: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                    maxZoom: 20,
                    path: {
                        weight: 10,
                        color: '#800000',
                        opacity: 1
                    }
                },
                center: {
                    lat: 51.505,
                    lng: -0.09,
                    zoom: 4
                },
                events: {
                    map: {
                        enable: [],
                        logic: 'emit'
                    },
                    marker: {
                        enable: ['click'],
                        logic: 'emit'
                    }
                },
            });

            $scope.$on('leafletDirectiveMarker.click', function(e, args) {
                $scope.selectedAddress = args.model.message;
            });

            $scope.markers = new Array();

            $scope.search = function() {
                $scope.center = {
                    lat: 51.505,
                    lng: -0.09,
                    zoom: 4
                };
                adresseService.get($scope.adresseSearch).then(function(result) {
                    if (result.features.length > 0) {
                        $scope.addressesFind = result.features;
                        $scope.markers = {};
                        for (var key in result.features) {
                            var feature = result.features[key];
                            $scope.markers[key] = {
                                lat: feature.geometry.coordinates[1],
                                lng: feature.geometry.coordinates[0],
                                message: feature.properties.label,
                                icon: {
                                    markerColor: 'red'
                                }
                            };
                        }

                    }
                });
            };

            $scope.moveTo = function(feature, key) {
                $scope.markers[key].icon.markerColor = 'green';
                $scope.center = {
                    lat: feature.geometry.coordinates[1],
                    lng: feature.geometry.coordinates[0],
                    zoom: 17
                }
            };

        }
    ])
    .controller('addressAutocompleteController', ['$scope', 'adresseService', '$q',
        function($scope, adresseService, $q) {
            $scope.addressAutocomplete = "";

            $scope.updateAddresses = function(typeAhead) {

                if (typeAhead) {
                    var deferred = $q.defer();
                    var results = new Array();
                    adresseService.get(typeAhead).then(function(result) {
                        var finds = result.features;
                        for (var key in result.features) {
                            var feature = result.features[key];
                            results.push({display: feature.properties.label});
                        }
                        deferred.resolve( results );

                    });
                    return deferred.promise;
                } else {
                    return new Array();
                }

            };

        }
    ]);
