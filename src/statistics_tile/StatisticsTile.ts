import {
  DashboardTile
} from '../common_tile/DashboardTile';
import { IDashboardProvider, IDashboardTileTypeOptions } from '../utility/IDashboardService';
{
  const SMALL_CHART: number = 70;
  const BIG_CHART: number = 250;

  class StatisticsTileController extends DashboardTile {
    private _$scope: angular.IScope;
    private _$timeout: angular.ITimeoutService;

    public reset: boolean = false;
    public chartSize: number = SMALL_CHART;

    constructor(
      $scope: angular.IScope,
      $timeout: angular.ITimeoutService
    ) {
      super();
      this._$scope = $scope;
      this._$timeout = $timeout;

      if (this.options) {
        this.menu = this.options.menu ? _.union(this.menu, this.options.menu) : this.menu;
      }

      this.setChartSize();
    }

    public changeSize(params) {
      this.options.size.colSpan = params.sizeX;
      this.options.size.rowSpan = params.sizeY;

      this.reset = true;
      this.setChartSize();
      this._$timeout(() => {
        this.reset = false;
      }, 500);
    }

    private setChartSize() {
      this.chartSize = this.options.size.colSpan == 2 && this.options.size.rowSpan == 2 ? BIG_CHART : SMALL_CHART;
    }
  }


  const StatisticsTile: IDashboardTileTypeOptions = {
    name: 'statistics',
    class: 'pip-statistics-tile',
    controllerAs: '$ctrl',
    controller: StatisticsTileController,
    templateUrl: 'statistics_tile/StatisticsTile.html'
  }

  const config = function(pipDashboardProvider: IDashboardProvider) {
    pipDashboardProvider.registerTileType(StatisticsTile);
  }

  angular
    .module('pipDashboard')
    .config(config);
}