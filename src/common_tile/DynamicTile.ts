{
    angular.module('pipDashboard')
        .directive('pipDynamicTile', function (
            $templateRequest: angular.ITemplateRequestService,
            $compile: angular.ICompileService,
            $interpolate: angular.IInterpolateService
        ) {
            return {
                restrict: 'E',
                scope: {
                    options: '=pipOptions'
                },
                templateUrl: 'common_tile/DynamicTile.html',
                controller: '@',
                name: 'controller',
                controllerAs: '$ctrl',
                bindToController: true,
                link: function ($scope, $element, $attrs) {
                    const DEFAULT_MENU = [{
                        title: 'Change Size',
                        action: angular.noop,
                        submenu: [{
                                title: '1 x 1',
                                action: () => {
                                    setSizes(1, 1);
                                },
                                params: {
                                    sizeX: 1,
                                    sizeY: 1
                                }
                            },
                            {
                                title: '2 x 1',
                                action: () => {
                                    setSizes(2, 1);
                                },
                                params: {
                                    sizeX: 2,
                                    sizeY: 1
                                }
                            },
                            {
                                title: '2 x 2',
                                action: () => {
                                    setSizes(2, 2);
                                },
                                params: {
                                    sizeX: 2,
                                    sizeY: 2
                                }
                            }
                        ]
                    }];

                    angular.extend($scope['$ctrl'].options.menu, DEFAULT_MENU);

                    if (angular.isDefined($attrs['controllerAs']) && $attrs['controllerAs']) {
                        $scope[$attrs['controllerAs']] = $scope['$ctrl'];
                    }

                    if (angular.isDefined($attrs['template'])) {
                        $templateRequest($attrs['template']).then((html) => {
                            $element.find('pip-specific-template').replaceWith($compile(html)($scope));
                        });
                    }

                    function setSizes(x, y) {
                        $scope['$ctrl'].options.size.colSpan = x;
                        $scope['$ctrl'].options.size.rowSpan = y;
                    }
                }
            }
        })
}