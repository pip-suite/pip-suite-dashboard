{
  interface DraggableTileAttributes extends ng.IAttributes {
    pipDraggableTiles: any;
  }

  function DraggableTileLink(
    $scope: ng.IScope,
    $elem: JQuery,
    $attr: DraggableTileAttributes,
    $compile: angular.ICompileService
  ) {
    const docFrag = document.createDocumentFragment(),
      group = $scope.$eval($attr.pipDraggableTiles);

    group.forEach(function (tile) {
      const tpl = wrapComponent(tile.getCompiledTemplate());

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

  function DraggableTiles($compile): ng.IDirective {
    return {
      restrict: 'A',
      link: function (
        $scope: ng.IScope,
        $elem: JQuery,
        $attr: DraggableTileAttributes
      ) {
        new DraggableTileLink($scope, $elem, $attr, $compile);
      }
    };
  }

  angular
    .module('pipDraggableTilesGroup')
    .directive('pipDraggableTiles', DraggableTiles);
}