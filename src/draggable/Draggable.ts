declare var interact;

import {
  DragTileService,
  IDragTileService,
  IDragTileConstructor
} from './DraggableTileService';
import {
  TilesGridService,
  ITilesGridService,
  ITilesGridConstructor
} from '../tile_group/TileGroupService';

export const DEFAULT_TILE_WIDTH: number = 150;
export const DEFAULT_TILE_HEIGHT: number = 150;
export const UPDATE_GROUPS_EVENT = "pipUpdateDashboardGroupsConfig";

const SIMPLE_LAYOUT_COLUMNS_COUNT: number = 2;
const DEFAULT_OPTIONS = {
  tileWidth: DEFAULT_TILE_WIDTH, // 'px'
  tileHeight: DEFAULT_TILE_HEIGHT, // 'px'
  gutter: 0, // 'px'
  container: 'pip-draggable-grid:first-of-type',
  //mobileBreakpoint       : XXX,   // Get from pipMedia Service in the constructor
  activeDropzoneClass: 'dropzone-active',
  groupContaninerSelector: '.pip-draggable-group:not(.fict-group)',
};

{
  interface IDraggableBindings {
      tilesTemplates: any;
      tilesContext: any;
      options: any;
      groupMenuActions: any;
      $container: JQuery;
  }

  interface IDraggableControllerScope extends ng.IScope {
    $container: JQuery;
    tilesTemplates: any;
    options: any;
  }

  interface ITileScope extends ng.IScope {
    index: number | string;
    groupIndex: number | string;
  }

  class DraggableController implements ng.IComponentController, IDraggableBindings {
    public opts: any;
    public groups: any;
    public sourceDropZoneElem: any = null;
    public isSameDropzone: boolean = true;
    public tileGroups: any = null;
    public availableWidth: number;
    public availableColumns: number;
    public groupsContainers: any;
    public container: any;
    public activeDraggedGroup: any;
    public draggedTile: any;
    public containerOffset: any;
    public tilesTemplates: any;
    public tilesContext: any;
    public options: any;
    public groupMenuActions: any;
    public $container: JQuery;

    constructor(
      private $scope: IDraggableControllerScope,
      private $rootScope: angular.IRootScopeService,
      private $compile: angular.ICompileService,
      private $timeout: angular.ITimeoutService,
      private $element: JQuery,
      pipDragTile: IDragTileService,
      pipTilesGrid: ITilesGridService,
      pipMedia: pip.layouts.IMediaService
    ) {
      this.opts = _.merge({
        mobileBreakpoint: pipMedia.breakpoints.xs
      }, DEFAULT_OPTIONS, this.options);
console.log('this.options', this.options);

console.log('this.opts', this.opts);
      this.groups = this.tilesTemplates.map((group, groupIndex) => {
        return {
          title: group.title,
          editingName: false,
          index: groupIndex,
          source: group.source.map((tile) => {
            const tileScope = this.createTileScope(tile);

            return IDragTileConstructor(DragTileService, {
              tpl: $compile(tile.template)(tileScope),
              options: tile.opts,
              size: tile.opts.size
            });
          })
        };
      });

      // Add templates watcher
      $scope.$watch('$ctrl.tilesTemplates', (newVal) => {
        this.watch(newVal);
      }, true);

      // Initialize data
      this.initialize();

      // Resize handler TODO: replace by pip resize watchers
      $(window).on('resize', _.debounce(() => {
        this.availableWidth = this.getContainerWidth();
        this.availableColumns = this.getAvailableColumns(this.availableWidth);

        this.tileGroups.forEach((group) => {
          group
            .setAvailableColumns(this.availableColumns)
            .generateGrid(this.getSingleTileWidthForMobile(this.availableWidth))
            .setTilesDimensions()
            .calcContainerHeight();
        });
      }, 50));

      this.$rootScope.$on('draggable:start', (data, event) => {
        this.onDragStartListener(event);
      });

      this.$rootScope.$on('draggable:move', (data, event) => {
        this.onDragMoveListener(event);
      });

      this.$rootScope.$on('draggable:end', (data, event) => {
        this.onDragEndListener();
      });
    }

    // Post link function
    public $postLink() {
      this.$container = this.$element;
    }

    // Watch handler
    private watch(newVal) {
      const prevVal = this.groups;
      let changedGroupIndex = null;

      if (newVal.length > prevVal.length) {
        this.addGroup(newVal[newVal.length - 1]);

        return;
      }

      if (newVal.length < prevVal.length) {
        this.removeGroups(newVal);

        return;
      }

      for (let i = 0; i < newVal.length; i++) {
        const groupWidgetDiff = prevVal[i].source.length - newVal[i].source.length;
        if (groupWidgetDiff || (newVal[i].removedWidgets && newVal[i].removedWidgets.length > 0)) {
          changedGroupIndex = i;

          if (groupWidgetDiff < 0) {
            const newTiles = newVal[changedGroupIndex].source.slice(groupWidgetDiff);

            _.each(newTiles, (tile) => {
              console.log('tile', tile);
            });

            this.addTilesIntoGroup(newTiles, this.tileGroups[changedGroupIndex], this.groupsContainers[changedGroupIndex]);

            this.$timeout(() => {
              this.updateTilesGroups();
            });
          } else {
            this.removeTiles(this.tileGroups[changedGroupIndex], newVal[changedGroupIndex].removedWidgets, this.groupsContainers[changedGroupIndex]);
            this.updateTilesOptions(newVal);
            this.$timeout(() => {
              this.updateTilesGroups();
            });
          }

          return;
        }
      }

      if (newVal && this.tileGroups) {
        this.updateTilesOptions(newVal);
        this.$timeout(() => {
          this.updateTilesGroups();
        });
      }
    }

    // Inline edit group handlers
    public onTitleClick(group, event) {
      if (!group.editingName) {
        group.oldTitle = _.clone(group.title);
        group.editingName = true;
        this.$timeout(() => {
          $(event.currentTarget.children[0]).focus();
        });
      }
    }

    public cancelEditing(group) {
      group.title = group.oldTitle;
    }

    public onBlurTitleInput(group) {
      this.$timeout(() => {
        group.editingName = false;
        this.$rootScope.$broadcast(UPDATE_GROUPS_EVENT, this.groups);
        // Update title in outer scope
        this.tilesTemplates[group.index].title = group.title;
      }, 100);
    }

    public onKyepressTitleInput(group, event) {
      if (event.keyCode === 13) {
        this.onBlurTitleInput(group);
      }
    }

    // Update outer scope functions
    private updateTilesTemplates(updateType: string, source ? : any) {
      switch (updateType) {
        case 'addGroup':
          if (this.groups.length !== this.tilesTemplates.length) {
            this.tilesTemplates.push(source);
          }
          break;
        case 'moveTile':
          const {
            fromIndex,
            toIndex,
            tileOptions,
            fromTileIndex
          } = {
            fromIndex: source.from.elem.attributes['data-group-id'].value,
            toIndex: source.to.elem.attributes['data-group-id'].value,
            tileOptions: source.tile.opts.options,
            fromTileIndex: source.tile.opts.options.index
          }
          this.tilesTemplates[fromIndex].source.splice(fromTileIndex, 1);
          this.tilesTemplates[toIndex].source.push({
            opts: tileOptions
          });

          this.reIndexTiles(source.from.elem);
          this.reIndexTiles(source.to.elem);
          break;
      }
    }

    // Manage tiles functions
    private createTileScope(tile: any): ITileScope {
      const tileScope = < ITileScope > this.$rootScope.$new(false, this.tilesContext);
      tileScope.index = tile.opts.index == undefined ? tile.opts.options.index : tile.opts.index;
      tileScope.groupIndex = tile.opts.groupIndex == undefined ? tile.opts.options.groupIndex : tile.opts.groupIndex;

      return tileScope;
    }

    private removeTiles(group, indexes, container) {
      const tiles = $(container).find('.pip-draggable-tile');

      _.each(indexes, (index) => {
        group.tiles.splice(index, 1);
        tiles[index].remove();
      });

      this.reIndexTiles(container);
    }

    private reIndexTiles(container, gIndex ? ) {
      const tiles = $(container).find('.pip-draggable-tile'),
        groupIndex = gIndex === undefined ? container.attributes['data-group-id'].value : gIndex;

      _.each(tiles, (tile, index) => {
        const child = $(tile).children()[0];
        angular.element(child).scope()['index'] = index;
        angular.element(child).scope()['groupIndex'] = groupIndex;
      });
    }

    private removeGroups(newGroups) {
      const removeIndexes = [],
        remain = [],
        containers = [];

      _.each(this.groups, (group, index) => {
        if (_.findIndex(newGroups, (g) => {
            return g['title'] === group.title
          }) < 0) {
          removeIndexes.push(index);
        } else {
          remain.push(index);
        }
      });

      _.each(removeIndexes.reverse(), (index) => {
        this.groups.splice(index, 1);
        this.tileGroups.splice(index, 1);
      });

      _.each(remain, (index) => {
        containers.push(this.groupsContainers[index]);
      });

      this.groupsContainers = containers;

      _.each(this.groupsContainers, (container, index) => {
        this.reIndexTiles(container, index);
      });
    }

    private addGroup(sourceGroup, afterFict = false) {
      const group = {
        title: sourceGroup.title,
        source: sourceGroup.source.map((tile) => {
          const tileScope = this.createTileScope(tile);

          return IDragTileConstructor(DragTileService, {
            tpl: this.$compile(this.wrapComponent(tile.template))(tileScope),
            options: tile.opts,
            size: tile.opts.size
          });
        })
      };

      this.groups.push(group);
      if (afterFict && !this.$scope.$$phase) this.$scope.$apply();

      this.$timeout(() => {
        this.groupsContainers = document.querySelectorAll(this.opts.groupContaninerSelector);
        this.tileGroups.push(
          ITilesGridConstructor(TilesGridService, group.source, this.opts, this.availableColumns, this.groupsContainers[this.groupsContainers.length - 1])
          .generateGrid(this.getSingleTileWidthForMobile(this.availableWidth))
          .setTilesDimensions()
          .calcContainerHeight()
        );
      });

      this.updateTilesTemplates('addGroup', sourceGroup);
    }

    private wrapComponent(content): any {
      return $('<div>')
          .addClass('pip-draggable-tile')
          .attr('pip-drag', 'true')
          .attr('pip-scroll-container', "'.pip-dashboard-scroll'")
          .append(content)
          .get(0);
    }

    private addTilesIntoGroup(newTiles, group, groupContainer) {
      newTiles.forEach((tile) => {
        const tileScope = this.createTileScope(tile);

        const newTile = IDragTileConstructor(DragTileService, {
          tpl: this.$compile(this.wrapComponent(tile.template))(tileScope),
          options: tile.opts,
          size: tile.opts.size
        });

        group.addTile(newTile);

        $(newTile.getCompiledTemplate())
          .appendTo(groupContainer);
      });
    }

    private updateTilesOptions(optionsGroup) {
      optionsGroup.forEach((optionGroup) => {
        optionGroup.source.forEach((tileOptions) => {
          this.tileGroups.forEach((group) => {
            group.updateTileOptions(tileOptions.opts);
          });
        });
      });
    }

    private initTilesGroups(tileGroups, opts, groupsContainers) {
      return tileGroups.map((group, index) => {
        return ITilesGridConstructor(TilesGridService, group.source, opts, this.availableColumns, groupsContainers[index])
          .generateGrid(this.getSingleTileWidthForMobile(this.availableWidth))
          .setTilesDimensions()
          .calcContainerHeight();
      });
    }

    private updateTilesGroups(onlyPosition ? , draggedTile ? ) {
      this.tileGroups.forEach((group) => {
        if (!onlyPosition) {
          group.generateGrid(this.getSingleTileWidthForMobile(this.availableWidth));
        }

        group
          .setTilesDimensions(onlyPosition, draggedTile)
          .calcContainerHeight(this.options.tileHeight);
      });
    }

    private getContainerWidth(): any {
      const container = this.$container || $('body');
      return container.width();
    }

    private getAvailableColumns(availableWidth): any {
      return this.opts.mobileBreakpoint > availableWidth ? SIMPLE_LAYOUT_COLUMNS_COUNT :
        Math.floor(availableWidth / (this.opts.tileWidth + this.opts.gutter));
    }

    private getActiveGroupAndTile(elem): any {
      const active = {};

      this.tileGroups.forEach((group) => {
        const foundTile = group.getTileByNode(elem);

        if (foundTile) {
          active['group'] = group;
          active['tile'] = foundTile;
          return;
        }
      });

      return active;
    }

    private getSingleTileWidthForMobile(availableWidth): any {
      console.log('gut', this.opts.gutter);
      return this.opts.mobileBreakpoint > availableWidth ? availableWidth / 2 - this.opts.gutter : null;
    }

    public onDragStartListener(event) {
      if (!event.x) return;
console.log('drag start');
      event.target = event.element.get(0);

      const activeEntities = this.getActiveGroupAndTile(event.target);

      this.container = $(event.target).parent('.pip-draggable-group').get(0);
      this.sourceDropZoneElem = this.container;
      this.draggedTile = activeEntities['tile'];
      this.activeDraggedGroup = activeEntities['group'];
console.log('activeDraggedGroup', this.activeDraggedGroup);
      this.$element.addClass('drag-transfer');

      this.draggedTile.startDrag();
    }

    public onDragMoveListener(event) {
      const target = event.element.get(0);
console.log('drag move');
      this.containerOffset = this.getContainerOffset();
      
      const belowElement = this.activeDraggedGroup.getTileByCoordinates({
        left: event.x - this.containerOffset.left,
        top: event.y - this.containerOffset.top
      }, this.draggedTile);

      if (belowElement) {
        const draggedTileIndex = this.activeDraggedGroup.getTileIndex(this.draggedTile);
        const belowElemIndex = this.activeDraggedGroup.getTileIndex(belowElement);

        if ((draggedTileIndex + 1) === belowElemIndex) {
          return;
        }

        this.activeDraggedGroup
          .swapTiles(this.draggedTile, belowElement)
          .setTilesDimensions(true, this.draggedTile);

        this.$timeout(() => {
          this.setGroupContainersHeight();
        }, 0);
      }
    }

    public onDragEndListener() {
      if (!this.draggedTile) return;
console.log('drag end');
      this.draggedTile.stopDrag(false);
      this.$element.removeClass('drag-transfer');
    }

    private getContainerOffset() {
      const containerRect = this.container.getBoundingClientRect();

      return {
        left: containerRect.left,
        top: containerRect.top
      };
    }

    private setGroupContainersHeight() {
      this.tileGroups.forEach((tileGroup) => {
        tileGroup.calcContainerHeight();
      });
    }

    private moveTile(from, to, tile) {
      let elem;
      const movedTile = from.removeTile(tile);
      const tileScope = this.createTileScope(tile);

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
    }

    public onDropListener(droppedGroupIndex, event) {
      if (!this.draggedTile) return;

      const droppedGroup = this.tileGroups[droppedGroupIndex];

      if (this.activeDraggedGroup !== droppedGroup) {
        this.moveTile(this.activeDraggedGroup, droppedGroup, this.draggedTile);
      }

      this.groupsContainers[droppedGroupIndex].classList.remove(this.opts.activeDropzoneClass);
      $('body').css('cursor', '');

      this.updateTilesGroups(true);
      this.sourceDropZoneElem = null;
      this.activeDraggedGroup = null;
      this.draggedTile = null;
    }

    public onDropToFictGroupListener(event) {
      const from = this.activeDraggedGroup;
      const tile = this.draggedTile;

      this.addGroup({
        title: 'New group',
        source: []
      }, true);
      this.$timeout(() => {
        this.moveTile(from, this.tileGroups[this.tileGroups.length - 1], tile);
        this.updateTilesGroups(true);
      });
      $('body').css('cursor', '');

      this.sourceDropZoneElem = null;
      this.activeDraggedGroup = null;
      this.draggedTile = null;
    }

    public onDropEnterListener(groupIndex, event) {
      if (!this.sourceDropZoneElem) {
        this.sourceDropZoneElem = this.groupsContainers[groupIndex];
      }
console.log('sourceDropZoneElem', this.sourceDropZoneElem);
      if (groupIndex !== null && this.sourceDropZoneElem !== this.groupsContainers[groupIndex]) {
        this.groupsContainers[groupIndex].classList.add('dropzone-active');
        $('body').css('cursor', 'copy');
        this.isSameDropzone = false;
      } else {
        $('body').css('cursor', '');
        this.isSameDropzone = true;
      }
    }

    public onDropDeactivateListener(groupIndex, event) {
      if (this.sourceDropZoneElem !== event.target && groupIndex !== null) {
        this.groupsContainers[groupIndex].classList.remove(this.opts.activeDropzoneClass);
        $('body').css('cursor', '');
      }
    }

    public onDropLeaveListener(groupIndex, event) {
      if (groupIndex !== null) this.groupsContainers[groupIndex].classList.remove(this.opts.activeDropzoneClass);
    }

    private initialize() {
      this.$timeout(() => {
        this.availableWidth = this.getContainerWidth();
        this.availableColumns = this.getAvailableColumns(this.availableWidth);
        this.groupsContainers = document.querySelectorAll(this.opts.groupContaninerSelector);
        this.tileGroups = this.initTilesGroups(this.groups, this.opts, this.groupsContainers);
/*
        interact('.pip-draggable-tile')
          .draggable({
            inertia: true,
            autoScroll: {
              enabled: true,
              container: $('#content').get(0),
              speed: 1000
            },
            onstart: (event) => {
              this.onDragStartListener(event)
            },
            onmove: (event) => {
              this.onDragMoveListener(event)
            },
            onend: (event) => {
              this.onDragEndListener()
            }
          });

        interact('.pip-draggable-group.fict-group')
          .dropzone({
            ondrop: (event) => {
              this.onDropToFictGroupListener(event)
            },
            ondragenter: (event) => {
              this.onDropEnterListener(event)
            },
            ondropdeactivate: (event) => {
              this.onDropDeactivateListener(event)
            },
            ondragleave: (event) => {
              this.onDropLeaveListener(event)
            }
          });

        interact('.pip-draggable-group')
          .dropzone({
            ondrop: (event) => {
              this.onDropListener(event)
            },
            ondragenter: (event) => {
              this.onDropEnterListener(event)
            },
            ondropdeactivate: (event) => {
              this.onDropDeactivateListener(event)
            },
            ondragleave: (event) => {
              this.onDropLeaveListener(event)
            }
          });

          */
      }, 0);
    }
  }

  const DragComponent: ng.IComponentOptions = {
    bindings: {
      tilesTemplates: '=pipTilesTemplates',
      tilesContext: '=pipTilesContext',
      options: '=pipDraggableGrid',
      groupMenuActions: '=pipGroupMenuActions'
    },
    //controllerAs: 'DraggedCtrl',
    templateUrl: 'draggable/Draggable.html',
    controller: DraggableController
  }

  angular.module('pipDraggableTiles')
    .component('pipDraggableGrid', DragComponent);
}