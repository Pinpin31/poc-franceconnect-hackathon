angular.module("adresseServiceModule", [])
    .constant("apiAdresseConfig", {
        url: "http://api-adresse.data.gouv.fr/search/?q="
    })
    .factory("adresseService", ["$http", "$q", "apiAdresseConfig",
        function($http, $q, apiAdresseConfig) {
            return {
                lastResult: "",
                get: function(adresseSearch) {
                    var deferred = $q.defer();
                    $http.get(apiAdresseConfig.url + adresseSearch).
                    success(function(data, status, headers, config) {
                        lastResult = data;
                        deferred.resolve(data);
                    }).
                    error(function(data, status, headers, config) {
                        deferred.reject(data);
                    });
                    return deferred.promise;
                },
                validate: function(adressSearch) {
                    var deferred = $q.defer();
                    var promise = this.get(adressSearch);
                    promise.then(function(result) {
                        if (result.features.length > 0) {
                            deferred.resolve(true);
                        } else {
                            deferred.resolve(false);
                        }
                    });
                    return deferred.promise;

                }
            };
        }
    ]);
