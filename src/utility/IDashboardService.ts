export interface IDashboardProvider {
    registerTileType(newTileTypeOptions: IDashboardTileTypeOptions): void;
}

export interface IDashboardService {
    getTileTypes(): IDashboardTileTypeOptions[];
    getTypeByName(name: string): IDashboardTileTypeOptions;
}

export interface IDashboardTileTypeOptions {
    name: string;
    controller: string | Function;
    controllerAs ? : string;
    template ? : string;
    templateUrl ? : string;
    class ? : string;
}