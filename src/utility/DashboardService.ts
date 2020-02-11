import { IDashboardProvider, IDashboardTileTypeOptions, IDashboardService } from './IDashboardService';

{
    class DashboardProvider implements IDashboardProvider {
        private tilesTypes: IDashboardTileTypeOptions[] = [];
        private _service: IDashboardService;

        constructor( ) { }

        public registerTileType(newTileTypeOptions: IDashboardTileTypeOptions) {
            let newControllerName: string;
            let newTemplateUrl: string;

            if (typeof newTileTypeOptions.controller !== 'string') {
                newControllerName = 'pip' + newTileTypeOptions.name.substr(0, 1).toUpperCase() + newTileTypeOptions.name.substr(1) + 'Tile';

                angular.module('pipDashboard').controller(newControllerName, <angular.IControllerConstructor>newTileTypeOptions.controller);
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
        }

        public $get($templateCache) {
            "ngInject";

            if (this._service == null)
                this._service = new DashboardService(this.tilesTypes, $templateCache);

            return this._service;
        }
    }

    class DashboardService {
        constructor(
            private tileTypes: IDashboardTileTypeOptions[],
            private $templateCache: angular.ITemplateCacheService
        ) {
            this.putTemplates();
        }

        private putTemplates(): void {
            _.each(this.tileTypes, (type: IDashboardTileTypeOptions) => {
                if (type.template) this.$templateCache.put(type.templateUrl, type.template);
            });
        }

        public getTileTypes(): IDashboardTileTypeOptions[] {
            return this.tileTypes;
        }

        public getTypeByName(name: string): IDashboardTileTypeOptions {
            return _.find(this.tileTypes, (type: IDashboardTileTypeOptions) => {
                return type.name === name;
            });
        }
    }

    const config = function ($controllerProvider) {
        let app = angular.module('pipDashboard');

        (<any>app).controller = function (name: string, constructor: any): ng.IModule {
            $controllerProvider.register(name, constructor);
            return (this);
        };
    }

    angular
        .module('pipDashboard')
        .config(config)
        .provider('pipDashboard', DashboardProvider);
}