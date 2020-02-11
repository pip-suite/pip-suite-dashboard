import {
  DashboardTile
} from '../common_tile/DashboardTile';
import {
  ITileConfigService
} from '../config_tile_dialog/ConfigDialogService';
import { IDashboardProvider, IDashboardTileTypeOptions } from '../utility/IDashboardService';
{
  class NoteTileController extends DashboardTile {

    constructor(
      private pipTileConfigDialogService: ITileConfigService,
      $scope
    ) {
      super();

      this.options.menu.push({
        title: 'Configurate',
        action: () => {
          this.onConfigClick();
        }
      });
      this.color = this.options.color || 'orange';
    }

    private onConfigClick() {
      this.pipTileConfigDialogService.show({
        locals: {
          color: this.color,
          size: this.options.size,
          title: this.options.title,
          text: this.options.text,
        },
        extensionUrl: 'note_tile/ConfigDialogExtension.html'
      }, (result: any) => {
        this.color = result.color;
        this.options.color = result.color;
        this.changeSize(result.size);
        this.options.text = result.text;
        this.options.title = result.title;
      });
    }
  }

  const NoteTile: IDashboardTileTypeOptions = {
    name: 'note',
    controller: NoteTileController,
    controllerAs: '$ctrl',
    class: 'pip-notes-tile',
    templateUrl: 'note_tile/NoteTile.html'
  }

  const config = function(pipDashboardProvider: IDashboardProvider) {
    pipDashboardProvider.registerTileType(NoteTile);
  }

  angular
    .module('pipDashboard')
    .config(config);
}