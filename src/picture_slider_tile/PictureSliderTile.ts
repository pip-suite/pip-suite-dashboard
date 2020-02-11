import {
  DashboardTile
} from '../common_tile/DashboardTile';
import {
  ITileConfigService
} from '../config_tile_dialog/ConfigDialogService';
import {
  ITileTemplateService
} from '../utility/TileTemplateUtility';

import { IDashboardProvider, IDashboardTileTypeOptions } from '../utility/IDashboardService';

{
  class PictureSliderController extends DashboardTile {
    public animationType: string = 'fading';
    public animationInterval: number = 5000;

    constructor(
      private $scope: angular.IScope,
      private $element: any,
      private $timeout: angular.ITimeoutService,
      private pipTileTemplate: ITileTemplateService
    ) {
      super();

      if (this.options) {
        this.animationType = this.options.animationType || this.animationType;
        this.animationInterval = this.options.animationInterval || this.animationInterval;
      }
    }

    public onImageLoad($event) {
      this.$timeout(() => {
        this.pipTileTemplate.setImageMarginCSS(this.$element.parent(), $event.target);
      });
    }

    public changeSize(params) {
      this.options.size.colSpan = params.sizeX;
      this.options.size.rowSpan = params.sizeY;

      this.$timeout(() => {
        _.each(this.$element.find('img'), (image) => {
          this.pipTileTemplate.setImageMarginCSS(this.$element.parent(), image);
        });
      }, 500);
    }
  }

  const PictureSliderTile:IDashboardTileTypeOptions = {
    name: 'picture-slider',
    controller: PictureSliderController,
    controllerAs: '$ctrl',
    class: 'pip-picture-slider-tile',
    templateUrl: 'picture_slider_tile/PictureSliderTile.html'
  }

  const config = function(pipDashboardProvider: IDashboardProvider) {
    pipDashboardProvider.registerTileType(PictureSliderTile);
  }

  angular
    .module('pipDashboard')
    .config(config);
}