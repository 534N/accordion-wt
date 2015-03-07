var myApp = angular.module('myApp', [
    'ngAnimate',
    'myController',
    'myDirective'
]);


var myController = angular.module('myController', []);

myController
    .controller('myCtrl', ['$scope', 
        function($scope) {
            var options = [
                {
                    name: 'Accordion 1',
                    template: 'template1.html'
                },
                {
                    name: 'Accordion 2',
                    template: 'template2.html'
                },
                {
                    name: 'Accordion 3',
                    template: 'template3.html'
                },
                {
                    name: 'Accordion 4',
                    template: 'template4.html'
                }
            ];

            $scope.options = options;
        }
    ])

var myDirective = angular.module('myDirective', []);

myDirective
    .controller('accordionCtrl', ['$scope',
        function($scope) {

            this.panes = [];

            this.addPane = function(scope) {
                this.panes.push(scope);
            };

            this.closeOthers = function(scope) {
                angular.forEach(this.panes, function(paneScope) {
                    if (paneScope != scope) {
                        paneScope.isOpen = false;
                    }
                })
            }
        }
    ])
    .directive('accordionGroup', function(){
        return {
            restrict: 'EA',
            scope: {},
            transclude: true,
            templateUrl: 'accordionGroup.html',
            controller: 'accordionCtrl',
            link: function(scope, ele, attrs){
                scope.isEnabled = true;
            }
        }
    })
    .directive('accordionPane', function(){
        return {
            restrict: 'EA',
            require:'^accordionGroup',
            scope: {
                title: '@'
            },
            transclude: true,
            templateUrl: 'accordionPane.html',
            controller: function() {

            },
            link: function(scope, ele, attrs, accordionCtrl) {
                accordionCtrl.addPane(scope);
                if (typeof(scope.isOpen) == 'undefined') scope.isOpen = false;

                scope.activeClass = function() {
                   return scope.isOpen ? "active" : '';
                }
                // 
                // scope functions
                // 
                scope.toggle = function() {
                    scope.isOpen = !scope.isOpen;
                    accordionCtrl.closeOthers(scope);
                }
            }
        }
    })
    .directive('accordionBody', ["$http", "$templateCache", "$compile", 
        function($http, $templateCache, $compile) {
            return {
                restrict: 'EA',
                require:'^accordionPane',
                scope: {
                    template: '@'
                },
                link: function(scope, ele, attrs, accordionCtrl) {
                    var template = scope.template;
                    // 
                    // Magic: compiles the scope for the template
                    // 
                    $http.get(template, {cache: $templateCache})
                    .then(function(response) {
                        templateScope = scope.$new();
                        ele.html(response.data);
                        $compile(ele.contents())(templateScope);
                    }); 
                }
            };
        }
    ])
    
    
    