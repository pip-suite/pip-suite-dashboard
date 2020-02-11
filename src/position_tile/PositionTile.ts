import {
  DashboardTile
} from '../common_tile/DashboardTile';
import {
  ITileConfigService
} from '../config_tile_dialog/ConfigDialogService';
import { IDashboardProvider, IDashboardTileTypeOptions } from '../utility/IDashboardService';
{
  class PositionTileController extends DashboardTile {
    public showPosition: boolean = true;

    constructor(
      $scope: angular.IScope,
      private $timeout: angular.ITimeoutService,
      private $element: any,
      private pipTileConfigDialogService: ITileConfigService,
      private pipLocationEditDialog: any,
    ) {
      super();
      this.options.menu.push({
        title: 'Configurate',
        action: () => {
          this.onConfigClick();
        }
      });
      this.options.menu.push({
        title: 'Change location',
        action: () => {
          this.openLocationEditDialog();
        }
      });

      this.options.location = this.options.location || this.options.position;

      $scope.$watch('$ctrl.options.location', () => {
        this.reDrawPosition();
      });

      // TODO it doesn't work
      $scope.$watch(() => {
        return $element.is(':visible');
      }, (newVal) => {
        if (newVal == true) this.reDrawPosition();
      });
    }

    private onConfigClick() {
      this.pipTileConfigDialogService.show({
        dialogClass: 'pip-position-config',
        locals: {
          size: this.options.size,
          locationName: this.options.locationName,
          hideColors: true,
        },
        extensionUrl: 'position_tile/ConfigDialogExtension.html'
      }, (result: any) => {
        this.changeSize(result.size);
        this.options.locationName = result.locationName;
      });
    }

    public changeSize(params) {
      this.options.size.colSpan = params.sizeX;
      this.options.size.rowSpan = params.sizeY;

      this.reDrawPosition();
    }

    public openLocationEditDialog() {
      this.pipLocationEditDialog.show({
        locationName: this.options.locationName,
        locationPos: this.options.location
      }, (newPosition) => {
        if (newPosition) {
          this.options.location = newPosition.location;
          this.options.locationName = newPosition.locatioName;
        }
      });
    }

    private reDrawPosition() {
      this.showPosition = false;
      this.$timeout(() => {
        this.showPosition = true;
      }, 50);
    }
  }


  const PositionTile: IDashboardTileTypeOptions = {
    name: 'position',
    class: 'pip-position-tile',
    controllerAs: '$ctrl',
    controller: PositionTileController,
    templateUrl: 'position_tile/PositionTile.html'
  }

  const config = function(pipDashboardProvider: IDashboardProvider) {
    pipDashboardProvider.registerTileType(PositionTile);
  }

  angular
    .module('pipDashboard')
    .config(config);
}