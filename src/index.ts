// Import services
import './tile_group/index';
import './draggable';

// Import tile services
import './menu_tile';

// Import dialogs
import './add_tile_dialog';
import './config_tile_dialog';

angular.module('pipDashboard', [
  // Services
  'pipDraggableTiles',
  'pipDraggableTilesGroup',
  // Tile services
  'pipMenuTile',
  // Dialogs
  'pipConfigDashboardTileDialog',
  'pipAddDashboardTileDialog',
  //Templates
  'pipDashboard.Templates',
  // External pip modules
  'pipLayout',
  'pipLocations',
  'pipDate',
  'pipCharts',
  'pipTranslate',
  'pipControls',
  'pipButtons',
  'pipBehaviors'
]);


// Import utility 
import './utility/TileTemplateUtility';
import './utility/DashboardService';
// Import tiles
import './common_tile/DashboardTile';
import './common_tile/DynamicTile';
import './event_tile/EventTile';
import './note_tile/NoteTile';
import './picture_slider_tile/PictureSliderTile';
import './position_tile/PositionTile';
import './statistics_tile/StatisticsTile';
// Import common component
import './dashboard/Dashboard';
