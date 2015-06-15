/*global angular*/
(function () {
    'use strict';
    angular.module('dashboardModule', ['chart.js'])
            .controller('dashboardController', ['$scope', '$http', '$log', function ($scope, $http, $log) {
                
                $scope.chart = {
                    labels: ["2009", "2010", "2011", "2012", "2013", "2014", "2015"],
                    series: ['Nombre de ruches'],
                    data: [
                        [10, 24, 32, 48, 26, 28, 31]
                    ],
                    onClick: function (points, evt) {
                        console.log(points, evt);
                    }
                };
                
                $scope.bar  = {
                    labels: ["2009", "2010", "2011", "2012", "2013", "2014", "2015"],
                    series: ['Nombre de ruches'],
                    data: [
                        [10, 24, 32, 48, 26, 28, 31]
                    ],
                    onClick: function (points, evt) {
                        console.log(points, evt);
                    }
                };
                
            }]);
}());
