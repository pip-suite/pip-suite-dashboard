(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}(g.pip || (g.pip = {})).dashboard = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AddTileDialog = (function () {
    function AddTileDialog() {
    }
    return AddTileDialog;
}());
exports.AddTileDialog = AddTileDialog;
var AddTileDialogController = (function () {
    function AddTileDialogController(groups, activeGroupIndex, widgetList, $mdDialog) {
        this.activeGroupIndex = activeGroupIndex;
        this.$mdDialog = $mdDialog;
        this.totalTiles = 0;
        this.activeGroupIndex = _.isNumber(activeGroupIndex) ? activeGroupIndex : -1;
        this.defaultTiles = _.cloneDeep(widgetList);
        this.groups = _.map(groups, function (group) {
            return group['title'];
        });
    }
    AddTileDialogController.prototype.add = function () {
        this.$mdDialog.hide({
            groupIndex: this.activeGroupIndex,
            widgets: this.defaultTiles
        });
    };
    ;
    AddTileDialogController.prototype.cancel = function () {
        this.$mdDialog.cancel();
    };
    ;
    AddTileDialogController.prototype.encrease = function (groupIndex, widgetIndex) {
        var widget = this.defaultTiles[groupIndex][widgetIndex];
        widget.amount++;
        this.totalTiles++;
    };
    ;
    AddTileDialogController.prototype.decrease = function (groupIndex, widgetIndex) {
        var widget = this.defaultTiles[groupIndex][widgetIndex];
        widget.amount = widget.amount ? widget.amount - 1 : 0;
        this.totalTiles = this.totalTiles ? this.totalTiles - 1 : 0;
    };
    ;
    return AddTileDialogController;
}());
exports.AddTileDialogController = AddTileDialogController;
},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AddTileDialogController_1 = require("./AddTileDialogController");
{
    var setTranslations = function ($injector) {
        var pipTranslate = $injector.has('pipTranslateProvider') ? $injector.get('pipTranslateProvider') : null;
        if (pipTranslate) {
            pipTranslate.setTranslations('en', {
                DASHBOARD_ADD_TILE_DIALOG_TITLE: 'Add component',
                DASHBOARD_ADD_TILE_DIALOG_USE_HOT_KEYS: 'Use "Enter" or "+" buttons on keyboard to encrease and "Delete" or "-" to decrease tiles amount',
                DASHBOARD_ADD_TILE_DIALOG_CREATE_NEW_GROUP: 'Create new group'
            });
            pipTranslate.setTranslations('ru', {
                DASHBOARD_ADD_TILE_DIALOG_TITLE: 'Добавить компонент',
                DASHBOARD_ADD_TILE_DIALOG_USE_HOT_KEYS: 'Используйте "Enter" или "+" клавиши на клавиатуре чтобы увеличить и "Delete" or "-" чтобы уменшить количество тайлов',
                DASHBOARD_ADD_TILE_DIALOG_CREATE_NEW_GROUP: 'Создать новую группу'
            });
        }
    };
    setTranslations.$inject = ['$injector'];
    var AddTileDialogService_1 = (function () {
        function AddTileDialogService_1(widgetList, $mdDialog) {
            this.widgetList = widgetList;
            this.$mdDialog = $mdDialog;
        }
        AddTileDialogService_1.prototype.show = function (groups, activeGroupIndex) {
            var _this = this;
            return this.$mdDialog
                .show({
                templateUrl: 'add_tile_dialog/AddTile.html',
                bindToController: true,
                controller: AddTileDialogController_1.AddTileDialogController,
                controllerAs: 'dialogCtrl',
                clickOutsideToClose: true,
                resolve: {
                    groups: function () {
                        return groups;
                    },
                    activeGroupIndex: function () {
                        return activeGroupIndex;
                    },
                    widgetList: function () {
                        return _this.widgetList;
                    }
                }
            });
        };
        ;
        return AddTileDialogService_1;
    }());
    var AddTileDialogProvider = (function () {
        function AddTileDialogProvider() {
            this._tilesList = null;
            this.configTilesList = function (list) {
                this._tilesList = list;
            };
        }
        AddTileDialogProvider.prototype.$get = ['$mdDialog', function ($mdDialog) {
            "ngInject";
            if (this._service == null)
                this._service = new AddTileDialogService_1(this._tilesList, $mdDialog);
            return this._service;
        }];
        return AddTileDialogProvider;
    }());
    angular
        .module('pipAddDashboardTileDialog')
        .config(setTranslations)
        .provider('pipAddTileDialog', AddTileDialogProvider);
}
},{"./AddTileDialogController":1}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
angular
    .module('pipAddDashboardTileDialog', ['ngMaterial']);
require("./AddTileDialogController");
require("./AddTileProvider");
},{"./AddTileDialogController":1,"./AddTileProvider":2}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DashboardTile = (function () {
    function DashboardTile() {
        var _this = this;
        this.menu = [{
                title: 'Change Size',
                action: angular.noop,
                submenu: [{
                        title: '1 x 1',
                        action: function () { _this.changeSize({ sizeX: 1, sizeY: 1 }); },
                        params: {
                            sizeX: 1,
                            sizeY: 1
                        }
                    },
                    {
                        title: '2 x 1',
                        action: 'changeSize',
                        params: {
                            sizeX: 2,
                            sizeY: 1
                        }
                    },
                    {
                        title: '2 x 2',
                        action: 'changeSize',
                        params: {
                            sizeX: 2,
                            sizeY: 2
                        }
                    }
                ]
            }];
    }
    DashboardTile.prototype.changeSize = function (params) {
        this.options.size.colSpan = params.sizeX;
        this.options.size.rowSpan = params.sizeY;
    };
    return DashboardTile;
}());
exports.DashboardTile = DashboardTile;
},{}],5:[function(require,module,exports){
{
    angular.module('pipDashboard')
        .directive('pipDynamicTile', ['$templateRequest', '$compile', '$interpolate', function ($templateRequest, $compile, $interpolate) {
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
                var DEFAULT_MENU = [{
                        title: 'Change Size',
                        action: angular.noop,
                        submenu: [{
                                title: '1 x 1',
                                action: function () {
                                    setSizes(1, 1);
                                },
                                params: {
                                    sizeX: 1,
                                    sizeY: 1
                                }
                            },
                            {
                                title: '2 x 1',
                                action: function () {
                                    setSizes(2, 1);
                                },
                                params: {
                                    sizeX: 2,
                                    sizeY: 1
                                }
                            },
                            {
                                title: '2 x 2',
                                action: function () {
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
                    $templateRequest($attrs['template']).then(function (html) {
                        $element.find('pip-specific-template').replaceWith($compile(html)($scope));
                    });
                }
                function setSizes(x, y) {
                    $scope['$ctrl'].options.size.colSpan = x;
                    $scope['$ctrl'].options.size.rowSpan = y;
                }
            }
        };
    }]);
}
},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TileColors = (function () {
    function TileColors() {
    }
    return TileColors;
}());
TileColors.all = ['purple', 'green', 'gray', 'orange', 'blue'];
var TileSizes = (function () {
    function TileSizes() {
    }
    return TileSizes;
}());
TileSizes.all = [{
        name: 'DASHBOARD_TILE_CONFIG_DIALOG_SIZE_SMALL',
        id: '11'
    },
    {
        name: 'DASHBOARD_TILE_CONFIG_DIALOG_SIZE_WIDE',
        id: '21'
    },
    {
        name: 'DASHBOARD_TILE_CONFIG_DIALOG_SIZE_LARGE',
        id: '22'
    }
];
var TileConfigDialogController = (function () {
    TileConfigDialogController.$inject = ['params', 'extensionUrl', '$mdDialog'];
    function TileConfigDialogController(params, extensionUrl, $mdDialog) {
        "ngInject";
        var _this = this;
        this.params = params;
        this.extensionUrl = extensionUrl;
        this.$mdDialog = $mdDialog;
        this.colors = TileColors.all;
        this.sizes = TileSizes.all;
        this.sizeId = TileSizes.all[0].id;
        angular.extend(this, this.params);
        this.sizeId = '' + this.params.size.colSpan + this.params.size.rowSpan;
        this.onCancel = function () {
            _this.$mdDialog.cancel();
        };
    }
    TileConfigDialogController.prototype.onApply = function (updatedData) {
        this['size'].sizeX = Number(this.sizeId.substr(0, 1));
        this['size'].sizeY = Number(this.sizeId.substr(1, 1));
        this.$mdDialog.hide(updatedData);
    };
    return TileConfigDialogController;
}());
exports.TileConfigDialogController = TileConfigDialogController;
},{}],7:[function(require,module,exports){
{
    var TileConfigExtendComponentBindings = {
        pipExtensionUrl: '<',
        pipDialogScope: '<',
        pipApply: '&'
    };
    var TileConfigExtendComponentChanges = (function () {
        function TileConfigExtendComponentChanges() {
        }
        return TileConfigExtendComponentChanges;
    }());
    var TileConfigExtendComponentController = (function () {
        function TileConfigExtendComponentController($templateRequest, $compile, $scope, $element, $attrs) {
            this.$templateRequest = $templateRequest;
            this.$compile = $compile;
            this.$scope = $scope;
            this.$element = $element;
            this.$attrs = $attrs;
        }
        TileConfigExtendComponentController.prototype.$onChanges = function (changes) {
            var _this = this;
            if (changes.pipDialogScope) {
                delete changes.pipDialogScope.currentValue['$scope'];
                angular.extend(this, changes.pipDialogScope.currentValue);
            }
            if (changes.pipExtensionUrl && changes.pipExtensionUrl.currentValue) {
                this.$templateRequest(changes.pipExtensionUrl.currentValue, false).then(function (html) {
                    _this.$element.find('pip-extension-point').replaceWith(_this.$compile(html)(_this.$scope));
                });
            }
        };
        TileConfigExtendComponentController.prototype.onApply = function () {
            this.pipApply({ updatedData: this });
        };
        return TileConfigExtendComponentController;
    }());
    var pipTileConfigComponent = {
        templateUrl: 'config_tile_dialog/ConfigDialogExtendComponent.html',
        controller: TileConfigExtendComponentController,
        bindings: TileConfigExtendComponentBindings
    };
    angular
        .module('pipConfigDashboardTileDialog')
        .component('pipTileConfigExtendComponent', pipTileConfigComponent);
}
},{}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ConfigDialogController_1 = require("./ConfigDialogController");
{
    var setTranslations = function ($injector) {
        var pipTranslate = $injector.has('pipTranslateProvider') ? $injector.get('pipTranslateProvider') : null;
        if (pipTranslate) {
            pipTranslate.setTranslations('en', {
                DASHBOARD_TILE_CONFIG_DIALOG_TITLE: 'Edit tile',
                DASHBOARD_TILE_CONFIG_DIALOG_SIZE_SMALL: 'Small',
                DASHBOARD_TILE_CONFIG_DIALOG_SIZE_WIDE: 'Wide',
                DASHBOARD_TILE_CONFIG_DIALOG_SIZE_LARGE: 'Large'
            });
            pipTranslate.setTranslations('ru', {
                DASHBOARD_TILE_CONFIG_DIALOG_TITLE: 'Изменить виджет',
                DASHBOARD_TILE_CONFIG_DIALOG_SIZE_SMALL: 'Мален.',
                DASHBOARD_TILE_CONFIG_DIALOG_SIZE_WIDE: 'Широкий',
                DASHBOARD_TILE_CONFIG_DIALOG_SIZE_LARGE: 'Большой'
            });
        }
    };
    setTranslations.$inject = ['$injector'];
    var TileConfigDialogService = (function () {
        TileConfigDialogService.$inject = ['$mdDialog'];
        function TileConfigDialogService($mdDialog) {
            this.$mdDialog = $mdDialog;
        }
        TileConfigDialogService.prototype.show = function (params, successCallback, cancelCallback) {
            this.$mdDialog.show({
                targetEvent: params.event,
                templateUrl: params.templateUrl || 'config_tile_dialog/ConfigDialog.html',
                controller: ConfigDialogController_1.TileConfigDialogController,
                bindToController: true,
                controllerAs: 'vm',
                locals: {
                    extensionUrl: params.extensionUrl,
                    params: params.locals
                },
                clickOutsideToClose: true
            })
                .then(function (key) {
                if (successCallback) {
                    successCallback(key);
                }
            }, function () {
                if (cancelCallback) {
                    cancelCallback();
                }
            });
        };
        return TileConfigDialogService;
    }());
    angular
        .module('pipConfigDashboardTileDialog')
        .config(setTranslations)
        .service('pipTileConfigDialogService', TileConfigDialogService);
}
},{"./ConfigDialogController":6}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
angular
    .module('pipConfigDashboardTileDialog', ['ngMaterial']);
require("./ConfigDialogController");
require("./ConfigDialogService");
require("./ConfigDialogExtendComponent");
},{"./ConfigDialogController":6,"./ConfigDialogExtendComponent":7,"./ConfigDialogService":8}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
{
    var setTranslations = function ($injector) {
        var pipTranslate = $injector.has('pipTranslateProvider') ? $injector.get('pipTranslateProvider') : null;
        if (pipTranslate) {
            pipTranslate.setTranslations('en', {
                DROP_TO_CREATE_NEW_GROUP: 'Drop here to create new group',
            });
            pipTranslate.setTranslations('ru', {
                DROP_TO_CREATE_NEW_GROUP: 'Перетащите сюда для создания новой группы'
            });
        }
    };
    setTranslations.$inject = ['$injector'];
    var configureAvailableWidgets = function (pipAddTileDialogProvider) {
        pipAddTileDialogProvider.configTilesList([
            [{
                    title: 'Event',
                    icon: 'document',
                    name: 'event',
                    amount: 0
                },
                {
                    title: 'Position',
                    icon: 'location',
                    name: 'position',
                    amount: 0
                }
            ],
            [{
                    title: 'Calendar',
                    icon: 'date',
                    name: 'calendar',
                    amount: 0
                },
                {
                    title: 'Sticky Notes',
                    icon: 'note-take',
                    name: 'notes',
                    amount: 0
                },
                {
                    title: 'Statistics',
                    icon: 'tr-statistics',
                    name: 'statistics',
                    amount: 0
                }
            ]
        ]);
    };
    configureAvailableWidgets.$inject = ['pipAddTileDialogProvider'];
    var draggableOptions = (function () {
        function draggableOptions() {
        }
        return draggableOptions;
    }());
    var DEFAULT_GRID_OPTIONS_1 = {
        tileWidth: 150,
        tileHeight: 150,
        gutter: 10,
        inline: false
    };
    var DashboardController = (function () {
        function DashboardController($scope, $rootScope, $attrs, $element, $timeout, $interpolate, pipAddTileDialog, pipTileTemplate, pipDashboard) {
            var _this = this;
            this.$rootScope = $rootScope;
            this.$attrs = $attrs;
            this.$element = $element;
            this.$timeout = $timeout;
            this.$interpolate = $interpolate;
            this.pipAddTileDialog = pipAddTileDialog;
            this.pipTileTemplate = pipTileTemplate;
            this.pipDashboard = pipDashboard;
            this.defaultGroupMenuActions = [{
                    title: 'Add Component',
                    callback: function (groupIndex) {
                        _this.addComponent(groupIndex);
                    }
                },
                {
                    title: 'Remove',
                    callback: function (groupIndex) {
                        _this.removeGroup(groupIndex);
                    }
                },
                {
                    title: 'Configurate',
                    callback: function (groupIndex) {
                        console.log('configurate group with index:', groupIndex);
                    }
                }
            ];
            this._includeTpl = '<pip-{{ type }}-tile group="groupIndex" index="index"' +
                'pip-options="$parent.$ctrl.groupedWidgets[groupIndex][\'source\'][index].opts">' +
                '</pip-{{ type }}-tile>';
            this._dynamicTileTpl = '<pip-dynamic-tile controller="{{ ctrl }}"' +
                ' template="{{ tmpl }}" class="{{ class }}" controller-as="{{ ctrlAs }}" ' +
                'pip-options="$parent.$ctrl.groupedWidgets[groupIndex][\'source\'][index].opts"></pip-dynamic-tile>';
            this.groupMenuActions = this.defaultGroupMenuActions;
            this.removeGroup = function (groupIndex) {
                _this.groupedWidgets.splice(groupIndex, 1);
            };
            $element.addClass('pip-scroll');
            this.draggableGridOptions = this.gridOptions || DEFAULT_GRID_OPTIONS_1;
            if (this.draggableGridOptions.inline === true) {
                $element.addClass('inline-grid');
            }
            if (this.groupAdditionalActions)
                angular.extend(this.groupMenuActions, this.groupAdditionalActions);
            this.widgetsContext = $scope;
            this.compileWidgets();
            this.$timeout(function () {
                _this.$element.addClass('visible');
            }, 700);
        }
        DashboardController.prototype.compileWidgets = function () {
            var _this = this;
            _.each(this.groupedWidgets, function (group, groupIndex) {
                group.removedWidgets = group.removedWidgets || [],
                    group.source = group.source.map(function (widget, index) {
                        var type;
                        var specificType = false;
                        widget.size = widget.size || {
                            colSpan: 1,
                            rowSpan: 1
                        };
                        widget.index = index;
                        widget.groupIndex = groupIndex;
                        widget.menu = widget.menu || [];
                        if (type = _this.pipDashboard.getTypeByName(widget.type)) {
                            widget.ctrl = type.controller;
                            widget.tmpl = type.templateUrl || type.template;
                            widget.ctrlAs = type.controllerAs;
                            widget.class = type.class;
                            specificType = true;
                        }
                        angular.extend(widget.menu, [{
                                title: 'Remove',
                                click: function (item, params, object) {
                                    _this.removeWidget(item, params, object);
                                }
                            }]);
                        return {
                            opts: widget.opts || widget,
                            template: _this.pipTileTemplate.getTemplate(widget, _this._dynamicTileTpl)
                        };
                    });
            });
        };
        DashboardController.prototype.addComponent = function (groupIndex) {
            var _this = this;
            this.pipAddTileDialog
                .show(this.groupedWidgets, groupIndex)
                .then(function (data) {
                var activeGroup;
                if (!data) {
                    return;
                }
                if (data.groupIndex !== -1) {
                    activeGroup = _this.groupedWidgets[data.groupIndex];
                }
                else {
                    activeGroup = {
                        title: 'New group',
                        source: []
                    };
                }
                _this.addWidgets(activeGroup.source, data.widgets);
                if (data.groupIndex === -1) {
                    _this.groupedWidgets.push(activeGroup);
                }
                _this.compileWidgets();
            });
        };
        ;
        DashboardController.prototype.addWidgets = function (group, widgets) {
            widgets.forEach(function (widgetGroup) {
                widgetGroup.forEach(function (widget) {
                    if (widget.amount) {
                        Array.apply(null, Array(widget.amount)).forEach(function () {
                            group.push({
                                type: widget.name
                            });
                        });
                    }
                });
            });
        };
        DashboardController.prototype.removeWidget = function (item, params, object) {
            var _this = this;
            this.groupedWidgets[params.options.groupIndex].removedWidgets = [];
            this.groupedWidgets[params.options.groupIndex].removedWidgets.push(params.options.index);
            this.groupedWidgets[params.options.groupIndex].source.splice(params.options.index, 1);
            this.$timeout(function () {
                _this.groupedWidgets[params.options.groupIndex].removedWidgets = [];
            });
        };
        return DashboardController;
    }());
    var Dashboard = {
        bindings: {
            gridOptions: '=pipGridOptions',
            groupAdditionalActions: '=pipGroupActions',
            groupedWidgets: '=pipGroups'
        },
        controller: DashboardController,
        templateUrl: 'dashboard/Dashboard.html'
    };
    angular
        .module('pipDashboard')
        .config(configureAvailableWidgets)
        .config(setTranslations)
        .component('pipDashboard', Dashboard);
}
},{}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DraggableTileService_1 = require("./DraggableTileService");
var TileGroupService_1 = require("../tile_group/TileGroupService");
exports.DEFAULT_TILE_WIDTH = 150;
exports.DEFAULT_TILE_HEIGHT = 150;
exports.UPDATE_GROUPS_EVENT = "pipUpdateDashboardGroupsConfig";
var SIMPLE_LAYOUT_COLUMNS_COUNT = 2;
var DEFAULT_OPTIONS = {
    tileWidth: exports.DEFAULT_TILE_WIDTH,
    tileHeight: exports.DEFAULT_TILE_HEIGHT,
    gutter: 0,
    container: 'pip-draggable-grid:first-of-type',
    activeDropzoneClass: 'dropzone-active',
    groupContaninerSelector: '.pip-draggable-group:not(.fict-group)',
};
{
    var DraggableController = (function () {
        function DraggableController($scope, $rootScope, $compile, $timeout, $element, pipDragTile, pipTilesGrid, pipMedia) {
            var _this = this;
            this.$scope = $scope;
            this.$rootScope = $rootScope;
            this.$compile = $compile;
            this.$timeout = $timeout;
            this.$element = $element;
            this.sourceDropZoneElem = null;
            this.isSameDropzone = true;
            this.tileGroups = null;
            this.opts = _.merge({
                mobileBreakpoint: pipMedia.breakpoints.xs
            }, DEFAULT_OPTIONS, this.options);
            console.log('this.options', this.options);
            console.log('this.opts', this.opts);
            this.groups = this.tilesTemplates.map(function (group, groupIndex) {
                return {
                    title: group.title,
                    editingName: false,
                    index: groupIndex,
                    source: group.source.map(function (tile) {
                        var tileScope = _this.createTileScope(tile);
                        return DraggableTileService_1.IDragTileConstructor(DraggableTileService_1.DragTileService, {
                            tpl: $compile(tile.template)(tileScope),
                            options: tile.opts,
                            size: tile.opts.size
                        });
                    })
                };
            });
            $scope.$watch('$ctrl.tilesTemplates', function (newVal) {
                _this.watch(newVal);
            }, true);
            this.initialize();
            $(window).on('resize', _.debounce(function () {
                _this.availableWidth = _this.getContainerWidth();
                _this.availableColumns = _this.getAvailableColumns(_this.availableWidth);
                _this.tileGroups.forEach(function (group) {
                    group
                        .setAvailableColumns(_this.availableColumns)
                        .generateGrid(_this.getSingleTileWidthForMobile(_this.availableWidth))
                        .setTilesDimensions()
                        .calcContainerHeight();
                });
            }, 50));
            this.$rootScope.$on('draggable:start', function (data, event) {
                _this.onDragStartListener(event);
            });
            this.$rootScope.$on('draggable:move', function (data, event) {
                _this.onDragMoveListener(event);
            });
            this.$rootScope.$on('draggable:end', function (data, event) {
                _this.onDragEndListener();
            });
        }
        DraggableController.prototype.$postLink = function () {
            this.$container = this.$element;
        };
        DraggableController.prototype.watch = function (newVal) {
            var _this = this;
            var prevVal = this.groups;
            var changedGroupIndex = null;
            if (newVal.length > prevVal.length) {
                this.addGroup(newVal[newVal.length - 1]);
                return;
            }
            if (newVal.length < prevVal.length) {
                this.removeGroups(newVal);
                return;
            }
            for (var i = 0; i < newVal.length; i++) {
                var groupWidgetDiff = prevVal[i].source.length - newVal[i].source.length;
                if (groupWidgetDiff || (newVal[i].removedWidgets && newVal[i].removedWidgets.length > 0)) {
                    changedGroupIndex = i;
                    if (groupWidgetDiff < 0) {
                        var newTiles = newVal[changedGroupIndex].source.slice(groupWidgetDiff);
                        _.each(newTiles, function (tile) {
                            console.log('tile', tile);
                        });
                        this.addTilesIntoGroup(newTiles, this.tileGroups[changedGroupIndex], this.groupsContainers[changedGroupIndex]);
                        this.$timeout(function () {
                            _this.updateTilesGroups();
                        });
                    }
                    else {
                        this.removeTiles(this.tileGroups[changedGroupIndex], newVal[changedGroupIndex].removedWidgets, this.groupsContainers[changedGroupIndex]);
                        this.updateTilesOptions(newVal);
                        this.$timeout(function () {
                            _this.updateTilesGroups();
                        });
                    }
                    return;
                }
            }
            if (newVal && this.tileGroups) {
                this.updateTilesOptions(newVal);
                this.$timeout(function () {
                    _this.updateTilesGroups();
                });
            }
        };
        DraggableController.prototype.onTitleClick = function (group, event) {
            if (!group.editingName) {
                group.oldTitle = _.clone(group.title);
                group.editingName = true;
                this.$timeout(function () {
                    $(event.currentTarget.children[0]).focus();
                });
            }
        };
        DraggableController.prototype.cancelEditing = function (group) {
            group.title = group.oldTitle;
        };
        DraggableController.prototype.onBlurTitleInput = function (group) {
            var _this = this;
            this.$timeout(function () {
                group.editingName = false;
                _this.$rootScope.$broadcast(exports.UPDATE_GROUPS_EVENT, _this.groups);
                _this.tilesTemplates[group.index].title = group.title;
            }, 100);
        };
        DraggableController.prototype.onKyepressTitleInput = function (group, event) {
            if (event.keyCode === 13) {
                this.onBlurTitleInput(group);
            }
        };
        DraggableController.prototype.updateTilesTemplates = function (updateType, source) {
            switch (updateType) {
                case 'addGroup':
                    if (this.groups.length !== this.tilesTemplates.length) {
                        this.tilesTemplates.push(source);
                    }
                    break;
                case 'moveTile':
                    var _a = {
                        fromIndex: source.from.elem.attributes['data-group-id'].value,
                        toIndex: source.to.elem.attributes['data-group-id'].value,
                        tileOptions: source.tile.opts.options,
                        fromTileIndex: source.tile.opts.options.index
                    }, fromIndex = _a.fromIndex, toIndex = _a.toIndex, tileOptions = _a.tileOptions, fromTileIndex = _a.fromTileIndex;
                    this.tilesTemplates[fromIndex].source.splice(fromTileIndex, 1);
                    this.tilesTemplates[toIndex].source.push({
                        opts: tileOptions
                    });
                    this.reIndexTiles(source.from.elem);
                    this.reIndexTiles(source.to.elem);
                    break;
            }
        };
        DraggableController.prototype.createTileScope = function (tile) {
            var tileScope = this.$rootScope.$new(false, this.tilesContext);
            tileScope.index = tile.opts.index == undefined ? tile.opts.options.index : tile.opts.index;
            tileScope.groupIndex = tile.opts.groupIndex == undefined ? tile.opts.options.groupIndex : tile.opts.groupIndex;
            return tileScope;
        };
        DraggableController.prototype.removeTiles = function (group, indexes, container) {
            var tiles = $(container).find('.pip-draggable-tile');
            _.each(indexes, function (index) {
                group.tiles.splice(index, 1);
                tiles[index].remove();
            });
            this.reIndexTiles(container);
        };
        DraggableController.prototype.reIndexTiles = function (container, gIndex) {
            var tiles = $(container).find('.pip-draggable-tile'), groupIndex = gIndex === undefined ? container.attributes['data-group-id'].value : gIndex;
            _.each(tiles, function (tile, index) {
                var child = $(tile).children()[0];
                angular.element(child).scope()['index'] = index;
                angular.element(child).scope()['groupIndex'] = groupIndex;
            });
        };
        DraggableController.prototype.removeGroups = function (newGroups) {
            var _this = this;
            var removeIndexes = [], remain = [], containers = [];
            _.each(this.groups, function (group, index) {
                if (_.findIndex(newGroups, function (g) {
                    return g['title'] === group.title;
                }) < 0) {
                    removeIndexes.push(index);
                }
                else {
                    remain.push(index);
                }
            });
            _.each(removeIndexes.reverse(), function (index) {
                _this.groups.splice(index, 1);
                _this.tileGroups.splice(index, 1);
            });
            _.each(remain, function (index) {
                containers.push(_this.groupsContainers[index]);
            });
            this.groupsContainers = containers;
            _.each(this.groupsContainers, function (container, index) {
                _this.reIndexTiles(container, index);
            });
        };
        DraggableController.prototype.addGroup = function (sourceGroup, afterFict) {
            var _this = this;
            if (afterFict === void 0) { afterFict = false; }
            var group = {
                title: sourceGroup.title,
                source: sourceGroup.source.map(function (tile) {
                    var tileScope = _this.createTileScope(tile);
                    return DraggableTileService_1.IDragTileConstructor(DraggableTileService_1.DragTileService, {
                        tpl: _this.$compile(_this.wrapComponent(tile.template))(tileScope),
                        options: tile.opts,
                        size: tile.opts.size
                    });
                })
            };
            this.groups.push(group);
            if (afterFict && !this.$scope.$$phase)
                this.$scope.$apply();
            this.$timeout(function () {
                _this.groupsContainers = document.querySelectorAll(_this.opts.groupContaninerSelector);
                _this.tileGroups.push(TileGroupService_1.ITilesGridConstructor(TileGroupService_1.TilesGridService, group.source, _this.opts, _this.availableColumns, _this.groupsContainers[_this.groupsContainers.length - 1])
                    .generateGrid(_this.getSingleTileWidthForMobile(_this.availableWidth))
                    .setTilesDimensions()
                    .calcContainerHeight());
            });
            this.updateTilesTemplates('addGroup', sourceGroup);
        };
        DraggableController.prototype.wrapComponent = function (content) {
            return $('<div>')
                .addClass('pip-draggable-tile')
                .attr('pip-drag', 'true')
                .attr('pip-scroll-container', "'.pip-dashboard-scroll'")
                .append(content)
                .get(0);
        };
        DraggableController.prototype.addTilesIntoGroup = function (newTiles, group, groupContainer) {
            var _this = this;
            newTiles.forEach(function (tile) {
                var tileScope = _this.createTileScope(tile);
                var newTile = DraggableTileService_1.IDragTileConstructor(DraggableTileService_1.DragTileService, {
                    tpl: _this.$compile(_this.wrapComponent(tile.template))(tileScope),
                    options: tile.opts,
                    size: tile.opts.size
                });
                group.addTile(newTile);
                $(newTile.getCompiledTemplate())
                    .appendTo(groupContainer);
            });
        };
        DraggableController.prototype.updateTilesOptions = function (optionsGroup) {
            var _this = this;
            optionsGroup.forEach(function (optionGroup) {
                optionGroup.source.forEach(function (tileOptions) {
                    _this.tileGroups.forEach(function (group) {
                        group.updateTileOptions(tileOptions.opts);
                    });
                });
            });
        };
        DraggableController.prototype.initTilesGroups = function (tileGroups, opts, groupsContainers) {
            var _this = this;
            return tileGroups.map(function (group, index) {
                return TileGroupService_1.ITilesGridConstructor(TileGroupService_1.TilesGridService, group.source, opts, _this.availableColumns, groupsContainers[index])
                    .generateGrid(_this.getSingleTileWidthForMobile(_this.availableWidth))
                    .setTilesDimensions()
                    .calcContainerHeight();
            });
        };
        DraggableController.prototype.updateTilesGroups = function (onlyPosition, draggedTile) {
            var _this = this;
            this.tileGroups.forEach(function (group) {
                if (!onlyPosition) {
                    group.generateGrid(_this.getSingleTileWidthForMobile(_this.availableWidth));
                }
                group
                    .setTilesDimensions(onlyPosition, draggedTile)
                    .calcContainerHeight(_this.options.tileHeight);
            });
        };
        DraggableController.prototype.getContainerWidth = function () {
            var container = this.$container || $('body');
            return container.width();
        };
        DraggableController.prototype.getAvailableColumns = function (availableWidth) {
            return this.opts.mobileBreakpoint > availableWidth ? SIMPLE_LAYOUT_COLUMNS_COUNT :
                Math.floor(availableWidth / (this.opts.tileWidth + this.opts.gutter));
        };
        DraggableController.prototype.getActiveGroupAndTile = function (elem) {
            var active = {};
            this.tileGroups.forEach(function (group) {
                var foundTile = group.getTileByNode(elem);
                if (foundTile) {
                    active['group'] = group;
                    active['tile'] = foundTile;
                    return;
                }
            });
            return active;
        };
        DraggableController.prototype.getSingleTileWidthForMobile = function (availableWidth) {
            console.log('gut', this.opts.gutter);
            return this.opts.mobileBreakpoint > availableWidth ? availableWidth / 2 - this.opts.gutter : null;
        };
        DraggableController.prototype.onDragStartListener = function (event) {
            if (!event.x)
                return;
            console.log('drag start');
            event.target = event.element.get(0);
            var activeEntities = this.getActiveGroupAndTile(event.target);
            this.container = $(event.target).parent('.pip-draggable-group').get(0);
            this.sourceDropZoneElem = this.container;
            this.draggedTile = activeEntities['tile'];
            this.activeDraggedGroup = activeEntities['group'];
            console.log('activeDraggedGroup', this.activeDraggedGroup);
            this.$element.addClass('drag-transfer');
            this.draggedTile.startDrag();
        };
        DraggableController.prototype.onDragMoveListener = function (event) {
            var _this = this;
            var target = event.element.get(0);
            console.log('drag move');
            this.containerOffset = this.getContainerOffset();
            var belowElement = this.activeDraggedGroup.getTileByCoordinates({
                left: event.x - this.containerOffset.left,
                top: event.y - this.containerOffset.top
            }, this.draggedTile);
            if (belowElement) {
                var draggedTileIndex = this.activeDraggedGroup.getTileIndex(this.draggedTile);
                var belowElemIndex = this.activeDraggedGroup.getTileIndex(belowElement);
                if ((draggedTileIndex + 1) === belowElemIndex) {
                    return;
                }
                this.activeDraggedGroup
                    .swapTiles(this.draggedTile, belowElement)
                    .setTilesDimensions(true, this.draggedTile);
                this.$timeout(function () {
                    _this.setGroupContainersHeight();
                }, 0);
            }
        };
        DraggableController.prototype.onDragEndListener = function () {
            if (!this.draggedTile)
                return;
            console.log('drag end');
            this.draggedTile.stopDrag(false);
            this.$element.removeClass('drag-transfer');
        };
        DraggableController.prototype.getContainerOffset = function () {
            var containerRect = this.container.getBoundingClientRect();
            return {
                left: containerRect.left,
                top: containerRect.top
            };
        };
        DraggableController.prototype.setGroupContainersHeight = function () {
            this.tileGroups.forEach(function (tileGroup) {
                tileGroup.calcContainerHeight();
            });
        };
        DraggableController.prototype.moveTile = function (from, to, tile) {
            var elem;
            var movedTile = from.removeTile(tile);
            var tileScope = this.createTileScope(tile);
            $(this.groupsContainers[_.findIndex(this.tileGroups, from)])
                .find(movedTile.getElem())
                .remove();
            if (to !== null) {
                to.addTile(movedTile);
                elem = this.$compile(movedTile.getElem())(tileScope);
                $(this.groupsContainers[_.findIndex(this.tileGroups, to)])
                    .append(elem);
                this.$timeout(to.setTilesDimensions.bind(to, true));
            }
            this.updateTilesTemplates('moveTile', {
                from: from,
                to: to,
                tile: movedTile
            });
        };
        DraggableController.prototype.onDropListener = function (droppedGroupIndex, event) {
            if (!this.draggedTile)
                return;
            var droppedGroup = this.tileGroups[droppedGroupIndex];
            if (this.activeDraggedGroup !== droppedGroup) {
                this.moveTile(this.activeDraggedGroup, droppedGroup, this.draggedTile);
            }
            this.groupsContainers[droppedGroupIndex].classList.remove(this.opts.activeDropzoneClass);
            $('body').css('cursor', '');
            this.updateTilesGroups(true);
            this.sourceDropZoneElem = null;
            this.activeDraggedGroup = null;
            this.draggedTile = null;
        };
        DraggableController.prototype.onDropToFictGroupListener = function (event) {
            var _this = this;
            var from = this.activeDraggedGroup;
            var tile = this.draggedTile;
            this.addGroup({
                title: 'New group',
                source: []
            }, true);
            this.$timeout(function () {
                _this.moveTile(from, _this.tileGroups[_this.tileGroups.length - 1], tile);
                _this.updateTilesGroups(true);
            });
            $('body').css('cursor', '');
            this.sourceDropZoneElem = null;
            this.activeDraggedGroup = null;
            this.draggedTile = null;
        };
        DraggableController.prototype.onDropEnterListener = function (groupIndex, event) {
            if (!this.sourceDropZoneElem) {
                this.sourceDropZoneElem = this.groupsContainers[groupIndex];
            }
            console.log('sourceDropZoneElem', this.sourceDropZoneElem);
            if (groupIndex !== null && this.sourceDropZoneElem !== this.groupsContainers[groupIndex]) {
                this.groupsContainers[groupIndex].classList.add('dropzone-active');
                $('body').css('cursor', 'copy');
                this.isSameDropzone = false;
            }
            else {
                $('body').css('cursor', '');
                this.isSameDropzone = true;
            }
        };
        DraggableController.prototype.onDropDeactivateListener = function (groupIndex, event) {
            if (this.sourceDropZoneElem !== event.target && groupIndex !== null) {
                this.groupsContainers[groupIndex].classList.remove(this.opts.activeDropzoneClass);
                $('body').css('cursor', '');
            }
        };
        DraggableController.prototype.onDropLeaveListener = function (groupIndex, event) {
            if (groupIndex !== null)
                this.groupsContainers[groupIndex].classList.remove(this.opts.activeDropzoneClass);
        };
        DraggableController.prototype.initialize = function () {
            var _this = this;
            this.$timeout(function () {
                _this.availableWidth = _this.getContainerWidth();
                _this.availableColumns = _this.getAvailableColumns(_this.availableWidth);
                _this.groupsContainers = document.querySelectorAll(_this.opts.groupContaninerSelector);
                _this.tileGroups = _this.initTilesGroups(_this.groups, _this.opts, _this.groupsContainers);
            }, 0);
        };
        return DraggableController;
    }());
    var DragComponent = {
        bindings: {
            tilesTemplates: '=pipTilesTemplates',
            tilesContext: '=pipTilesContext',
            options: '=pipDraggableGrid',
            groupMenuActions: '=pipGroupMenuActions'
        },
        templateUrl: 'draggable/Draggable.html',
        controller: DraggableController
    };
    angular.module('pipDraggableTiles')
        .component('pipDraggableGrid', DragComponent);
}
},{"../tile_group/TileGroupService":23,"./DraggableTileService":12}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function IDragTileConstructor(constructor, options) {
    return new constructor(options);
}
exports.IDragTileConstructor = IDragTileConstructor;
var DEFAULT_TILE_SIZE = {
    colSpan: 1,
    rowSpan: 1
};
var DragTileService = (function () {
    function DragTileService(options) {
        this.tpl = options.tpl.get(0);
        this.opts = options;
        this.size = _.merge({}, DEFAULT_TILE_SIZE, options.size);
        this.elem = null;
    }
    DragTileService.prototype.getSize = function () {
        return this.size;
    };
    DragTileService.prototype.setSize = function (width, height) {
        this.size.width = width;
        this.size.height = height;
        if (this.elem) {
            this.elem.css({
                width: width,
                height: height
            });
        }
        return this;
    };
    DragTileService.prototype.setPosition = function (left, top) {
        this.size.left = left;
        this.size.top = top;
        if (this.elem) {
            this.elem.css({
                left: left,
                top: top
            });
        }
        return this;
    };
    DragTileService.prototype.getCompiledTemplate = function () {
        return this.tpl;
    };
    ;
    DragTileService.prototype.updateElem = function (parent) {
        this.elem = $(this.tpl).parent(parent);
        return this;
    };
    ;
    DragTileService.prototype.getElem = function () {
        return this.elem.get(0);
    };
    ;
    DragTileService.prototype.startDrag = function () {
        this.preview = $('<div>')
            .addClass('pip-dragged-preview')
            .css({
            position: 'absolute',
            left: this.elem.css('left'),
            top: this.elem.css('top'),
            width: this.elem.css('width'),
            height: this.elem.css('height')
        });
        this.elem
            .addClass('no-animation')
            .css({
            zIndex: '9999'
        })
            .after(this.preview);
        return this;
    };
    ;
    DragTileService.prototype.stopDrag = function (isAnimate) {
        if (!this.preview)
            return;
        var self = this;
        if (isAnimate) {
            self.elem
                .removeClass('no-animation')
                .css({
                left: self.preview.css('left'),
                top: self.preview.css('top')
            })
                .on('transitionend', function () { onTransitionEnd(); });
        }
        else {
            self.elem
                .css({
                left: self.preview.css('left'),
                top: self.preview.css('top'),
                zIndex: ''
            })
                .removeClass('no-animation');
            self.preview.remove();
            self.preview = null;
        }
        return this;
        function onTransitionEnd() {
            if (self.preview) {
                self.preview.remove();
                self.preview = null;
            }
            if (!self.elem)
                return;
            self.elem
                .css('zIndex', '')
                .off('transitionend', onTransitionEnd);
        }
    };
    ;
    DragTileService.prototype.setPreviewPosition = function (coords) {
        this.preview.css(coords);
    };
    ;
    DragTileService.prototype.getOptions = function () {
        return this.opts.options;
    };
    ;
    DragTileService.prototype.setOptions = function (options) {
        _.merge(this.opts.options, options);
        _.merge(this.size, options.size);
        return this;
    };
    ;
    return DragTileService;
}());
exports.DragTileService = DragTileService;
angular
    .module('pipDraggableTiles')
    .service('pipDragTile', function () {
    return function (options) {
        var newTile = new DragTileService(options);
        return newTile;
    };
});
},{}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
angular.module('pipDraggableTiles', []);
require("./DraggableTileService");
require("./Draggable");
},{"./Draggable":11,"./DraggableTileService":12}],14:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var DashboardTile_1 = require("../common_tile/DashboardTile");
{
    var EventTileController = (function (_super) {
        __extends(EventTileController, _super);
        function EventTileController($scope, $element, $timeout, pipTileConfigDialogService) {
            var _this = _super.call(this) || this;
            _this.$element = $element;
            _this.$timeout = $timeout;
            _this.pipTileConfigDialogService = pipTileConfigDialogService;
            _this.opacity = 0.57;
            _this.options.menu.push({
                title: 'Configurate',
                action: function () {
                    _this.onConfigClick();
                }
            });
            _this.color = _this.options.color || 'gray';
            _this.opacity = _this.options.opacity || _this.opacity;
            _this.drawImage();
            $scope.$watch(function () {
                return $element.is(':visible');
            }, function (newVal) {
                _this.drawImage();
            });
            return _this;
        }
        EventTileController.prototype.drawImage = function () {
            var _this = this;
            if (this.options.image) {
                this.$timeout(function () {
                    _this.onImageLoad(_this.$element.find('img'));
                }, 500);
            }
        };
        EventTileController.prototype.onConfigClick = function () {
            var _this = this;
            this._oldOpacity = _.clone(this.opacity);
            this.pipTileConfigDialogService.show({
                dialogClass: 'pip-calendar-config',
                locals: {
                    color: this.color,
                    size: this.options.size || {
                        colSpan: 1,
                        rowSpan: 1
                    },
                    date: this.options.date,
                    title: this.options.title,
                    text: this.options.text,
                    opacity: this.opacity,
                    onOpacitytest: function (opacity) {
                        _this.opacity = opacity;
                    }
                },
                extensionUrl: 'event_tile/ConfigDialogExtension.html'
            }, function (result) {
                _this.changeSize(result.size);
                _this.color = result.color;
                _this.options.color = result.color;
                _this.options.date = result.date;
                _this.options.title = result.title;
                _this.options.text = result.text;
                _this.options.opacity = result.opacity;
            }, function () {
                _this.opacity = _this._oldOpacity;
            });
        };
        EventTileController.prototype.onImageLoad = function (image) {
            this.setImageMarginCSS(this.$element.parent(), image);
        };
        EventTileController.prototype.changeSize = function (params) {
            var _this = this;
            this.options.size.colSpan = params.sizeX;
            this.options.size.rowSpan = params.sizeY;
            if (this.options.image) {
                this.$timeout(function () {
                    _this.setImageMarginCSS(_this.$element.parent(), _this.$element.find('img'));
                }, 500);
            }
        };
        EventTileController.prototype.setImageMarginCSS = function ($element, image) {
            var containerWidth = $element.width ? $element.width() : $element.clientWidth, containerHeight = $element.height ? $element.height() : $element.clientHeight, imageWidth = image[0].naturalWidth || image.width, imageHeight = image[0].naturalHeight || image.height, margin = 0, cssParams = {};
            if ((imageWidth / containerWidth) > (imageHeight / containerHeight)) {
                margin = -((imageWidth / imageHeight * containerHeight - containerWidth) / 2);
                cssParams['margin-left'] = '' + margin + 'px';
                cssParams['height'] = '' + containerHeight + 'px';
                cssParams['width'] = '' + imageWidth * containerHeight / imageHeight + 'px';
                cssParams['margin-top'] = '';
            }
            else {
                margin = -((imageHeight / imageWidth * containerWidth - containerHeight) / 2);
                cssParams['margin-top'] = '' + margin + 'px';
                cssParams['height'] = '' + imageHeight * containerWidth / imageWidth + 'px';
                cssParams['width'] = '' + containerWidth + 'px';
                cssParams['margin-left'] = '';
            }
            image.css(cssParams);
        };
        return EventTileController;
    }(DashboardTile_1.DashboardTile));
    var EventTile_1 = {
        name: 'event',
        controllerAs: '$ctrl',
        class: 'pip-event-tile',
        controller: EventTileController,
        templateUrl: 'event_tile/EventTile.html'
    };
    var config = function (pipDashboardProvider) {
        pipDashboardProvider.registerTileType(EventTile_1);
    };
    config.$inject = ['pipDashboardProvider'];
    angular
        .module('pipDashboard')
        .config(config);
}
},{"../common_tile/DashboardTile":4}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./tile_group/index");
require("./draggable");
require("./menu_tile");
require("./add_tile_dialog");
require("./config_tile_dialog");
angular.module('pipDashboard', [
    'pipDraggableTiles',
    'pipDraggableTilesGroup',
    'pipMenuTile',
    'pipConfigDashboardTileDialog',
    'pipAddDashboardTileDialog',
    'pipDashboard.Templates',
    'pipLayout',
    'pipLocations',
    'pipDate',
    'pipCharts',
    'pipTranslate',
    'pipControls',
    'pipButtons',
    'pipBehaviors'
]);
require("./utility/TileTemplateUtility");
require("./utility/DashboardService");
require("./common_tile/DashboardTile");
require("./common_tile/DynamicTile");
require("./event_tile/EventTile");
require("./note_tile/NoteTile");
require("./picture_slider_tile/PictureSliderTile");
require("./position_tile/PositionTile");
require("./statistics_tile/StatisticsTile");
require("./dashboard/Dashboard");
},{"./add_tile_dialog":3,"./common_tile/DashboardTile":4,"./common_tile/DynamicTile":5,"./config_tile_dialog":9,"./dashboard/Dashboard":10,"./draggable":13,"./event_tile/EventTile":14,"./menu_tile":17,"./note_tile/NoteTile":18,"./picture_slider_tile/PictureSliderTile":19,"./position_tile/PositionTile":20,"./statistics_tile/StatisticsTile":21,"./tile_group/index":24,"./utility/DashboardService":25,"./utility/TileTemplateUtility":26}],16:[function(require,module,exports){
{
    var TileMenu = {
        templateUrl: 'menu_tile/MenuTile.html',
        bindings: {
            menu: '<pipMenu'
        }
    };
    angular
        .module('pipMenuTile')
        .component('pipTileMenu', TileMenu);
}
},{}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
angular
    .module('pipMenuTile', []);
require("./MenuTileDirective");
},{"./MenuTileDirective":16}],18:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var DashboardTile_1 = require("../common_tile/DashboardTile");
{
    var NoteTileController = (function (_super) {
        __extends(NoteTileController, _super);
        function NoteTileController(pipTileConfigDialogService, $scope) {
            var _this = _super.call(this) || this;
            _this.pipTileConfigDialogService = pipTileConfigDialogService;
            _this.options.menu.push({
                title: 'Configurate',
                action: function () {
                    _this.onConfigClick();
                }
            });
            _this.color = _this.options.color || 'orange';
            return _this;
        }
        NoteTileController.prototype.onConfigClick = function () {
            var _this = this;
            this.pipTileConfigDialogService.show({
                locals: {
                    color: this.color,
                    size: this.options.size,
                    title: this.options.title,
                    text: this.options.text,
                },
                extensionUrl: 'note_tile/ConfigDialogExtension.html'
            }, function (result) {
                _this.color = result.color;
                _this.options.color = result.color;
                _this.changeSize(result.size);
                _this.options.text = result.text;
                _this.options.title = result.title;
            });
        };
        return NoteTileController;
    }(DashboardTile_1.DashboardTile));
    var NoteTile_1 = {
        name: 'note',
        controller: NoteTileController,
        controllerAs: '$ctrl',
        class: 'pip-notes-tile',
        templateUrl: 'note_tile/NoteTile.html'
    };
    var config = function (pipDashboardProvider) {
        pipDashboardProvider.registerTileType(NoteTile_1);
    };
    config.$inject = ['pipDashboardProvider'];
    angular
        .module('pipDashboard')
        .config(config);
}
},{"../common_tile/DashboardTile":4}],19:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var DashboardTile_1 = require("../common_tile/DashboardTile");
{
    var PictureSliderController = (function (_super) {
        __extends(PictureSliderController, _super);
        function PictureSliderController($scope, $element, $timeout, pipTileTemplate) {
            var _this = _super.call(this) || this;
            _this.$scope = $scope;
            _this.$element = $element;
            _this.$timeout = $timeout;
            _this.pipTileTemplate = pipTileTemplate;
            _this.animationType = 'fading';
            _this.animationInterval = 5000;
            if (_this.options) {
                _this.animationType = _this.options.animationType || _this.animationType;
                _this.animationInterval = _this.options.animationInterval || _this.animationInterval;
            }
            return _this;
        }
        PictureSliderController.prototype.onImageLoad = function ($event) {
            var _this = this;
            this.$timeout(function () {
                _this.pipTileTemplate.setImageMarginCSS(_this.$element.parent(), $event.target);
            });
        };
        PictureSliderController.prototype.changeSize = function (params) {
            var _this = this;
            this.options.size.colSpan = params.sizeX;
            this.options.size.rowSpan = params.sizeY;
            this.$timeout(function () {
                _.each(_this.$element.find('img'), function (image) {
                    _this.pipTileTemplate.setImageMarginCSS(_this.$element.parent(), image);
                });
            }, 500);
        };
        return PictureSliderController;
    }(DashboardTile_1.DashboardTile));
    var PictureSliderTile_1 = {
        name: 'picture-slider',
        controller: PictureSliderController,
        controllerAs: '$ctrl',
        class: 'pip-picture-slider-tile',
        templateUrl: 'picture_slider_tile/PictureSliderTile.html'
    };
    var config = function (pipDashboardProvider) {
        pipDashboardProvider.registerTileType(PictureSliderTile_1);
    };
    config.$inject = ['pipDashboardProvider'];
    angular
        .module('pipDashboard')
        .config(config);
}
},{"../common_tile/DashboardTile":4}],20:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var DashboardTile_1 = require("../common_tile/DashboardTile");
{
    var PositionTileController = (function (_super) {
        __extends(PositionTileController, _super);
        function PositionTileController($scope, $timeout, $element, pipTileConfigDialogService, pipLocationEditDialog) {
            var _this = _super.call(this) || this;
            _this.$timeout = $timeout;
            _this.$element = $element;
            _this.pipTileConfigDialogService = pipTileConfigDialogService;
            _this.pipLocationEditDialog = pipLocationEditDialog;
            _this.showPosition = true;
            _this.options.menu.push({
                title: 'Configurate',
                action: function () {
                    _this.onConfigClick();
                }
            });
            _this.options.menu.push({
                title: 'Change location',
                action: function () {
                    _this.openLocationEditDialog();
                }
            });
            _this.options.location = _this.options.location || _this.options.position;
            $scope.$watch('$ctrl.options.location', function () {
                _this.reDrawPosition();
            });
            $scope.$watch(function () {
                return $element.is(':visible');
            }, function (newVal) {
                if (newVal == true)
                    _this.reDrawPosition();
            });
            return _this;
        }
        PositionTileController.prototype.onConfigClick = function () {
            var _this = this;
            this.pipTileConfigDialogService.show({
                dialogClass: 'pip-position-config',
                locals: {
                    size: this.options.size,
                    locationName: this.options.locationName,
                    hideColors: true,
                },
                extensionUrl: 'position_tile/ConfigDialogExtension.html'
            }, function (result) {
                _this.changeSize(result.size);
                _this.options.locationName = result.locationName;
            });
        };
        PositionTileController.prototype.changeSize = function (params) {
            this.options.size.colSpan = params.sizeX;
            this.options.size.rowSpan = params.sizeY;
            this.reDrawPosition();
        };
        PositionTileController.prototype.openLocationEditDialog = function () {
            var _this = this;
            this.pipLocationEditDialog.show({
                locationName: this.options.locationName,
                locationPos: this.options.location
            }, function (newPosition) {
                if (newPosition) {
                    _this.options.location = newPosition.location;
                    _this.options.locationName = newPosition.locatioName;
                }
            });
        };
        PositionTileController.prototype.reDrawPosition = function () {
            var _this = this;
            this.showPosition = false;
            this.$timeout(function () {
                _this.showPosition = true;
            }, 50);
        };
        return PositionTileController;
    }(DashboardTile_1.DashboardTile));
    var PositionTile_1 = {
        name: 'position',
        class: 'pip-position-tile',
        controllerAs: '$ctrl',
        controller: PositionTileController,
        templateUrl: 'position_tile/PositionTile.html'
    };
    var config = function (pipDashboardProvider) {
        pipDashboardProvider.registerTileType(PositionTile_1);
    };
    config.$inject = ['pipDashboardProvider'];
    angular
        .module('pipDashboard')
        .config(config);
}
},{"../common_tile/DashboardTile":4}],21:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var DashboardTile_1 = require("../common_tile/DashboardTile");
{
    var SMALL_CHART_1 = 70;
    var BIG_CHART_1 = 250;
    var StatisticsTileController = (function (_super) {
        __extends(StatisticsTileController, _super);
        function StatisticsTileController($scope, $timeout) {
            var _this = _super.call(this) || this;
            _this.reset = false;
            _this.chartSize = SMALL_CHART_1;
            _this._$scope = $scope;
            _this._$timeout = $timeout;
            if (_this.options) {
                _this.menu = _this.options.menu ? _.union(_this.menu, _this.options.menu) : _this.menu;
            }
            _this.setChartSize();
            return _this;
        }
        StatisticsTileController.prototype.changeSize = function (params) {
            var _this = this;
            this.options.size.colSpan = params.sizeX;
            this.options.size.rowSpan = params.sizeY;
            this.reset = true;
            this.setChartSize();
            this._$timeout(function () {
                _this.reset = false;
            }, 500);
        };
        StatisticsTileController.prototype.setChartSize = function () {
            this.chartSize = this.options.size.colSpan == 2 && this.options.size.rowSpan == 2 ? BIG_CHART_1 : SMALL_CHART_1;
        };
        return StatisticsTileController;
    }(DashboardTile_1.DashboardTile));
    var StatisticsTile_1 = {
        name: 'statistics',
        class: 'pip-statistics-tile',
        controllerAs: '$ctrl',
        controller: StatisticsTileController,
        templateUrl: 'statistics_tile/StatisticsTile.html'
    };
    var config = function (pipDashboardProvider) {
        pipDashboardProvider.registerTileType(StatisticsTile_1);
    };
    config.$inject = ['pipDashboardProvider'];
    angular
        .module('pipDashboard')
        .config(config);
}
},{"../common_tile/DashboardTile":4}],22:[function(require,module,exports){
{
    DraggableTiles.$inject = ['$compile'];
    function DraggableTileLink($scope, $elem, $attr, $compile) {
        var docFrag = document.createDocumentFragment(), group = $scope.$eval($attr.pipDraggableTiles);
        group.forEach(function (tile) {
            var tpl = wrapComponent(tile.getCompiledTemplate());
            docFrag.appendChild(tpl);
        });
        $elem.append(docFrag);
        function wrapComponent(elem) {
            return $compile($('<div>')
                .addClass('pip-draggable-tile')
                .attr('pip-drag', 'true')
                .attr('pip-scroll-container', "'.pip-dashboard-scroll'")
                .get(0))($scope).append(elem).get(0);
        }
    }
    function DraggableTiles($compile) {
        return {
            restrict: 'A',
            link: function ($scope, $elem, $attr) {
                new DraggableTileLink($scope, $elem, $attr, $compile);
            }
        };
    }
    angular
        .module('pipDraggableTilesGroup')
        .directive('pipDraggableTiles', DraggableTiles);
}
},{}],23:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function ITilesGridConstructor(constructor, tiles, options, columns, elem) {
    return new constructor(tiles, options, columns, elem);
}
exports.ITilesGridConstructor = ITilesGridConstructor;
var MOBILE_LAYOUT_COLUMNS = 2;
var TilesGridService = (function () {
    function TilesGridService(tiles, options, columns, elem) {
        this.gridCells = [];
        this.inline = false;
        this.tiles = tiles;
        this.opts = options;
        this.columns = columns || 0;
        this.elem = elem;
        this.gridCells = [];
        this.inline = options.inline || false;
        this.isMobileLayout = columns === MOBILE_LAYOUT_COLUMNS;
    }
    TilesGridService.prototype.addTile = function (tile) {
        this.tiles.push(tile);
        if (this.tiles.length === 1) {
            this.generateGrid();
        }
        return this;
    };
    ;
    TilesGridService.prototype.getCellByPosition = function (row, col) {
        return this.gridCells[row][col];
    };
    ;
    TilesGridService.prototype.getCells = function (prevCell, rowSpan, colSpan) {
        console.log('prevCell', prevCell);
        if (this.isMobileLayout) {
            return this.getAvailableCellsMobile(prevCell, rowSpan, colSpan);
        }
        else {
            return this.getAvailableCellsDesktop(prevCell, rowSpan, colSpan);
        }
    };
    ;
    TilesGridService.prototype.getAvailableCellsDesktop = function (prevCell, rowSpan, colSpan) {
        var leftCornerCell;
        var rightCornerCell;
        var basicCol = prevCell && prevCell.col || 0;
        var basicRow = this.getBasicRow(prevCell);
        if (colSpan === 1 && rowSpan === 1) {
            var gridCopy = this.gridCells.slice();
            if (!prevCell) {
                leftCornerCell = gridCopy[0][0];
            }
            else {
                leftCornerCell = this.getCell(gridCopy, basicRow, basicCol, this.columns);
                if (!leftCornerCell) {
                    var rowShift = this.isMobileLayout ? 1 : 2;
                    leftCornerCell = this.getCell(gridCopy, basicRow + rowShift, 0, this.columns);
                }
            }
        }
        if (colSpan === 2 && rowSpan === 1) {
            var prevTileSize = prevCell && prevCell.elem.size || null;
            if (!prevTileSize) {
                leftCornerCell = this.getCellByPosition(basicRow, basicCol);
                rightCornerCell = this.getCellByPosition(basicRow, basicCol + 1);
            }
            else if (prevTileSize.colSpan === 2 && prevTileSize.rowSpan === 2) {
                if (this.columns - basicCol - 2 > 0) {
                    leftCornerCell = this.getCellByPosition(basicRow, basicCol + 1);
                    rightCornerCell = this.getCellByPosition(basicRow, basicCol + 2);
                }
                else {
                    leftCornerCell = this.getCellByPosition(basicRow + 2, 0);
                    rightCornerCell = this.getCellByPosition(basicRow + 2, 1);
                }
            }
            else if (prevTileSize.colSpan === 2 && prevTileSize.rowSpan === 1) {
                if (prevCell.row % 2 === 0) {
                    leftCornerCell = this.getCellByPosition(basicRow + 1, basicCol - 1);
                    rightCornerCell = this.getCellByPosition(basicRow + 1, basicCol);
                }
                else {
                    if (this.columns - basicCol - 3 >= 0) {
                        leftCornerCell = this.getCellByPosition(basicRow, basicCol + 1);
                        rightCornerCell = this.getCellByPosition(basicRow, basicCol + 2);
                    }
                    else {
                        leftCornerCell = this.getCellByPosition(basicRow + 2, 0);
                        rightCornerCell = this.getCellByPosition(basicRow + 2, 1);
                    }
                }
            }
            else if (prevTileSize.colSpan === 1 && prevTileSize.rowSpan === 1) {
                if (this.columns - basicCol - 3 >= 0) {
                    if (this.isCellFree(basicRow, basicCol + 1)) {
                        leftCornerCell = this.getCellByPosition(basicRow, basicCol + 1);
                        rightCornerCell = this.getCellByPosition(basicRow, basicCol + 2);
                    }
                    else {
                        leftCornerCell = this.getCellByPosition(basicRow, basicCol + 2);
                        rightCornerCell = this.getCellByPosition(basicRow, basicCol + 3);
                    }
                }
                else {
                    leftCornerCell = this.getCellByPosition(basicRow + 2, 0);
                    rightCornerCell = this.getCellByPosition(basicRow + 2, 1);
                }
            }
        }
        if (!prevCell && rowSpan === 2 && colSpan === 2) {
            leftCornerCell = this.getCellByPosition(basicRow, basicCol);
            rightCornerCell = this.getCellByPosition(basicRow + 1, basicCol + 1);
        }
        else if (rowSpan === 2 && colSpan === 2) {
            if (this.columns - basicCol - 2 > 0) {
                if (this.isCellFree(basicRow, basicCol + 1)) {
                    leftCornerCell = this.getCellByPosition(basicRow, basicCol + 1);
                    rightCornerCell = this.getCellByPosition(basicRow + 1, basicCol + 2);
                }
                else {
                    leftCornerCell = this.getCellByPosition(basicRow, basicCol + 2);
                    rightCornerCell = this.getCellByPosition(basicRow + 1, basicCol + 3);
                }
            }
            else {
                leftCornerCell = this.getCellByPosition(basicRow + 2, 0);
                rightCornerCell = this.getCellByPosition(basicRow + 3, 1);
            }
        }
        return {
            start: leftCornerCell,
            end: rightCornerCell
        };
    };
    ;
    TilesGridService.prototype.getCell = function (src, basicRow, basicCol, columns) {
        var cell, col, row;
        if (this.isMobileLayout) {
            for (col = basicCol; col < columns; col++) {
                if (!src[basicRow][col].elem) {
                    cell = src[basicRow][col];
                    break;
                }
            }
            return cell;
        }
        for (col = basicCol; col < columns; col++) {
            for (row = 0; row < 2; row++) {
                if (!src[row + basicRow][col].elem) {
                    cell = src[row + basicRow][col];
                    break;
                }
            }
            if (cell) {
                return cell;
            }
        }
    };
    ;
    TilesGridService.prototype.getAvailableCellsMobile = function (prevCell, rowSpan, colSpan) {
        var leftCornerCell;
        var rightCornerCell;
        var basicRow = this.getBasicRow(prevCell);
        var basicCol = prevCell && prevCell.col || 0;
        if (colSpan === 1 && rowSpan === 1) {
            var gridCopy = this.gridCells.slice();
            if (!prevCell) {
                leftCornerCell = gridCopy[0][0];
            }
            else {
                leftCornerCell = this.getCell(gridCopy, basicRow, basicCol, this.columns);
                if (!leftCornerCell) {
                    var rowShift = this.isMobileLayout ? 1 : 2;
                    leftCornerCell = this.getCell(gridCopy, basicRow + rowShift, 0, this.columns);
                }
            }
        }
        if (!prevCell) {
            leftCornerCell = this.getCellByPosition(basicRow, 0);
            rightCornerCell = this.getCellByPosition(basicRow + rowSpan - 1, 1);
        }
        else if (colSpan === 2) {
            leftCornerCell = this.getCellByPosition(basicRow + 1, 0);
            rightCornerCell = this.getCellByPosition(basicRow + rowSpan, 1);
        }
        return {
            start: leftCornerCell,
            end: rightCornerCell
        };
    };
    ;
    TilesGridService.prototype.getBasicRow = function (prevCell) {
        var basicRow;
        if (this.isMobileLayout) {
            if (prevCell) {
                basicRow = prevCell && prevCell.row || 0;
            }
            else {
                basicRow = 0;
            }
        }
        else {
            if (prevCell) {
                basicRow = prevCell.row % 2 === 0 ? prevCell.row : prevCell.row - 1;
            }
            else {
                basicRow = 0;
            }
        }
        return basicRow;
    };
    ;
    TilesGridService.prototype.isCellFree = function (row, col) {
        return !this.gridCells[row][col].elem;
    };
    ;
    TilesGridService.prototype.getCellIndex = function (srcCell) {
        var self = this;
        var index;
        this.gridCells.forEach(function (row, rowIndex) {
            index = _.findIndex(self.gridCells[rowIndex], function (cell) {
                return cell === srcCell;
            });
            if (index !== -1) {
                return;
            }
        });
        return index !== -1 ? index : 0;
    };
    ;
    TilesGridService.prototype.reserveCells = function (start, end, elem) {
        this.gridCells.forEach(function (row) {
            row.forEach(function (cell) {
                if (cell.row >= start.row && cell.row <= end.row &&
                    cell.col >= start.col && cell.col <= end.col) {
                    cell.elem = elem;
                }
            });
        });
    };
    ;
    TilesGridService.prototype.clearElements = function () {
        this.gridCells.forEach(function (row) {
            row.forEach(function (tile) {
                tile.elem = null;
            });
        });
    };
    ;
    TilesGridService.prototype.setAvailableColumns = function (columns) {
        this.isMobileLayout = columns === MOBILE_LAYOUT_COLUMNS;
        this.columns = columns;
        return this;
    };
    ;
    TilesGridService.prototype.generateGrid = function (singleTileWidth) {
        var self = this, tileWidth = singleTileWidth || this.opts.tileWidth, offset = document.querySelector('.pip-draggable-group-title').getBoundingClientRect();
        var colsInRow = 0, rows = 0, gridInRow = [];
        this.gridCells = [];
        this.tiles.forEach(function (tile, index, srcTiles) {
            var tileSize = tile.getSize();
            generateCells(tileSize.colSpan);
            if (srcTiles.length === index + 1) {
                if (colsInRow < self.columns) {
                    generateCells(self.columns - colsInRow);
                }
                if (self.tiles.length * 2 > self.gridCells.length) {
                    Array.apply(null, Array(self.tiles.length * 2 - self.gridCells.length)).forEach(function () {
                        generateCells(self.columns);
                    });
                }
            }
        });
        function generateCells(newCellCount) {
            Array.apply(null, Array(newCellCount)).forEach(function () {
                if (self.columns < colsInRow + 1) {
                    rows++;
                    colsInRow = 0;
                    self.gridCells.push(gridInRow);
                    gridInRow = [];
                }
                var top = rows * self.opts.tileHeight + (rows ? rows * self.opts.gutter : 0) + offset.height;
                var left = colsInRow * tileWidth + (colsInRow ? colsInRow * self.opts.gutter : 0);
                gridInRow.push({
                    top: top,
                    left: left,
                    bottom: top + self.opts.tileHeight,
                    right: left + tileWidth,
                    row: rows,
                    col: colsInRow
                });
                colsInRow++;
            });
        }
        return this;
    };
    ;
    TilesGridService.prototype.setTilesDimensions = function (onlyPosition, draggedTile) {
        var _this = this;
        var self = this;
        var currIndex = 0;
        var prevCell;
        if (onlyPosition) {
            self.clearElements();
        }
        this.tiles.forEach(function (tile) {
            var tileSize = tile.getSize();
            var startCell;
            var width;
            var height;
            var cells;
            tile.updateElem('.pip-draggable-tile');
            if (tileSize.colSpan === 1) {
                if (prevCell && prevCell.elem.size.colSpan === 2 && prevCell.elem.size.rowSpan === 1) {
                    startCell = self.getCells(self.getCellByPosition(prevCell.row, prevCell.col - 1), 1, 1).start;
                }
                else {
                    startCell = self.getCells(prevCell, 1, 1).start;
                }
                if (!onlyPosition) {
                    width = startCell.right - startCell.left;
                    height = startCell.bottom - startCell.top;
                }
                prevCell = startCell;
                self.reserveCells(startCell, startCell, tile);
                currIndex++;
            }
            else if (tileSize.colSpan === 2) {
                cells = self.getCells(prevCell, tileSize.rowSpan, tileSize.colSpan);
                startCell = cells.start;
                if (!onlyPosition) {
                    var gutter = _this.isMobileLayout ? _this.opts.gutter : 0;
                    width = cells.end.right - cells.start.left + gutter;
                    height = cells.end.bottom - cells.start.top;
                }
                prevCell = cells.end;
                self.reserveCells(cells.start, cells.end, tile);
                currIndex += 2;
            }
            if (draggedTile === tile) {
                tile.setPreviewPosition({
                    left: startCell.left,
                    top: startCell.top
                });
                return;
            }
            if (!onlyPosition) {
                tile.setSize(width, height);
            }
            tile.setPosition(startCell.left, startCell.top);
        });
        return this;
    };
    ;
    TilesGridService.prototype.calcContainerHeight = function (minHeight) {
        var maxHeightSize, maxWidthSize;
        if (!this.tiles.length) {
            if (minHeight) {
                this.elem.style.height = minHeight + 40 + 'px';
            }
            return this;
        }
        maxHeightSize = _.maxBy(this.tiles, function (tile) {
            var tileSize = tile['getSize']();
            return tileSize.top + tileSize.height;
        })['getSize']();
        this.elem.style.height = maxHeightSize.top + maxHeightSize.height + 'px';
        if (this.inline) {
            maxWidthSize = _.maxBy(this.tiles, function (tile) {
                var tileSize = tile['getSize']();
                return tileSize.left + tileSize.width;
            })['getSize']();
            this.elem.style.width = maxWidthSize.left + maxWidthSize.width + 'px';
        }
        return this;
    };
    ;
    TilesGridService.prototype.getTileByNode = function (node) {
        var foundTile = this.tiles.filter(function (tile) {
            return node === tile.getElem();
        });
        return foundTile.length ? foundTile[0] : null;
    };
    ;
    TilesGridService.prototype.getTileByCoordinates = function (coords, draggedTile) {
        return this.tiles
            .filter(function (tile) {
            var tileSize = tile.getSize();
            return tile !== draggedTile &&
                tileSize.left <= coords.left && coords.left <= (tileSize.left + tileSize.width) &&
                tileSize.top <= coords.top && coords.top <= (tileSize.top + tileSize.height);
        })[0] || null;
    };
    ;
    TilesGridService.prototype.getTileIndex = function (tile) {
        return _.findIndex(this.tiles, tile);
    };
    ;
    TilesGridService.prototype.swapTiles = function (movedTile, beforeTile) {
        var movedTileIndex = _.findIndex(this.tiles, movedTile);
        var beforeTileIndex = _.findIndex(this.tiles, beforeTile);
        this.tiles.splice(movedTileIndex, 1);
        this.tiles.splice(beforeTileIndex, 0, movedTile);
        return this;
    };
    ;
    TilesGridService.prototype.removeTile = function (removeTile) {
        var droppedTile;
        this.tiles.forEach(function (tile, index, tiles) {
            if (tile === removeTile) {
                droppedTile = tiles.splice(index, 1)[0];
                return false;
            }
        });
        return droppedTile;
    };
    ;
    TilesGridService.prototype.updateTileOptions = function (opts) {
        var index = _.findIndex(this.tiles, function (tile) {
            return tile['getOptions']() === opts;
        });
        if (index !== -1) {
            this.tiles[index].setOptions(opts);
            return true;
        }
        return false;
    };
    ;
    return TilesGridService;
}());
exports.TilesGridService = TilesGridService;
angular
    .module('pipDraggableTilesGroup')
    .service('pipTilesGrid', function () {
    return function (tiles, options, columns, elem) {
        var newGrid = new TilesGridService(tiles, options, columns, elem);
        return newGrid;
    };
});
},{}],24:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
angular
    .module('pipDraggableTilesGroup', []);
require("./TileGroupDirective");
require("./TileGroupService");
},{"./TileGroupDirective":22,"./TileGroupService":23}],25:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
{
    var DashboardProvider = (function () {
        function DashboardProvider() {
            this.tilesTypes = [];
        }
        DashboardProvider.prototype.registerTileType = function (newTileTypeOptions) {
            var newControllerName;
            var newTemplateUrl;
            if (typeof newTileTypeOptions.controller !== 'string') {
                newControllerName = 'pip' + newTileTypeOptions.name.substr(0, 1).toUpperCase() + newTileTypeOptions.name.substr(1) + 'Tile';
                angular.module('pipDashboard').controller(newControllerName, newTileTypeOptions.controller);
            }
            if (!newTileTypeOptions.templateUrl && newTileTypeOptions.template) {
                newTemplateUrl = 'pip' + newTileTypeOptions.name.substr(0, 1).toUpperCase() + newTileTypeOptions.name.substr(1) + 'Tile.html';
            }
            this.tilesTypes.push({
                name: newTileTypeOptions.name,
                controller: newControllerName || newTileTypeOptions.controller,
                templateUrl: newTemplateUrl || newTileTypeOptions.templateUrl,
                controllerAs: newTileTypeOptions.controllerAs,
                template: newTileTypeOptions.template,
                class: newTileTypeOptions.class
            });
        };
        DashboardProvider.prototype.$get = ['$templateCache', function ($templateCache) {
            "ngInject";
            if (this._service == null)
                this._service = new DashboardService_1(this.tilesTypes, $templateCache);
            return this._service;
        }];
        return DashboardProvider;
    }());
    var DashboardService_1 = (function () {
        function DashboardService_1(tileTypes, $templateCache) {
            this.tileTypes = tileTypes;
            this.$templateCache = $templateCache;
            this.putTemplates();
        }
        DashboardService_1.prototype.putTemplates = function () {
            var _this = this;
            _.each(this.tileTypes, function (type) {
                if (type.template)
                    _this.$templateCache.put(type.templateUrl, type.template);
            });
        };
        DashboardService_1.prototype.getTileTypes = function () {
            return this.tileTypes;
        };
        DashboardService_1.prototype.getTypeByName = function (name) {
            return _.find(this.tileTypes, function (type) {
                return type.name === name;
            });
        };
        return DashboardService_1;
    }());
    var config = function ($controllerProvider) {
        var app = angular.module('pipDashboard');
        app.controller = function (name, constructor) {
            $controllerProvider.register(name, constructor);
            return (this);
        };
    };
    config.$inject = ['$controllerProvider'];
    angular
        .module('pipDashboard')
        .config(config)
        .provider('pipDashboard', DashboardProvider);
}
},{}],26:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
{
    var tileTemplateService = (function () {
        tileTemplateService.$inject = ['$interpolate', '$compile', '$templateRequest'];
        function tileTemplateService($interpolate, $compile, $templateRequest) {
            this._$interpolate = $interpolate;
            this._$compile = $compile;
            this._$templateRequest = $templateRequest;
        }
        tileTemplateService.prototype.getTemplate = function (source, tpl, tileScope, strictCompile) {
            var _this = this;
            var template = source.template, templateUrl = source.templateUrl, type = source.type;
            var result;
            if (type) {
                var interpolated = tpl ? this._$interpolate(tpl)(source) : this._$interpolate(template)(source);
                return strictCompile == true ?
                    (tileScope ? this._$compile(interpolated)(tileScope) : this._$compile(interpolated)) :
                    interpolated;
            }
            if (template) {
                return tileScope ? this._$compile(template)(tileScope) : this._$compile(template);
            }
            if (templateUrl) {
                this._$templateRequest(templateUrl, false).then(function (html) {
                    result = tileScope ? _this._$compile(html)(tileScope) : _this._$compile(html);
                });
            }
            return result;
        };
        tileTemplateService.prototype.setImageMarginCSS = function ($element, image) {
            var containerWidth = $element.width ? $element.width() : $element.clientWidth, containerHeight = $element.height ? $element.height() : $element.clientHeight, imageWidth = (image[0] ? image[0].naturalWidth : image.naturalWidth) || image.width, imageHeight = (image[0] ? image[0].naturalHeight : image.naturalWidth) || image.height, margin = 0, cssParams = {};
            if ((imageWidth / containerWidth) > (imageHeight / containerHeight)) {
                margin = -((imageWidth / imageHeight * containerHeight - containerWidth) / 2);
                cssParams['margin-left'] = '' + margin + 'px';
                cssParams['height'] = '' + containerHeight + 'px';
                cssParams['width'] = '' + imageWidth * containerHeight / imageHeight + 'px';
                cssParams['margin-top'] = '';
            }
            else {
                margin = -((imageHeight / imageWidth * containerWidth - containerHeight) / 2);
                cssParams['margin-top'] = '' + margin + 'px';
                cssParams['height'] = '' + imageHeight * containerWidth / imageWidth + 'px';
                cssParams['width'] = '' + containerWidth + 'px';
                cssParams['margin-left'] = '';
            }
            $(image).css(cssParams);
        };
        return tileTemplateService;
    }());
    var ImageLoad = function ImageLoad($parse) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var callback = $parse(attrs.pipImageLoad);
                element.bind('load', function (event) {
                    callback(scope, {
                        $event: event
                    });
                });
            }
        };
    };
    ImageLoad.$inject = ['$parse'];
    angular
        .module('pipDashboard')
        .service('pipTileTemplate', tileTemplateService)
        .directive('pipImageLoad', ImageLoad);
}
},{}],27:[function(require,module,exports){
(function(module) {
try {
  module = angular.module('pipDashboard.Templates');
} catch (e) {
  module = angular.module('pipDashboard.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('add_tile_dialog/AddTile.html',
    '<md-dialog class="pip-dialog pip-add-component-dialog"><md-dialog-content class="layout-column"><div class="theme-divider p16 flex-auto"><h3 class="hide-xs m0 bm16 theme-text-primary" hide-xs="">{{ \'DASHBOARD_ADD_TILE_DIALOG_TITLE\' | translate }}<md-input-container class="layout-row flex-auto m0 tm16"><md-select class="flex-auto m0 theme-text-primary" ng-model="dialogCtrl.activeGroupIndex" placeholder="{{ \'DASHBOARD_ADD_TILE_DIALOG_CREATE_NEW_GROUP\' | translate }}" aria-label="Group"><md-option ng-value="$index" ng-repeat="group in dialogCtrl.groups">{{ group }}</md-option></md-select></md-input-container></h3></div><div class="pip-body pip-scroll p0 flex-auto"><p class="md-body-1 theme-text-secondary m0 lp16 rp16">{{ \'DASHBOARD_ADD_TILE_DIALOG_USE_HOT_KEYS\' | translate }}</p><md-list ng-init="groupIndex = $index" ng-repeat="group in dialogCtrl.defaultTiles"><md-list-item class="layout-row pip-list-item lp16 rp16" ng-repeat="item in group"><div class="icon-holder flex-none"><md-icon md-svg-icon="icons:{{:: item.icon }}"></md-icon><div class="pip-badge theme-badge md-warn" ng-if="item.amount"><span>{{ item.amount }}</span></div></div><span class="flex-auto lm24 theme-text-primary">{{:: item.title }}</span><md-button class="md-icon-button flex-none" ng-click="dialogCtrl.encrease(groupIndex, $index)" aria-label="Encrease"><md-icon md-svg-icon="icons:plus-circle"></md-icon></md-button><md-button class="md-icon-button flex-none" ng-click="dialogCtrl.decrease(groupIndex, $index)" aria-label="Decrease"><md-icon md-svg-icon="icons:minus-circle"></md-icon></md-button></md-list-item><md-divider class="lm72 tm8 bm8" ng-if="groupIndex !== (dialogCtrl.defaultTiles.length - 1)"></md-divider></md-list></div></md-dialog-content><md-dialog-actions class="flex-none layout-align-end-center theme-divider divider-top theme-text-primary"><md-button ng-click="dialogCtrl.cancel()" aria-label="Cancel">{{ \'CANCEL\' | translate }}</md-button><md-button ng-click="dialogCtrl.add()" ng-disabled="dialogCtrl.totalTiless === 0" arial-label="Add">{{ \'ADD\' | translate }}</md-button></md-dialog-actions></md-dialog>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipDashboard.Templates');
} catch (e) {
  module = angular.module('pipDashboard.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('common_tile/DynamicTile.html',
    '<pip-tile-menu pip-menu="$ctrl.options.menu" ng-if="!$ctrl.options.hideMenu"></pip-tile-menu><div class="pip-tile-content {{ $ctrl.color }} layout-column" ng-class="{ small: $ctrl.options.size.colSpan == 1 && $ctrl.options.size.rowSpan == 1, medium: $ctrl.options.size.colSpan == 2 && $ctrl.options.size.rowSpan == 1, big: $ctrl.options.size.colSpan == 2 && $ctrl.options.size.rowSpan == 2 }"><pip-specific-template></pip-specific-template></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipDashboard.Templates');
} catch (e) {
  module = angular.module('pipDashboard.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('config_tile_dialog/ConfigDialog.html',
    '<md-dialog class="pip-dialog pip-tile-config-dialog {{ vm.params.dialogClass }}" width="400" md-theme="{{vm.theme}}"><pip-tile-config-extend-component class="layout-column" pip-dialog-scope="vm" pip-extension-url="vm.extensionUrl" pip-apply="vm.onApply(updatedData)"></pip-tile-config-extend-component></md-dialog>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipDashboard.Templates');
} catch (e) {
  module = angular.module('pipDashboard.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('config_tile_dialog/ConfigDialogExtendComponent.html',
    '<h3 class="tm0 flex-none">{{ \'DASHBOARD_TILE_CONFIG_DIALOG_TITLE\' | translate }}</h3><div class="pip-body pip-scroll p16 bp0 flex-auto"><pip-extension-point></pip-extension-point><pip-toggle-buttons class="bm16" ng-if="!$ctrl.hideSizes" pip-buttons="$ctrl.sizes" ng-model="$ctrl.sizeId"></pip-toggle-buttons><pip-color-picker ng-if="!$ctrl.hideColors" pip-colors="$ctrl.colors" ng-model="$ctrl.color"></pip-color-picker></div><div class="pip-footer flex-none"><div><md-button class="md-accent" ng-click="$ctrl.onCancel()">{{ \'CANCEL\' | translate }}</md-button><md-button class="md-accent" ng-click="$ctrl.onApply()">{{ \'APPLY\' | translate }}</md-button></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipDashboard.Templates');
} catch (e) {
  module = angular.module('pipDashboard.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('dashboard/Dashboard.html',
    '<md-button class="md-accent md-raised md-fab layout-column layout-align-center-center" aria-label="Add component" ng-click="$ctrl.addComponent()"><md-icon md-svg-icon="icons:plus" class="md-headline centered-add-icon"></md-icon></md-button><div class="pip-draggable-grid-holder"><pip-draggable-grid pip-tiles-templates="$ctrl.groupedWidgets" pip-tiles-context="$ctrl.widgetsContext" pip-draggable-grid="$ctrl.draggableGridOptions" pip-group-menu-actions="$ctrl.groupMenuActions"></pip-draggable-grid><md-progress-circular md-mode="indeterminate" class="progress-ring"></md-progress-circular></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipDashboard.Templates');
} catch (e) {
  module = angular.module('pipDashboard.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('draggable/Draggable.html',
    '<div class="pip-draggable-holder"><div class="pip-draggable-group" pip-drop="true" pip-drop-success="$ctrl.onDropListener($index, $event)" pip-enter="$ctrl.onDropEnterListener($index, $event)" pip-leave="$ctrl.onDropLeaveListener($index, $event)" pip-deactive="$ctrl.onDropDeactivateListener($index, $event)" ng-repeat="group in $ctrl.groups" data-group-id="{{ $index }}" pip-draggable-tiles="group.source"><div class="pip-draggable-group-title layout-row layout-align-start-center"><div class="title-input-container" ng-click="$ctrl.onTitleClick(group, $event)"><input ng-if="group.editingName" ng-blur="$ctrl.onBlurTitleInput(group)" ng-keypress="$ctrl.onKyepressTitleInput(group, $event)" ng-model="group.title"><div class="text-overflow flex-none" ng-if="!group.editingName">{{ group.title }}</div></div><md-button class="md-icon-button flex-none layout-align-center-center" ng-show="group.editingName" ng-click="$ctrl.cancelEditing(group)" aria-label="Cancel"><md-icon md-svg-icon="icons:cross"></md-icon></md-button><md-menu class="flex-none layout-column" md-position-mode="target-right target" ng-show="!group.editingName"><md-button class="md-icon-button flex-none layout-align-center-center" ng-click="$mdOpenMenu(); groupId = $index" aria-label="Menu"><md-icon md-svg-icon="icons:dots"></md-icon></md-button><md-menu-content width="4"><md-menu-item ng-repeat="action in $ctrl.groupMenuActions"><md-button ng-click="action.callback(groupId)">{{ action.title }}</md-button></md-menu-item></md-menu-content></md-menu></div></div><div class="pip-draggable-group fict-group layout-align-center-center layout-column tm16" pip-drop="true" pip-drop-success="$ctrl.onDropToFictGroupListener($event)" pip-enter="$ctrl.onDropEnterListener(null, $event)" pip-leave="$ctrl.onDropLeaveListener(null, $event)" pip-deactive="$ctrl.onDropDeactivateListener(null, $event)"><div class="fict-group-text-container"><md-icon md-svg-icon="icons:plus"></md-icon>{{ \'DROP_TO_CREATE_NEW_GROUP\' | translate }}</div></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipDashboard.Templates');
} catch (e) {
  module = angular.module('pipDashboard.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('event_tile/ConfigDialogExtension.html',
    '<div class="w-stretch"><md-input-container class="w-stretch bm0"><label>Title:</label> <input type="text" ng-model="$ctrl.title"></md-input-container>Date:<md-datepicker ng-model="$ctrl.date" class="w-stretch bm8"></md-datepicker><md-input-container class="w-stretch"><label>Description:</label> <textarea type="text" ng-model="$ctrl.text">\n' +
    '    </textarea></md-input-container>Backdrop\'s opacity:<md-slider aria-label="opacity" type="number" min="0.1" max="0.9" step="0.01" ng-model="$ctrl.opacity" ng-change="$ctrl.onOpacitytest($ctrl.opacity)"></md-slider></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipDashboard.Templates');
} catch (e) {
  module = angular.module('pipDashboard.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('event_tile/EventTile.html',
    '<img ng-if="$ctrl.options.image" ng-src="{{$ctrl.options.image}}" alt="{{$ctrl.options.title || $ctrl.options.name}}"><div class="text-backdrop" style="background-color: rgba(0, 0, 0, {{ $ctrl.opacity }})"><div class="tile-heading layout-row layout-align-start-center flex-none"><span class="tile-title flex-auto text-overflow">{{ $ctrl.options.title || $ctrl.options.name }}</span></div><div class="text-container flex-auto pip-scroll"><p class="date flex-none" ng-if="$ctrl.options.date">{{ $ctrl.options.date }}</p><p class="text flex-auto">{{ $ctrl.options.text || $ctrl.options.description }}</p></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipDashboard.Templates');
} catch (e) {
  module = angular.module('pipDashboard.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('menu_tile/MenuTile.html',
    '<md-menu class="tile-menu" md-position-mode="target-right target"><md-button class="md-icon-button flex-none" ng-click="$mdOpenMenu()" aria-label="Menu"><md-icon md-svg-icon="icons:vdots"></md-icon></md-button><md-menu-content width="4"><md-menu-item ng-repeat="item in $ctrl.menu"><md-button ng-if="!item.submenu" ng-click="item.action(item, $index)">{{:: item.title }}</md-button><md-menu ng-if="item.submenu"><md-button ng-click="item.action(item, $index)">{{:: item.title }}</md-button><md-menu-content><md-menu-item ng-repeat="subitem in item.submenu"><md-button ng-click="subitem.action(item, $index)">{{:: subitem.title }}</md-button></md-menu-item></md-menu-content></md-menu></md-menu-item></md-menu-content></md-menu>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipDashboard.Templates');
} catch (e) {
  module = angular.module('pipDashboard.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('note_tile/ConfigDialogExtension.html',
    '<div class="w-stretch"><md-input-container class="w-stretch bm0"><label>Title:</label> <input type="text" ng-model="$ctrl.title"></md-input-container><md-input-container class="w-stretch tm0"><label>Text:</label> <textarea type="text" ng-model="$ctrl.text">\n' +
    '    </textarea></md-input-container></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipDashboard.Templates');
} catch (e) {
  module = angular.module('pipDashboard.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('note_tile/NoteTile.html',
    '<div class="tile-heading layout-row layout-align-start-center flex-none" ng-if="$ctrl.options.title || $ctrl.options.name"><span class="tile-title flex-auto text-overflow">{{ $ctrl.options.title || $ctrl.options.name }}</span></div><div class="text-container flex-auto pip-scroll"><p>{{ $ctrl.options.text }}</p></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipDashboard.Templates');
} catch (e) {
  module = angular.module('pipDashboard.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('picture_slider_tile/PictureSliderTile.html',
    '<div class="tile-heading layout-row layout-align-start-center flex-none"><span class="tile-title flex-auto text-overflow">{{ $ctrl.options.title || $ctrl.options.name }}</span></div><div class="slider-container"><div pip-image-slider="" pip-animation-type="\'fading\'" pip-animation-interval="$ctrl.animationInterval" ng-if="$ctrl.animationType == \'fading\'"><div class="pip-animation-block" ng-repeat="slide in $ctrl.options.slides"><img ng-src="{{ slide.image }}" alt="{{ slide.image }}" pip-image-load="$ctrl.onImageLoad($event)"><p class="slide-text" ng-if="slide.text">{{ slide.text }}</p></div></div><div pip-image-slider="" pip-animation-type="\'carousel\'" pip-animation-interval="$ctrl.animationInterval" ng-if="$ctrl.animationType == \'carousel\'"><div class="pip-animation-block" ng-repeat="slide in $ctrl.options.slides"><img ng-src="{{ slide.image }}" alt="{{ slide.image }}" pip-image-load="$ctrl.onImageLoad($event)"><p class="slide-text" ng-if="slide.text">{{ slide.text }}</p></div></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipDashboard.Templates');
} catch (e) {
  module = angular.module('pipDashboard.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('position_tile/ConfigDialogExtension.html',
    '<div class="w-stretch"><md-input-container class="w-stretch bm0"><label>Location name:</label> <input type="text" ng-model="$ctrl.locationName"></md-input-container></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipDashboard.Templates');
} catch (e) {
  module = angular.module('pipDashboard.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('position_tile/PositionTile.html',
    '<div class="tile-heading lp16 rp8 layout-row layout-align-end-center flex-none" ng-if="$ctrl.options.locationName"><span class="flex tile-title text-overflow">{{ $ctrl.options.locationName }}</span></div><pip-location-map class="flex" ng-if="$ctrl.showPosition" pip-stretch="true" pip-rebind="true" pip-location-pos="$ctrl.options.location"></pip-location-map>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipDashboard.Templates');
} catch (e) {
  module = angular.module('pipDashboard.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('statistics_tile/StatisticsTile.html',
    '<div class="tile-heading layout-row layout-align-start-center flex-none"><span class="tile-title flex-auto text-overflow">{{ $ctrl.options.title || $ctrl.options.name }}</span></div><div class="flex-auto layout-row layout-align-center-center" ng-if="$ctrl.options.series && !$ctrl.reset"><pip-pie-chart pip-series="$ctrl.options.series" ng-if="!$ctrl.options.chartType || $ctrl.options.chartType == \'pie\'" pip-donut="true" pip-pie-size="$ctrl.chartSize" pip-show-total="true" pip-centered="true"></pip-pie-chart></div>');
}]);
})();



},{}]},{},[15,27])(27)
});

//# sourceMappingURL=pip-webui-dashboard.js.map
