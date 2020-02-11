{
  const TileMenu: ng.IComponentOptions = {
    templateUrl: 'menu_tile/MenuTile.html',
    bindings: {
      menu: '<pipMenu'
    }
  };

  angular
    .module('pipMenuTile')
    .component('pipTileMenu', TileMenu);
}